// components/layouts/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md py-3 px-4 flex items-center justify-between">
      {/* サイトタイトル（クリック不可） */}
      <div className="flex items-center space-x-2 cursor-default select-none">
        <DevicePhoneMobileIcon className="w-6 h-6 text-sky-500" />
        <span className="text-xl font-bold text-sky-900 truncate">
          通信キャリア診断
        </span>
      </div>

      {/* ハンバーガーメニュー */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden p-2 rounded-md hover:bg-sky-100 transition"
      >
        {menuOpen ? (
          <XMarkIcon className="h-6 w-6 text-sky-900" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-sky-900" />
        )}
      </button>

      {/* メニュー */}
      <nav
        className={`absolute top-full right-2 sm:right-4 bg-white shadow-lg rounded-md overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
          ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
        style={{ width: "max-content", minWidth: "160px", maxWidth: "90vw" }}
      >
        <ul className="flex flex-col text-sm sm:text-base">
          <li>
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-sky-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              ホーム
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block px-4 py-2 hover:bg-sky-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              概要
            </Link>
          </li>
          <li>
            <Link
              href="/achievements"
              className="block px-4 py-2 hover:bg-sky-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              実績
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block px-4 py-2 hover:bg-sky-100 transition"
              onClick={() => setMenuOpen(false)}
            >
              お問い合わせ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
