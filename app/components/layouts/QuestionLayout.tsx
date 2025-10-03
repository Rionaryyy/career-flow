// QuestionLayout.tsx
import React from "react";

export interface QuestionLayoutProps {
  answeredCount: number;
  totalCount: number;
  children: React.ReactNode; // ← これを追加
}

export default function QuestionLayout({ answeredCount, totalCount, children }: QuestionLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 進捗バー */}
      <div className="w-full bg-sky-100 h-2 rounded-full mb-6">
        <div
          className="bg-sky-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(answeredCount / totalCount) * 100}%` }}
        />
      </div>

      {children}
    </div>
  );
}
