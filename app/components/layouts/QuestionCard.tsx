"use client";

import React from "react";
import { Phase2Answers } from "@/types/types";

interface QuestionCardProps {
  id: string;
  question: string;
  options: string[];
  type: "radio" | "checkbox"| "tabs";
  value?: string | string[] | null;
  onChange: (id: keyof Phase2Answers, value: string | string[]) => void;
  condition?: (answers: Phase2Answers) => boolean;
  answers?: Phase2Answers;
}

export default function QuestionCard({
  id,
  question,
  options,
  type,
  value,
  onChange,
  condition,
  answers,
}: QuestionCardProps) {
  if (condition && answers && !condition(answers)) return null;

  const handleSelect = (option: string) => {
    if (type === "radio") {
      // ラジオの場合は単一選択なので選んだ値そのまま渡す
      onChange(id as keyof Phase2Answers, option);
    } else if (type === "checkbox") {
      // チェックボックスの場合は配列操作
      const prev = Array.isArray(value) ? value : [];
      const updated = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      onChange(id as keyof Phase2Answers, updated);
    }
  };

  const selectedValues =
    type === "checkbox" ? (Array.isArray(value) ? value : []) : [];

  return (
    <div className="w-full bg-white p-6 rounded-2xl border border-sky-200 shadow-md space-y-4">
      <p className="text-xl font-semibold text-sky-900 text-center">
        {question}
      </p>
      <div className="grid grid-cols-1 gap-3 w-full">
        {options.map((opt) => {
          const checked =
            type === "radio" ? value === opt : selectedValues.includes(opt);
          return (
            <label
              key={opt}
              className={`flex items-center w-full cursor-pointer py-3 px-4 rounded-xl border transition-all duration-200 ${
                checked
                  ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow"
                  : "bg-white border-sky-200 text-sky-900 hover:border-sky-300 hover:shadow-sm"
              }`}
            >
             <input
  type={type}
  name={id} // ここをユニーク化した方が安全
  value={opt}
  checked={checked}
  onChange={() => handleSelect(opt)}
  className="accent-sky-500 mr-3"
/>




              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
