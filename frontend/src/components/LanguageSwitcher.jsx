
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'en');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
      setLang(savedLang);
    }
  }, [i18n]);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    setLang(lng);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
      >
        <Globe className="w-4 h-4" />
        {lang.toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-28 bg-white border border-gray-200 rounded-md overflow-hidden shadow-lg">
          <button
            onClick={() => changeLang('en')}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-grab transition"
          >
            English
          </button>
          <button
            onClick={() => changeLang('vi')}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-grab transition"
          >
            Tiếng Việt
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;