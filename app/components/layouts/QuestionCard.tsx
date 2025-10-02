"use client";

import React from "react";
import { Phase2Answers } from "@/types/types";

interface QuestionCardProps {
  id: string;
  question: string;
  options: string[];
  type: "radio" | "checkbox";
  value?: string | string[] | null;
  onChange: (id: string, value: string | string[]) => void;
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
    if (type === "radio") onChange(id, option);
    else if (type === "checkbox") {
      const prev = Array.isArray(value) ? value : [];
      const updated = prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option];
      onChange(id, updated);
    }
  };

  const selectedValues = type === "checkbox" ? (Array.isArray(value) ? value : []) : [];

  return (
    <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
      <p className="text-xl font-semibold text-white text-center">{question}</p>
      <div className="grid grid-cols-1 gap-2 w-full">
        {options.map((opt) => {
          const checked =
            type === "radio" ? value === opt : selectedValues.includes(opt);
          return (
            <label
              key={opt}
              className={`flex items-center w-full cursor-pointer py-2 px-3 rounded-lg ${
                checked ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type={type}
                value={opt}
                checked={checked}
                onChange={() => handleSelect(opt)}
                className="accent-blue-500 mr-2"
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
