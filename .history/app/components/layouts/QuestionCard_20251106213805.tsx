"use client";

import React from "react";
import { DiagnosisAnswers } from "@/types/types";

interface QuestionCardProps {
  id: string;
  question: string;
  options: string[];
  type: "radio" | "checkbox" | "custom" | "slider";
  value?: string | string[] | number | null;
  onChange: (id: string, value: string | string[] | number) => void; // ✅ 型を簡潔化
  children?: React.ReactNode;
  condition?: (answers: DiagnosisAnswers) => boolean;
  answers?: DiagnosisAnswers;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
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
  min,
  max,
  step,
  unit,
}: QuestionCardProps) {
  if (condition && answers && !condition(answers)) return null;

  const handleSelect = (option: string) => {
    if (type === "radio") {
      onChange(id, option);
    } else if (type === "checkbox") {
      const prev = Array.isArray(value) ? value : [];
      const updated = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      onChange(id, updated);
    }
  };

  const selectedValues =
    type === "checkbox" ? (Array.isArray(value) ? value : []) : [];

  // 🟦 スライダータイプ処理
  if (type === "slider") {
    const sliderValue =
      typeof value === "number"
        ? value
        : typeof value === "string"
        ? Number(value)
        : min ?? 0;

    const cappedValue = Math.min(sliderValue, max ?? 200000);

    return (
      <div className="w-full bg-sky-50 p-5 rounded-2xl border border-sky-500 shadow-sm space-y-6">
        <p className="text-xl font-semibold text-sky-800 text-center">{question}</p>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="range"
            min={min ?? 0}
            max={max ?? 200000}
            step={step ?? 1000}
            value={cappedValue}
            onChange={(e) => onChange(id, Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <p className="text-gray-800 text-lg font-semibold">
            ¥{cappedValue.toLocaleString()}
            {unit && <span className="text-gray-500 text-sm ml-1">{unit}</span>}
          </p>
          {max && (
            <p className="text-xs text-sky-700">
              （上限：{max.toLocaleString()}円）
            </p>
          )}
        </div>
      </div>
    );
  }

  // 🟦 通常タイプ処理
  return (
    <div className="w-full bg-sky-50 p-5 rounded-2xl border border-sky-500 shadow-sm space-y-4">
      <p className="text-xl font-semibold text-sky-800 text-center">{question}</p>

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
