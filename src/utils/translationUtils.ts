
interface TranslatableContent {
  title_en: string;
  title_fr?: string;
  title_pt_pt?: string;
  title_pt_br?: string;
  content_en: string;
  content_fr?: string;
  content_pt_pt?: string;
  content_pt_br?: string;
}

export const getTranslatedContent = (
  content: TranslatableContent,
  language: string
): { title: string; content: string } => {
  // Map language codes to field suffixes
  const languageMap: Record<string, string> = {
    'en': 'en',
    'fr': 'fr',
    'pt-PT': 'pt_pt',
    'pt-BR': 'pt_br'
  };

  const suffix = languageMap[language];
  
  if (suffix) {
    const titleKey = `title_${suffix}` as keyof TranslatableContent;
    const contentKey = `content_${suffix}` as keyof TranslatableContent;
    
    const translatedTitle = content[titleKey] as string;
    const translatedContent = content[contentKey] as string;
    
    // Return translated content if available, otherwise fall back to English
    return {
      title: translatedTitle || content.title_en,
      content: translatedContent || content.content_en
    };
  }

  // Fallback to English content
  return {
    title: content.title_en,
    content: content.content_en
  };
};
