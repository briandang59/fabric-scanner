"use client";
import { useState } from "react";
import svgs from "@/assets";
import { Button, Drawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./SwitchLanguage";
import { Menu } from "lucide-react";

function Header() {
  const [open, setOpen] = useState(false);

  const pages = [
    { label: "Thử nghiệm quét mã", link: "/" },
    { label: "Quét mã", link: "/" },
    { label: "Thống kê", link: "/" },
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
        <Button>Đăng nhập</Button>
        <LanguageSwitcher />
      </div>

      <button className="lg:hidden" onClick={() => setOpen(true)}>
        <Menu size={24} strokeWidth={1.5} />
      </button>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">Menu</span>
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
          <Button type="primary" block>
            Đăng nhập
          </Button>
          <LanguageSwitcher />
        </div>
      </Drawer>
    </header>
  );
}

export default Header;
