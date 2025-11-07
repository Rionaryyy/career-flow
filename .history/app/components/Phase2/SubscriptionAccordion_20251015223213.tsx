// app/components/phase2/SubscriptionAccordion.tsx
"use client";

import React, { useState } from "react";
import { Phase2Answers } from "@/types/types";
import { phase2SubscriptionQuestions } from "./Phase2SubscriptionQuestions";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function SubscriptionAccordion({ answers, onChange }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggleOption = (
    id: keyof Phase2Answers,
    option: string,
    multiple: boolean
  ) => {
    const prev = Array.isArray(answers[id]) ? answers[id] : [];
    let updated: string[];
    if (multiple) {
      updated = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
    } else {
      updated = [option];
    }
    onChange({ [id]: updated });
  };

  // Accordion に表示する質問だけをフィルター
  const groupedQuestions = phase2SubscriptionQuestions.reduce<
    Record<string, typeof phase2SubscriptionQuestions>
  >((acc, q) => {
    // 追加質問 subscriptionMonthly は Accordion に表示しない
    if (q.id === "subscriptionMonthly") return acc;

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
            {/* セクションタイトル */}
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

            {isOpen && (
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {questions.map((q) => {
                  if (q.condition && !q.condition(answers)) return null;

                  const selected = Array.isArray(answers[q.id as keyof Phase2Answers])
                    ? (answers[q.id as keyof Phase2Answers] as string[])
                    : [];

                  return (
                    <React.Fragment key={q.id}>
                      {q.options.map((opt) => {
                        const checked = selected.includes(opt);
                        return (
                          <div
                            key={opt}
                            onClick={() =>
                              handleToggleOption(
                                q.id as keyof Phase2Answers,
                                opt,
                                true
                              )
                            }
                            className={`flex items-center justify-center cursor-pointer h-14 rounded-xl border text-sm font-medium transition-all duration-200 select-none ${
                              checked
                                ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow"
                                : "bg-white border-sky-200 text-sky-900 hover:border-sky-300 hover:shadow-sm"
                            }`}
                          >
                            {opt}
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
