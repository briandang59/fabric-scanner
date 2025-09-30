"use client";

import LanguageSwitcher from "@/components/SwitchLanguage";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";

export default function Home() {
  const { t } = useTranslationCustom();
  return (
    <div>
      {t.language.en}
      <LanguageSwitcher />
    </div>
  );
}
