// components/layouts/QuestionLayout.tsx
"use client";

import React, { ReactNode } from "react";
import Header from "./Header";

interface QuestionLayoutProps {
  children?: ReactNode;
  onNext?: () => void;         // 「次へ」ボタン
  onBack?: () => void;         // 「戻る」ボタン
  nextLabel?: string;          // 「次へ」の文言変更
  backLabel?: string;          // 「戻る」の文言変更
}

export default function QuestionLayout({
  children,
  onNext,
  onBack,
  nextLabel,
  backLabel,
}: QuestionLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-x-hidden">
      {/* 共通ヘッダー */}
      <Header />

      {/* コンテンツ領域 */}
      <main className="w-full max-w-4xl flex flex-col items-center justify-start px-4 sm:px-6 lg:px-0 space-y-4">
        {children}
      </main>

      {/* ナビボタン（必要なら使える） */}
      {(onNext || onBack) && (
        <div className="flex justify-between items-center pt-6 w-full max-w-4xl">
          <button
            onClick={onBack}
            className={`px-4 py-2 rounded-full ${
              !onBack
                ? "bg-sky-100 text-sky-300 cursor-not-allowed"
                : "bg-sky-200 hover:bg-sky-300 text-sky-900 shadow-sm"
            } transition-all duration-200`}
            disabled={!onBack}
          >
            {backLabel ?? "← 戻る"}
          </button>

          <button
            onClick={onNext}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-lg font-semibold text-white shadow-md transition-all duration-200"
          >
            {nextLabel ?? "次へ →"}
          </button>
        </div>
      )}
    </div>
  );
}
