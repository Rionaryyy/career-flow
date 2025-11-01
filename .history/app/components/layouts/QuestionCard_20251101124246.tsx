"use client";

import React from "react";
import { Phase2Answers } from "@/types/types";

interface QuestionCardProps {
  id: string;
  question: string;
  options: string[];
  type: "radio" | "checkbox" | "custom"| "slider"; 
  value?: string | string[] | null;
  onChange: (id: keyof Phase2Answers, value: string | string[]) => void;
  children?: React.ReactNode;
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
  children,
}: QuestionCardProps) {
  if (condition && answers && !condition(answers)) return null;

  const handleSelect = (option: string) => {
    if (type === "radio") {
      onChange(id as keyof Phase2Answers, option);
    } else if (type === "checkbox") {
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
    <div className="w-full bg-sky-50 p-5 rounded-2xl border border-sky-500 shadow-sm space-y-4">
      <p className="text-xl font-semibold text-sky-800 text-center">
        {question}
      </p>

      {type !== "custom" && (
        <div className="grid grid-cols-1 gap-3 w-full">
          {options.map((opt) => {
            const checked =
              type === "radio" ? value === opt : selectedValues.includes(opt);
            return (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`flex items-center w-full cursor-pointer h-14 px-4 rounded-xl border text-sm font-medium select-none transition-all duration-200 ${
                  checked
                    ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow ring-1 ring-sky-600 border-sky-600"
                    : "bg-white border-sky-500 text-sky-900 hover:border-sky-600 hover:shadow-sm"
                }`}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}

      {type === "custom" && <div className="w-full">{children}</div>}
    </div>
  );
}
