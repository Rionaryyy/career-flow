// components/layouts/QuestionLayout.tsx
"use client";

import React, { ReactNode } from "react";

interface QuestionLayoutProps {
  title: string;                // ページタイトル
  children: ReactNode;          // 質問コンテンツ
  onNext: () => void;           // 次へボタン処理
  onBack?: () => void;          // 戻るボタン処理（任意）
  nextLabel?: string;           // 次へボタンテキスト
  backLabel?: string;           // 戻るボタンテキスト
  answeredCount?: number;       // 現在回答済み数（進捗バー用）
  totalCount?: number;          // 総質問数（進捗バー用）
}

export default function QuestionLayout({
  title,
  children,
  onNext,
  onBack,
  nextLabel = "次へ進む →",
  backLabel = "← 戻る",
  answeredCount = 0,
  totalCount = 0,
}: QuestionLayoutProps) {
  const progress = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-x-hidden">
      {/* 固定ヘッダー */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md py-3 px-2 flex flex-col space-y-2">
        {/* 進捗説明 */}
        {totalCount > 0 && (
          <p className="text-sm text-gray-600 text-center">
            現在の回答状況：{answeredCount} / {totalCount} 問
          </p>
        )}

        {/* 進捗バー */}
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-2 bg-pink-400 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* タイトル */}
        <h2 className="text-lg sm:text-2xl font-bold text-black text-center">
          {title}
        </h2>

        {/* ナビゲーションボタン */}
        <div className="w-full flex justify-between items-center">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-black text-sm transition"
            >
              {backLabel}
            </button>
          ) : (
            <div /> // 戻るボタンなしの場合はスペース確保
          )}

          <button
            onClick={onNext}
            className="px-6 py-2 rounded-full bg-pink-400 hover:bg-pink-500 text-black font-semibold text-sm sm:text-base transition shadow-md"
          >
            {nextLabel}
          </button>
        </div>
      </div>

      {/* コンテンツ領域（ヘッダー分の余白） */}
      <div className="w-full flex flex-col items-center justify-start pt-36 px-2 space-y-4">
        {children}
      </div>
    </div>
  );
}
