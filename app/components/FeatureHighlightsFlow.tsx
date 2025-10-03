// components/FeatureHighlightsFlow.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function FeatureHighlightsFlow() {
  const features = [
    {
      title: "あなたに最適な提案",
      description: "回答内容に基づき、最適なキャリア・プランを提案します。",
    },
    {
      title: "簡単操作で診断完了",
      description: "数分で完了。複雑な入力は不要です。",
    },
    {
      title: "比較しやすい一覧表示",
      description: "複数プランを並べて、違いを直感的に確認できます。",
    },
  ];

  const links = [
    { name: "ホーム", href: "/" },
    { name: "概要", href: "/about" },
    { name: "実績", href: "/achievements" },
    { name: "お問い合わせ", href: "/contact" },
  ];

  return (
    <section className="w-full bg-sky-50 pt-16 pb-20 px-4 sm:px-6 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* セクションタイトル */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          診断後のポイント
        </h2>

        {/* 特徴カード */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-[1.03]"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTAボタン */}
        <Link
          href="#result"
          className="inline-block px-8 py-4 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-md transition mb-16"
        >
          診断結果を見る
        </Link>

        {/* Footer部分 */}
        <div className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left sm:text-left">
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
      </div>
    </section>
  );
}
