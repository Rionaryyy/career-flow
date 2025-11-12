// app/components/DiagnosisFlow/layouts/QuestionCard.tsx
"use client";

import React from "react";
import { DiagnosisAnswers } from "@/types/types";

interface OptionItem {
  label: string;
  value: string;
}

interface QuestionCardProps {
  id: string;
  question: string;
  options: (string | OptionItem)[];
  type: "radio" | "checkbox" | "custom" | "slider";
  value?: string | string[] | number | null;
  onChange: (id: string, value: string | string[] | number) => void;
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

  // label/value両対応のため正規化
  const normalizedOptions: OptionItem[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const handleSelect = (option: OptionItem) => {
    if (type === "radio") {
      onChange(id, option.value);
    } else if (type === "checkbox") {
      const prev = Array.isArray(value) ? value : [];
      const updated = prev.includes(option.value)
        ? prev.filter((o) => o !== option.value)
        : [...prev, option.value];
      onChange(id, updated);
    }
  };

  const selectedValues =
    type === "checkbox" ? (Array.isArray(value) ? value : []) : [];

  // スライダータイプ
  if (type === "slider") {
    const sliderValue =
      typeof value === "number"
        ? value
        : typeof value === "string"
        ? Number(value)
        : min ?? 0;

    const cappedValue = Math.min(sliderValue, max ?? 200000);

    return (
      <div className="w-full bg-white p-5 rounded-2xl border border-orange-500 shadow-sm space-y-6">
        <p className="text-xl font-semibold text-gray-900 text-center">
          {question}
        </p>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="range"
            min={min ?? 0}
            max={max ?? 200000}
            step={step ?? 1000}
            value={cappedValue}
            onChange={(e) => onChange(id, Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <p className="text-gray-800 text-lg font-semibold">
            ¥{cappedValue.toLocaleString()}
            {unit && (
              <span className="text-gray-500 text-sm ml-1">{unit}</span>
            )}
          </p>
          {max && (
            <p className="text-xs text-gray-600">
              （上限：{max.toLocaleString()}円）
            </p>
          )}
        </div>
      </div>
    );
  }

  // 通常タイプ
  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-orange-500 shadow-sm space-y-4">
      <p className="text-xl font-semibold text-gray-900 text-center">{question}</p>

      {type !== "custom" && (
        <div className="grid grid-cols-1 gap-3 w-full">
          {normalizedOptions.map((opt) => {
            const checked =
              type === "radio"
                ? value === opt.value
                : selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={`flex items-center w-full cursor-pointer h-14 px-4 rounded-xl border text-sm font-medium select-none transition-all duration-200 ${
                  checked
                    ? "bg-orange-300 text-orange-900 border-orange-400 ring-2 ring-orange-300"
                    : "bg-white border-orange-500 text-gray-900 hover:bg-orange-100 hover:border-orange-600 hover:text-orange-900 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                }`}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}

      {type === "custom" && <div className="w-full">{children}</div>}
    </div>
  );
}
