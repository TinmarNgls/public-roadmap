
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { enhancedTranslationService } from '@/services/enhancedTranslationService';

interface UseEnhancedTranslationOptions {
  enabled?: boolean;
  debounceMs?: number;
}

export function useEnhancedTranslation(
  originalText: string, 
  originalLanguage: string = 'en',
  options: UseEnhancedTranslationOptions = {}
) {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasTranslated, setHasTranslated] = useState(false);
  const currentLanguageRef = useRef(i18n.language);
  const translationRequestRef = useRef<string>('');
  const { enabled = true, debounceMs = 50 } = options;

  useEffect(() => {
    // Reset if text changes
    if (translationRequestRef.current !== originalText) {
      setHasTranslated(false);
      translationRequestRef.current = originalText;
    }

    // Don't translate if disabled, empty text, or same language
    if (!enabled || !originalText || !originalText.trim() || i18n.language === originalLanguage) {
      setTranslatedText(originalText);
      setIsTranslating(false);
      setHasTranslated(true);
      currentLanguageRef.current = i18n.language;
      return;
    }

    // Only translate if language changed or hasn't been translated yet
    const languageChanged = currentLanguageRef.current !== i18n.language;
    if (!languageChanged && hasTranslated) {
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      setIsTranslating(true);
      currentLanguageRef.current = i18n.language;

      try {
        const translated = await enhancedTranslationService.translateText(
          originalText,
          enhancedTranslationService.getLanguageName(originalLanguage),
          enhancedTranslationService.getLanguageName(i18n.language)
        );
        
        // Only update if this is still the current request
        if (translationRequestRef.current === originalText && currentLanguageRef.current === i18n.language) {
          setTranslatedText(translated);
          setHasTranslated(true);
        }
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(originalText);
        setHasTranslated(true);
      } finally {
        setIsTranslating(false);
      }
    }, debounceMs);

    return () => clearTimeout(debounceTimeout);
  }, [originalText, originalLanguage, i18n.language, enabled, hasTranslated, debounceMs]);

  return { translatedText, isTranslating };
}
