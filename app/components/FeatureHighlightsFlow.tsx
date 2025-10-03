// components/FeatureHighlightsFlow.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function FeatureHighlightsFlow() {
  const links = [
    { name: "ホーム", href: "/" },
    { name: "概要", href: "/about" },
    { name: "実績", href: "/achievements" },
    { name: "お問い合わせ", href: "/contact" },
  ];

  return (
    <footer className="bg-sky-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 py-16 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* サイト情報 */}
          <div>
            <h3 className="text-2xl font-bold mb-3">通信キャリア診断</h3>
            <p className="text-gray-700">
              あなたに最適なキャリア・プランを提案する診断サービスです。
            </p>
          </div>

          {/* ナビリンク */}
          <div>
            <h4 className="font-semibold mb-3">リンク</h4>
            <ul>
              {links.map((link) => (
                <li key={link.name} className="mb-2">
                  <Link href={link.href} className="hover:underline text-gray-800">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 著作権情報 */}
          <div>
            <h4 className="font-semibold mb-3">情報</h4>
            <p className="text-gray-600">&copy; 2025 通信キャリア診断. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
