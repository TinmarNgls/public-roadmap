
import { supabase } from '@/integrations/supabase/client';

interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
}

interface CachedTranslation {
  source_text: string;
  source_language: string;
  target_language: string;
  translated_text: string;
}

export class EnhancedTranslationService {
  private static instance: EnhancedTranslationService;
  private pendingBatch: Map<string, TranslationRequest> = new Map();
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 100; // ms
  private readonly MAX_BATCH_SIZE = 10;

  static getInstance(): EnhancedTranslationService {
    if (!EnhancedTranslationService.instance) {
      EnhancedTranslationService.instance = new EnhancedTranslationService();
    }
    return EnhancedTranslationService.instance;
  }

  private getCacheKey(text: string, fromLang: string, toLang: string): string {
    return `${fromLang}-${toLang}-${text}`;
  }

  // Check database cache for existing translations
  private async getCachedTranslations(requests: TranslationRequest[]): Promise<Map<string, string>> {
    const cachedTranslations = new Map<string, string>();
    
    if (requests.length === 0) return cachedTranslations;

    try {
      const { data, error } = await supabase
        .from('translations')
        .select('source_text, source_language, target_language, translated_text')
        .in('source_text', requests.map(r => r.text))
        .eq('source_language', requests[0].fromLanguage)
        .eq('target_language', requests[0].toLanguage);

      if (error) {
        console.error('Error fetching cached translations:', error);
        return cachedTranslations;
      }

      if (data) {
        data.forEach((translation: CachedTranslation) => {
          const key = this.getCacheKey(
            translation.source_text,
            translation.source_language,
            translation.target_language
          );
          cachedTranslations.set(key, translation.translated_text);
        });
      }
    } catch (error) {
      console.error('Error in getCachedTranslations:', error);
    }

    return cachedTranslations;
  }

  // Save translations to database cache
  private async saveTranslationsToCache(
    translations: Array<{
      sourceText: string;
      fromLanguage: string;
      toLanguage: string;
      translatedText: string;
    }>
  ): Promise<void> {
    try {
      const translationsToInsert = translations.map(t => ({
        source_text: t.sourceText,
        source_language: t.fromLanguage,
        target_language: t.toLanguage,
        translated_text: t.translatedText,
      }));

      const { error } = await supabase
        .from('translations')
        .upsert(translationsToInsert, {
          onConflict: 'source_text,source_language,target_language',
          ignoreDuplicates: true
        });

      if (error) {
        console.error('Error saving translations to cache:', error);
      }
    } catch (error) {
      console.error('Error in saveTranslationsToCache:', error);
    }
  }

  // Batch translate multiple texts at once
  private async batchTranslateWithAPI(requests: TranslationRequest[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    try {
      console.log(`Batch translating ${requests.length} texts from ${requests[0]?.fromLanguage} to ${requests[0]?.toLanguage}`);
      
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          texts: requests.map(r => r.text),
          fromLanguage: requests[0].fromLanguage,
          toLanguage: requests[0].toLanguage,
        },
      });

      if (error) {
        console.error('Batch translation API error:', error);
        // Return original texts as fallback
        requests.forEach(req => {
          const key = this.getCacheKey(req.text, req.fromLanguage, req.toLanguage);
          results.set(key, req.text);
        });
        return results;
      }

      if (data && data.translations) {
        const translationsToCache: Array<{
          sourceText: string;
          fromLanguage: string;
          toLanguage: string;
          translatedText: string;
        }> = [];

        requests.forEach((req, index) => {
          const translatedText = data.translations[index] || req.text;
          const key = this.getCacheKey(req.text, req.fromLanguage, req.toLanguage);
          results.set(key, translatedText);
          
          translationsToCache.push({
            sourceText: req.text,
            fromLanguage: req.fromLanguage,
            toLanguage: req.toLanguage,
            translatedText,
          });
        });

        // Save to cache asynchronously
        this.saveTranslationsToCache(translationsToCache).catch(console.error);
      }
    } catch (error) {
      console.error('Batch translation error:', error);
      // Return original texts as fallback
      requests.forEach(req => {
        const key = this.getCacheKey(req.text, req.fromLanguage, req.toLanguage);
        results.set(key, req.text);
      });
    }

    return results;
  }

  // Process the current batch
  private async processBatch(): Promise<void> {
    if (this.pendingBatch.size === 0) return;

    const requests = Array.from(this.pendingBatch.values());
    this.pendingBatch.clear();

    // Group by language pair
    const languagePairs = new Map<string, TranslationRequest[]>();
    requests.forEach(req => {
      const pairKey = `${req.fromLanguage}-${req.toLanguage}`;
      if (!languagePairs.has(pairKey)) {
        languagePairs.set(pairKey, []);
      }
      languagePairs.get(pairKey)!.push(req);
    });

    // Process each language pair
    for (const [, pairRequests] of languagePairs) {
      if (pairRequests.length === 0) continue;

      // Check cache first
      const cachedTranslations = await this.getCachedTranslations(pairRequests);
      
      // Filter out requests that are already cached
      const uncachedRequests = pairRequests.filter(req => {
        const key = this.getCacheKey(req.text, req.fromLanguage, req.toLanguage);
        return !cachedTranslations.has(key);
      });

      // Translate uncached requests
      if (uncachedRequests.length > 0) {
        const newTranslations = await this.batchTranslateWithAPI(uncachedRequests);
        
        // Merge with cached translations
        newTranslations.forEach((value, key) => {
          cachedTranslations.set(key, value);
        });
      }

      // Trigger callbacks for all requests in this batch
      pairRequests.forEach(req => {
        const key = this.getCacheKey(req.text, req.fromLanguage, req.toLanguage);
        const translatedText = cachedTranslations.get(key) || req.text;
        
        // Dispatch custom event with translation result
        window.dispatchEvent(new CustomEvent('translationReady', {
          detail: { key, translatedText }
        }));
      });
    }
  }

  // Public method to request translation
  async translateText(text: string, fromLanguage: string, toLanguage: string): Promise<string> {
    if (fromLanguage === toLanguage || !text || text.trim().length < 2) {
      return text;
    }

    const key = this.getCacheKey(text, fromLanguage, toLanguage);
    
    // Check if already in pending batch
    if (this.pendingBatch.has(key)) {
      return new Promise((resolve) => {
        const handler = (event: CustomEvent) => {
          if (event.detail.key === key) {
            window.removeEventListener('translationReady', handler as EventListener);
            resolve(event.detail.translatedText);
          }
        };
        window.addEventListener('translationReady', handler as EventListener);
      });
    }

    // Add to batch
    this.pendingBatch.set(key, { text, fromLanguage, toLanguage });

    // Set up batch processing
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    // Process immediately if batch is full, otherwise wait for timeout
    if (this.pendingBatch.size >= this.MAX_BATCH_SIZE) {
      this.processBatch();
    } else {
      this.batchTimeout = setTimeout(() => {
        this.processBatch();
        this.batchTimeout = null;
      }, this.BATCH_DELAY);
    }

    // Return a promise that resolves when translation is ready
    return new Promise((resolve) => {
      const handler = (event: CustomEvent) => {
        if (event.detail.key === key) {
          window.removeEventListener('translationReady', handler as EventListener);
          resolve(event.detail.translatedText);
        }
      };
      window.addEventListener('translationReady', handler as EventListener);
    });
  }

  // Convert language code to full language name for API
  getLanguageName(code: string): string {
    const languageMap: Record<string, string> = {
      'en': 'English',
      'fr': 'French',
      'pt-BR': 'Portuguese (Brazil)',
      'pt-PT': 'Portuguese (Portugal)',
    };
    return languageMap[code] || 'English';
  }
}

export const enhancedTranslationService = EnhancedTranslationService.getInstance();
