"use client";

import { useLanguageStore } from "@/stores/useLanguageStore";
import Image from "next/image";
import svgs from "@/assets/svgs";
import { Select } from "antd";

const languageOptions = [
  { value: "vn", label: "Tiếng Việt", icon: svgs.vn },
  { value: "en", label: "English", icon: svgs.en },
  { value: "zh", label: "中文", icon: svgs.tw },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center gap-4 w-40">
      <Select
        value={language}
        onChange={setLanguage}
        placeholder="Select language"
        style={{ width: "100%" }}
        options={languageOptions.map((lang) => ({
          value: lang.value,
          label: (
            <div className="flex items-center gap-2">
              <Image src={lang.icon} alt={lang.label} width={20} height={15} />
              {lang.label}
            </div>
          ),
        }))}
      />
    </div>
  );
}
