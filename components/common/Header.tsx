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
import { useAuthStore } from "@/stores/useAuthStore";

function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslationCustom();

  const { cardNumber, logout } = useAuthStore();

  const pages = cardNumber
    ? [
        { label: t.common.test_qr, link: paths.HOME },
        { label: t.common.scan_fabric, link: paths.FABRIC_SCAN },
        { label: t.common.statistical, link: paths.STATISTICAL },
      ]
    : [{ label: t.common.test_qr, link: paths.HOME }];
  return (
    <header className="h-[60px] lg:h-[80px] px-4 shadow-sm bg-white flex items-center justify-between">
      {/* Logo */}
      <Image
        src={svgs.logo}
        alt="logo"
        width={1000}
        height={1000}
        className="h-[60px] lg:w-[250px] w-[150px]"
      />

      {/* Desktop menu */}
      <div className="hidden lg:flex items-center gap-6">
        <ul className="flex items-center gap-6 text-gray-700 font-medium">
          {pages.map((page, index) => (
            <li key={index} className="hover:text-blue-600 transition">
              <Link href={page.link}>{page.label}</Link>
            </li>
          ))}
        </ul>

        {cardNumber ? (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-gray-100 font-semibold text-gray-700">
              {cardNumber}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              {t.common.logout}
            </button>
          </div>
        ) : (
          <Link
            href={`/${paths.LOGIN}`}
            className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          >
            {t.common.login}
          </Link>
        )}

        <LanguageSwitcher />
      </div>

      {/* Mobile button */}
      <button className="lg:hidden" onClick={() => setOpen(true)}>
        <Menu size={24} strokeWidth={1.5} />
      </button>

      {/* Mobile drawer */}
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
        <ul className="flex flex-col gap-4 text-gray-700 font-medium">
          {pages.map((page, index) => (
            <li key={index} onClick={() => setOpen(false)}>
              <Link href={page.link}>{page.label}</Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between">
          {cardNumber ? (
            <>
              <span className="font-semibold text-[16px]">{cardNumber}</span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                {t.common.logout}
              </button>
            </>
          ) : (
            <Link
              href={`/${paths.LOGIN}`}
              className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
            >
              {t.common.login}
            </Link>
          )}
        </div>

        <div className="mt-4">
          <LanguageSwitcher />
        </div>
      </Drawer>
    </header>
  );
}

export default Header;
