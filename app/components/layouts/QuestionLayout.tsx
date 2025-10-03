// components/layouts/QuestionLayout.tsx
"use client";

import React, { ReactNode } from "react";
import Header from "./Header";

interface QuestionLayoutProps {
  children?: ReactNode;
  pageTitle: string;           // ページごとのタイトル
  answeredCount?: number;      // 進捗計算用
  totalCount?: number;         // 進捗計算用（デフォルト9）
  onNext?: () => void;         // 「次へ」ボタン
  onBack?: () => void;         // 「戻る」ボタン
  nextLabel?: string;          // 「次へ」の文言変更
  backLabel?: string;          // 「戻る」の文言変更
}

export default function QuestionLayout({
  children,
  pageTitle,
  answeredCount = 0,
  totalCount = 9,
  onNext,
  onBack,
  nextLabel,
  backLabel,
}: QuestionLayoutProps) {
  const progressPercent = Math.min(
    100,
    Math.round((answeredCount / totalCount) * 100)
  );

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-x-hidden">
      {/* 共通ヘッダー */}
      <Header />

      {/* ページタイトル＋進捗バー */}
      <div className="w-full max-w-4xl pt-20 px-4 sm:px-6 lg:px-0 mb-4">
        <h1 className="text-2xl font-bold text-sky-900">{pageTitle}</h1>

        {/* 進捗バー */}
        <div className="mt-2 w-full bg-sky-100 h-2 rounded-full">
          <div
            className="h-2 bg-sky-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-sky-700 mt-1">{progressPercent}% 完了</p>
      </div>

      {/* コンテンツ領域 */}
      <main className="w-full max-w-4xl flex flex-col items-center justify-start px-4 sm:px-6 lg:px-0 space-y-4">
        {children}
      </main>

      {/* ナビボタン */}
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
