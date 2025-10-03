// components/layouts/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleCloseMenu = () => {
    setClosing(true); // フェードアウト開始
    setTimeout(() => {
      setMenuOpen(false); // 実際に閉じる
      setClosing(false); // クローズアニメーション終了
    }, 200); // duration-200 と合わせる
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md py-3 px-4 flex items-center justify-between">
      {/* サイトタイトル（クリック不可） */}
      <div className="flex items-center space-x-2 cursor-default select-none">
        <DevicePhoneMobileIcon className="w-6 h-6 text-sky-500" />
        <span className="text-xl font-bold text-sky-900">通信キャリア診断</span>
      </div>

      {/* ハンバーガーメニュー */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden p-2 rounded-md hover:bg-sky-100 transition"
      >
        {menuOpen && !closing ? (
          <XMarkIcon className="h-6 w-6 text-sky-900" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-sky-900" />
        )}
      </button>

      {/* メニュー */}
      <nav
        className={`absolute top-full right-4 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out
          ${menuOpen ? (closing ? "opacity-0 max-h-96" : "opacity-100 max-h-96") : "opacity-0 max-h-0"}
        `}
      >
        <ul className="flex flex-col">
          <li>
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-sky-100 transition"
              onClick={handleCloseMenu}
            >
              ホーム
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block px-4 py-2 hover:bg-sky-100 transition"
              onClick={handleCloseMenu}
            >
              概要
            </Link>
          </li>
          <li>
            <Link
              href="/achievements"
              className="block px-4 py-2 hover:bg-sky-100 transition"
              onClick={handleCloseMenu}
            >
              実績
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block px-4 py-2 hover:bg-sky-100 transition"
              onClick={handleCloseMenu}
            >
              お問い合わせ
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
