"use client";

import QuestionLayout from "../layouts/QuestionLayout";
import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function Phase2Payment({ answers, onChange, onNext, onBack }: Props) {
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

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const handleNext = () => onNext();
  const handleBack = () => onBack?.();

  return (
    <QuestionLayout
      pageTitle="💳 フェーズ②：支払い方法"
      answeredCount={answeredCount}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="w-full py-6 space-y-6">
        {questions.map((q) => {
          const currentValue = answers[q.id as keyof Phase2Answers] as string[] | string | null;

          return (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q.question}
              options={q.options}
              type={q.type}
              value={currentValue}  // 配列をそのまま渡す
              onChange={handleChange} // id と value の2引数で渡す
              answers={answers}
            />
          );
        })}
      </div>
    </QuestionLayout>
  );
}
