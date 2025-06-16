
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'pt-PT', name: 'Português Europeu' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#383b3e] border border-gray-700 text-gray-200 hover:bg-[#4a4d52] transition-colors">
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{getCurrentLanguage().code.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48 bg-[#383b3e] border-gray-700 shadow-lg z-50"
        align="end"
      >
        {languages.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between px-3 py-2.5 text-gray-200 hover:bg-[#4a4d52] focus:bg-[#4a4d52] cursor-pointer"
          >
            <span className="text-sm">{language.name}</span>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-blue-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
