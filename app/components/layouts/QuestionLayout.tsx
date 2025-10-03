"use client";

import React, { useEffect, useState } from "react";

export interface QuestionLayoutProps {
  answeredCount: number;
  totalCount: number;
  children: React.ReactNode;
}

export default function QuestionLayout({ answeredCount, totalCount, children }: QuestionLayoutProps) {
  const percent = Math.round((answeredCount / totalCount) * 100);
  const [widthPercent, setWidthPercent] = useState(0);

  useEffect(() => {
    // 少し遅らせて幅を変更 → transition が発動
    const timer = setTimeout(() => setWidthPercent(percent), 50);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* ステップと％表示 */}
      <div className="mb-2 text-sm text-sky-900 font-semibold flex justify-between">
        <span>ステップ {answeredCount} / {totalCount}</span>
      </div>

      {/* 進捗バー */}
      <div className="w-full bg-sky-100 h-2 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-sky-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${widthPercent}%` }}
        />
      </div>

      {children}
    </div>
  );
}
