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

export default function Phase2Ecosystem({ answers, onChange, onNext, onBack }: Props) {
  const questions = [
    {
      id: "ecosystem",
      question: "1. よく利用しているポイント経済圏は？",
      options: [
        "楽天経済圏（楽天カード・楽天市場など）",
        "dポイント（ドコモ・dカードなど）",
        "PayPay / ソフトバンク経済圏",
        "au PAY / Ponta経済圏",
        "特になし",
      ],
      type: "radio" as const,
    },
    {
      id: "ecosystemMonthly",
      question: "2. 月間利用額は？",
      options: ["〜5,000円", "5,000〜10,000円", "10,000〜30,000円", "30,000円以上"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.ecosystem && ans.ecosystem !== "特になし",
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
  onChange({ [id]: value } as Partial<Phase2Answers>);
};

  return (
    <QuestionLayout  onNext={onNext} onBack={onBack}>
      <div className="w-full py-6 space-y-6">
        {questions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          const currentValue = answers[q.id as keyof Phase2Answers] as string | null;

          return (
            <QuestionCard
  key={q.id}
  id={q.id}
  question={q.question}
  options={q.options}
  type={q.type}
  value={answers[q.id as keyof Phase2Answers] as string | null}
  onChange={handleChange} // ← そのまま渡す
  answers={answers}
/>

          );
        })}
      </div>
    </QuestionLayout>
  );
}
