"use client";

import { useState, useEffect } from "react";
import QuestionLayout from "./layouts/QuestionLayout";
import { Phase2Answers } from "@/types/types";
import { phase2SubscriptionQuestions } from "./Phase2SubscriptionQuestions";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function Phase2Subscription({ answers, onChange, onNext, onBack }: Props) {
  const [localAnswers, setLocalAnswers] = useState<Phase2Answers>({ ...answers });

  const handleChange = (id: keyof Phase2Answers, value: string | string[]) => {
    const updated = { ...localAnswers, [id]: Array.isArray(value) ? value.join(", ") : value };
    setLocalAnswers(updated);
    onChange(updated);
  };

  const toggleCheckbox = (id: keyof Phase2Answers, option: string) => {
    const current = localAnswers[id] ? (localAnswers[id] as string).split(", ") : [];
    let updated: string[];
    if (current.includes(option)) {
      updated = current.filter((o) => o !== option);
    } else {
      if (option === "特になし") updated = ["特になし"];
      else updated = current.filter((o) => o !== "特になし").concat(option);
    }
    handleChange(id, updated);
  };

  return (
    <QuestionLayout title="⑤ サブスク利用状況" onNext={onNext} onBack={onBack}>
      <div className="w-full px-2 sm:px-4 py-6 space-y-4">
        {phase2SubscriptionQuestions.map((q) => {
          if (q.condition && !q.condition(localAnswers)) return null;

          const selected = localAnswers[q.id] ? (localAnswers[q.id] as string).split(", ") : [];

          return (
            <div key={q.id} className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
              <p className="text-xl font-semibold text-white text-center mb-2">{q.question}</p>
              <div className={q.type === "checkbox" ? "grid grid-cols-1 md:grid-cols-2 gap-2" : ""}>
                {q.options.map((option) => {
                  const checked = selected.includes(option) || localAnswers[q.id] === option;
                  return (
                    <label
                      key={option}
                      className={`flex items-center w-full cursor-pointer py-2 px-3 rounded-lg ${
                        checked ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      <input
                        type={q.type}
                        value={option}
                        checked={checked}
                        onChange={() => {
                          q.type === "checkbox" ? toggleCheckbox(q.id, option) : handleChange(q.id, option);
                        }}
                        className="accent-blue-500 mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </QuestionLayout>
  );
}
