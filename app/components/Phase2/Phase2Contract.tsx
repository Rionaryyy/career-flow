"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Contract({ answers, onChange }: Props) {
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

  return (
    <div className="w-full py-6 space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
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
  );
}
