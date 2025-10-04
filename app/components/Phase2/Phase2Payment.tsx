"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Payment({ answers, onChange }: Props) {
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
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <div className="w-full py-6 space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
      {questions.map((q) => {
        const currentValue = answers[q.id as keyof Phase2Answers] as string | string[] | null;

        return (
          <QuestionCard
            key={q.id}
            id={q.id}
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
  );
}
