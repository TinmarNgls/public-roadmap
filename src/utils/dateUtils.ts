
export const formatAnnouncementDate = (dateString: string, language: string = 'en'): string => {
  const date = new Date(dateString);
  
  // Map i18n language codes to browser locale codes
  const localeMap: { [key: string]: string } = {
    'en': 'en-US',
    'fr': 'fr-FR',
    'pt-BR': 'pt-BR',
    'pt-PT': 'pt-PT'
  };
  
  const locale = localeMap[language] || 'en-US';
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
