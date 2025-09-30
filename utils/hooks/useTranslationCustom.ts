import en from "@/messages/en.json";
import vn from "@/messages/vn.json";
import zh from "@/messages/zh.json";
import { useLanguageStore } from "@/stores/useLanguageStore";

const translations = { en, vn, zh };

export const useTranslationCustom = () => {
  const lang = useLanguageStore((state) => state.language);
  const t = translations[lang];

  return { t, lang };
};
