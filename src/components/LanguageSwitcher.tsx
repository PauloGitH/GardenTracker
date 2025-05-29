import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 rounded-md text-sm font-medium flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200"
      aria-label="Toggle language"
    >
      <Globe size={16} className="mr-1" />
      {i18n.language === 'en' ? 'ES' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher;
