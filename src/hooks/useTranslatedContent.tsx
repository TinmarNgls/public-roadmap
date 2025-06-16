
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translationService } from '@/services/translationService';

export function useTranslatedContent(originalText: string, originalLanguage: string = 'en') {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateContent = async () => {
      if (i18n.language === originalLanguage) {
        setTranslatedText(originalText);
        return;
      }

      setIsTranslating(true);
      try {
        const translated = await translationService.translateText(
          originalText,
          translationService.getLanguageName(originalLanguage),
          translationService.getLanguageName(i18n.language)
        );
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(originalText);
      } finally {
        setIsTranslating(false);
      }
    };

    if (originalText && originalText.trim()) {
      translateContent();
    }
  }, [originalText, originalLanguage, i18n.language]);

  return { translatedText, isTranslating };
}
