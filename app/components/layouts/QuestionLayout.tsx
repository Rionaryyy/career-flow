// components/layouts/QuestionLayout.tsx
"use client";

import React, { ReactNode } from "react";
import { Phase2Answers } from "@/types/types";

interface Question {
  id: string;
  question: string;
  options: string[];
  type: "radio" | "checkbox";
  condition?: (answers: Phase2Answers) => boolean;
}

interface QuestionLayoutProps {
  title: string;
  children?: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  answeredCount?: number;
  totalCount?: number;
  questions?: Question[];
  answers?: Phase2Answers;
  onChange?: (updated: Partial<Phase2Answers>) => void;
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
  questions,
  answers,
  onChange,
}: QuestionLayoutProps) {
  const progress = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  const handleSelect = (id: string, option: string, type: "radio" | "checkbox") => {
    if (!answers || !onChange) return;
    if (type === "radio") {
      onChange({ [id]: option });
    } else if (type === "checkbox") {
      const prev = (answers[id as keyof Phase2Answers] as string[]) || [];
      const updated = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      onChange({ [id]: updated });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-x-hidden">
      {/* 固定ヘッダー */}
      <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-md py-3 px-2 flex flex-col space-y-2">
        {totalCount > 0 && (
          <p className="text-sm text-gray-600 text-center">
            現在の回答状況：{answeredCount} / {totalCount} 問
          </p>
        )}
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-2 bg-pink-400 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <h2 className="text-lg sm:text-2xl font-bold text-black text-center">{title}</h2>
        <div className="w-full flex justify-between items-center">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-full bg-purple-100 hover:bg-purple-200 text-black text-sm transition"
            >
              {backLabel}
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onNext}
            className="px-6 py-2 rounded-full bg-pink-400 hover:bg-pink-500 text-black font-semibold text-sm sm:text-base transition shadow-md"
          >
            {nextLabel}
          </button>
        </div>
      </div>

      {/* コンテンツ領域 */}
      <div className="w-full flex flex-col justify-start pt-36 px-4 sm:px-6 lg:px-0 space-y-6">
        {children}

        {/* 条件付き質問リストもサポート */}
        {questions &&
          answers &&
          onChange &&
          questions.map((q) => {
            if (q.condition && !q.condition(answers)) return null;
            const value = answers[q.id as keyof Phase2Answers];
            return (
              <div
                key={q.id}
                className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2"
              >
                <p className="font-semibold text-white">{q.question}</p>
                <div className="grid grid-cols-1 gap-2 w-full">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center w-full cursor-pointer py-2 px-2 rounded-lg ${
                        q.type === "radio"
                          ? value === opt
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-200"
                          : (value as string[])?.includes(opt)
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      <input
                        type={q.type}
                        checked={
                          q.type === "radio"
                            ? value === opt
                            : (value as string[])?.includes(opt)
                        }
                        onChange={() => handleSelect(q.id, opt, q.type)}
                        className="accent-blue-500 mr-2"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
