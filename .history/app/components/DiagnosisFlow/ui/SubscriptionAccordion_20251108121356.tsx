"use client";

import React, { useState } from "react";
import { DiagnosisAnswers } from "@/types/types";
import { subscriptionQuestions } from "../questions/subscriptionQuestions";

interface Props {
  answers: DiagnosisAnswers;
  onChange: (updated: Partial<DiagnosisAnswers>) => void;
}

export default function SubscriptionAccordion({ answers, onChange }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // 🔹 セクション開閉
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 🔹 選択トグル（valueベース対応）
  const handleToggleOption = (id: keyof DiagnosisAnswers, optionValue: string) => {
    const prev = Array.isArray(answers[id]) ? (answers[id] as string[]) : [];
    const updated = prev.includes(optionValue)
      ? prev.filter((o) => o !== optionValue)
      : [...prev, optionValue];
    onChange({ [id]: updated });
  };

  // 🔹 質問をセクションごとにグループ化
  const groupedQuestions = subscriptionQuestions.reduce<
    Record<string, typeof subscriptionQuestions>
  >((acc, q) => {
    const section = q.section || "その他";
    if (!acc[section]) acc[section] = [];
    acc[section].push(q);
    return acc;
  }, {});

  return (
    <div className="w-full space-y-4">
      {Object.entries(groupedQuestions).map(([section, questions]) => {
        const isOpen = openSections[section] ?? false;

        return (
          <div
            key={section}
            className="border border-sky-200 rounded-2xl overflow-hidden"
          >
            {/* === セクションタイトル === */}
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex justify-between items-center p-4 font-semibold text-sky-900 hover:bg-sky-50"
            >
              <span>{section}</span>
              <span
                className={`ml-2 text-sky-900 text-lg transform transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </button>

            {/* === セクション内容 === */}
            {isOpen && (
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {questions.map((q) => {
                  const selected = Array.isArray(
                    answers[q.id as keyof DiagnosisAnswers]
                  )
                    ? (answers[q.id as keyof DiagnosisAnswers] as string[])
                    : [];

                  return (
                    <React.Fragment key={String(q.id)}>
                      {q.options.map((opt) => {
                        // ✅ 型ガード（string or {label,value} 両対応）
                        const label = typeof opt === "string" ? opt : opt.label;
                        const value = typeof opt === "string" ? opt : opt.value;

                        const checked = selected.includes(value);

                        return (
                          <div
                            key={value}
                            onClick={() =>
                              handleToggleOption(
                                q.id as keyof DiagnosisAnswers,
                                value
                              )
                            }
                            className={`flex items-center justify-center cursor-pointer h-14 rounded-xl border text-sm font-medium transition-all duration-200 select-none ${
                              checked
                                ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow"
                                : "bg-white border-sky-200 text-sky-900 hover:border-sky-300 hover:shadow-sm"
                            }`}
                          >
                            {label}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
