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

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggleOption = (
    id: keyof DiagnosisAnswers,
    option: string,
    multiple: boolean
  ) => {
    const prev = Array.isArray(answers[id]) ? (answers[id] as string[]) : [];
    const updated = prev.includes(option)
      ? prev.filter((o) => o !== option)
      : [...prev, option];
    onChange({ [id]: updated });
  };

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
                  const selected = Array.isArray(
                    answers[q.id as keyof DiagnosisAnswers]
                  )
                    ? (answers[q.id as keyof DiagnosisAnswers] as string[])
                    : [];

                  return (
                    <React.Fragment key={String(q.id)}>
                      {q.options.map((opt: string) => {
  const checked = selected.includes(opt);
                        return (
                          <div
                            key={opt}
                            onClick={() =>
                              handleToggleOption(
                                q.id as keyof DiagnosisAnswers,
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
