import { create } from "zustand";

type Language = "en" | "vn" | "zh";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
}));
