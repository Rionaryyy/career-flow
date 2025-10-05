// app/components/phase2/SubscriptionAccordion.tsx
"use client";

import React, { useState } from "react";
import QuestionCard from "../layouts/QuestionCard";
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

  const handleChange = (id: keyof Phase2Answers, value: string | string[]) => {
    // 「特になし」の排他制御
    if (Array.isArray(value) && value.includes("特になし")) {
      value = ["特になし"];
    } else if (Array.isArray(value)) {
      value = value.filter((v) => v !== "特になし");
    }

    onChange({ [id]: value });
  };

  // ジャンルごとに質問をまとめる
  const groupedQuestions = phase2SubscriptionQuestions.reduce<Record<string, typeof phase2SubscriptionQuestions>>(
    (acc, q) => {
      const section = q.section || "その他";
      if (!acc[section]) acc[section] = [];
      acc[section].push(q);
      return acc;
    },
    {}
  );

  return (
    <div className="w-full space-y-4">
      {Object.entries(groupedQuestions).map(([section, questions]) => {
        // そのジャンルで選択中のサービスがあれば最初から展開
        const hasSelected = questions.some(
          (q) =>
            Array.isArray(answers[q.id as keyof Phase2Answers]) &&
            (answers[q.id as keyof Phase2Answers] as string[]).length > 0
        );

        const isOpen = openSections[section] ?? hasSelected;

        return (
          <div key={section} className="border border-sky-200 rounded-2xl shadow-sm overflow-hidden">
            {/* セクションタイトル */}
            <button
              onClick={() => toggleSection(section)}
              className="w-full text-left p-4 bg-sky-100 font-semibold text-sky-900 hover:bg-sky-200"
            >
              {section}
            </button>

            {/* セクション内の質問 */}
            {isOpen && (
              <div className="p-4 space-y-4">
                {questions.map((q) => {
                  if (q.condition && !q.condition(answers)) return null;

                  const currentValue = answers[q.id as keyof Phase2Answers] as string[] | string | null;

                  return (
                    <QuestionCard
                      key={q.id}
                      id={q.id as keyof Phase2Answers}
                      question={q.question}
                      options={q.options}
                      type={q.type}
                      value={currentValue}
                      onChange={handleChange}
                      answers={answers}
                    />
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
