import React from 'react';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-dark-800/80 rounded-xl border border-white/10 backdrop-blur-md">
      <Globe className="w-4 h-4 text-primary-400 ml-1.5" />
      <button
        onClick={() => setLanguage('English')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          language === 'English'
            ? 'bg-primary-500 text-white shadow-glow-cyan'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('Tamil')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          language === 'Tamil'
            ? 'bg-primary-500 text-white shadow-glow-cyan'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
};

export default LanguageToggle;
