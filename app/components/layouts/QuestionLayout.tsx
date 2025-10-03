// components/layouts/QuestionLayout.tsx
"use client";

import React, { ReactNode } from "react";
import Header from "./Header";

interface QuestionLayoutProps {
  title: string;
  children?: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  answeredCount?: number;
  totalCount?: number;
}

export default function QuestionLayout({ title, children }: QuestionLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-x-hidden">
      {/* 共通ヘッダー */}
      <Header title={title} />

      {/* コンテンツ領域 */}
      <main className="w-full max-w-4xl flex flex-col items-center justify-start pt-20 px-4 sm:px-6 lg:px-0 space-y-4">
        {children}
      </main>
    </div>
  );
}
