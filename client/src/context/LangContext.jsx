import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('jee-lang') || 'en');

  useEffect(() => {
    localStorage.setItem('jee-lang', lang);
  }, [lang]);

  const toggle = () => setLang(l => l === 'en' ? 'te' : 'en');
  const isTelugu = lang === 'te';

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, isTelugu }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
