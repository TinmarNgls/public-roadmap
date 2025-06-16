
import { supabase } from '@/integrations/supabase/client';

// Translation service for user-generated content
export class TranslationService {
  private static instance: TranslationService;
  private cache: Map<string, string> = new Map();

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Create a cache key for translation
  private getCacheKey(text: string, fromLang: string, toLang: string): string {
    return `${fromLang}-${toLang}-${text}`;
  }

  // Translate text using our Supabase edge function
  async translateText(text: string, fromLanguage: string, toLanguage: string): Promise<string> {
    if (fromLanguage === toLanguage) {
      return text;
    }

    // Skip translation for empty or very short text
    if (!text || text.trim().length < 2) {
      return text;
    }

    const cacheKey = this.getCacheKey(text, fromLanguage, toLanguage);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      console.log(`Translating: "${text}" from ${fromLanguage} to ${toLanguage}`);
      
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text,
          fromLanguage,
          toLanguage,
        },
      });

      if (error) {
        console.error('Translation API error:', error);
        throw new Error(`Translation failed: ${error.message}`);
      }

      console.log('Translation response data:', data);
      
      const translatedText = data.translatedText;

      if (!translatedText) {
        console.error('No translated text in response:', data);
        return text;
      }

      // Cache the result
      this.cache.set(cacheKey, translatedText);

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text if translation fails
      return text;
    }
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

export const translationService = TranslationService.getInstance();
