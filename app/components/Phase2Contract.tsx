"use client";

import QuestionLayout from "./layouts/QuestionLayout";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function Phase2Contract({ answers, onChange, onNext, onBack }: Props) {
  const questions = [
    {
      id: "familyLines",
      question: "1. 家族割引を適用できる回線数は？",
      options: ["1回線","2回線","3回線以上","利用できない / わからない"],
      type: "radio" as const,
    },
    {
      id: "setDiscount",
      question: "2. 光回線とのセット割は？",
      options: ["はい（契約中または契約予定）","いいえ / わからない"],
      type: "radio" as const,
    },
    {
      id: "infraSet",
      question: "3. 電気・ガスなどのセット割は？",
      options: ["はい（契約中または契約予定）","いいえ / わからない"],
      type: "radio" as const,
    },
  ];

  const handleChange = (id: string, value: string) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <QuestionLayout title="③ 契約条件・割引について" onNext={onNext} onBack={onBack}>
      <div className="w-full px-2 sm:px-4 py-6 space-y-6">
        {questions.map((q) => {
          const currentValue = answers[q.id as keyof Phase2Answers] as string | null;

          return (
            <div key={q.id} className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
              <p className="text-xl font-semibold text-white text-center">{q.question}</p>
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleChange(q.id, option)}
                  className={`w-full py-3 rounded-lg border transition ${
                    currentValue === option
                      ? "bg-blue-600 border-blue-400 text-white"
                      : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </QuestionLayout>
  );
}
