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

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  // --- 追加 ---
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const handleNext = () => onNext();
  const handleBack = () => onBack?.();
  // ----------------

  return (
    <QuestionLayout>
              {/* 画面上部に直接タイトル */}
              <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">
                📍 フェーズ②：詳細条件
              </h1>
      <div className="w-full py-6 space-y-6">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            id={q.id}
            question={q.question}
            options={q.options}
            type={q.type}
            value={answers[q.id as keyof Phase2Answers] as string | null}
            onChange={handleChange}
            answers={answers}
          />
        ))}
      </div>
    </QuestionLayout>
  );
}
