"use client";

import QuestionLayout from "./layouts/QuestionLayout";
import { Phase2Answers } from "@/types/types";
import { useState } from "react";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function Phase2Payment({ answers, onChange, onNext, onBack }: Props) {
  const [paymentMethods, setPaymentMethods] = useState<string[]>(answers.mainCard ? [answers.mainCard] : []);
  const [paymentTiming, setPaymentTiming] = useState<string | null>(answers.paymentTiming || null);

  const toggleMethod = (method: string) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter((m) => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const questions = [
    {
      id: "mainCard",
      question: "1. 支払い方法（複数選択可）",
      options: [
        "クレジットカード",
        "デビットカード",
        "口座振替",
        "キャリア決済",
        "プリペイド・バンドルカード",
        "ポイント残高支払い",
        "その他（店舗支払いなど）",
      ],
      type: "checkbox" as const,
    },
    // 必要であれば支払いタイミングも質問として追加可能
  ];

  const handleChange = (id: string, value: string | string[]) => {
    if (id === "mainCard") {
      onChange({ mainCard: (value as string[]).join(", ") });
    } else {
      onChange({ [id]: value } as Partial<Phase2Answers>);
    }
  };

  return (
    <QuestionLayout title="⑧ 支払い方法" onNext={onNext} onBack={onBack}>
      <div className="w-full px-2 sm:px-4 py-6 space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
            <p className="text-xl font-semibold text-white text-center mb-2">{q.question}</p>
            <div className={q.type === "checkbox" ? "grid grid-cols-1 md:grid-cols-2 gap-2" : ""}>
              {q.options.map((option) => {
                const checked = q.type === "checkbox"
                  ? (answers[q.id as keyof Phase2Answers] ? (answers[q.id as keyof Phase2Answers] as string).split(", ").includes(option) : false)
                  : answers[q.id as keyof Phase2Answers] === option;
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
                        if (q.type === "checkbox") toggleMethod(option);
                        else handleChange(q.id, option);
                      }}
                      className="accent-blue-500 mr-2"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </QuestionLayout>
  );
}
