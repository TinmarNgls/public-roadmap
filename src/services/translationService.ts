
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

    const cacheKey = this.getCacheKey(text, fromLanguage, toLanguage);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch('https://dhcgcgovgjxsgmtkimye.supabase.co/functions/v1/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          fromLanguage,
          toLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      const translatedText = data.translatedText;

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
