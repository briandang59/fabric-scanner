"use client";
import { useState } from "react";
import svgs from "@/assets";
import { Drawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./SwitchLanguage";
import { Menu } from "lucide-react";
import { useTranslationCustom } from "@/utils/hooks/useTranslationCustom";
import { paths } from "@/utils/constants/paths";

function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslationCustom();

  const pages = [
    { label: t.common.test_qr, link: paths.HOME },
    { label: t.common.scan_fabric, link: paths.FABRIC_SCAN },
    { label: t.common.statistical, link: paths.STATISTICAL },
  ];

  return (
    <header className="h-[60px] lg:h-[80px] p-4 shadow-sm bg-white flex items-center justify-between">
      <Image
        src={svgs.logo}
        alt="logo"
        width={1000}
        height={1000}
        className="h-[60px] lg:w-[250px] w-[150px]"
      />

      <div className="hidden lg:flex items-center gap-4">
        <ul className="flex items-center gap-4">
          {pages.map((page, index) => (
            <li key={index} className="hover:underline">
              <Link href={page.link}>{page.label}</Link>
            </li>
          ))}
        </ul>
        <Link href={`/${paths.LOGIN}`}>{t.common.login}</Link>
        <LanguageSwitcher />
      </div>

      <button className="lg:hidden" onClick={() => setOpen(true)}>
        <Menu size={24} strokeWidth={1.5} />
      </button>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{t.common.menu}</span>
          </div>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <ul className="flex flex-col gap-4">
          {pages.map((page, index) => (
            <li key={index} className="text-lg" onClick={() => setOpen(false)}>
              <Link href={page.link}>{page.label}</Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <Link href={`/${paths.LOGIN}`} className="text-[18px]">
            {t.common.login}
          </Link>
          <LanguageSwitcher />
        </div>
      </Drawer>
    </header>
  );
}

export default Header;
