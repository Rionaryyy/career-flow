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
  question: "家族割引を適用できる回線数はどのくらいですか？",
  options: ["1回線", "2回線", "3回線", "4回線", "5回線以上","適用できない / わからない"],
  type: "radio" as const,
},

    {
      id: "studentDiscount",
      question: "学割を適用できますか？（18歳以下）",
      options: ["Yes", "No"],
      type: "radio" as const,
    },
    {
      id: "setDiscount",
      question: "下記サービスとのセット割を適用できますか？",
      options: [
        "光回線の契約",
        "電気のセット契約",
        "ガスのセット契約",
        "ルーター購入・レンタル",
        "ポケットWi-Fi契約",
      ],
      type: "checkbox" as const,
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          id={q.id}
          question={q.question}
          options={q.options}
          type={q.type}
          value={answers[q.id as keyof Phase2Answers] as string | string[] | null}
          onChange={handleChange}
          answers={answers}
        />
      ))}
    </div>
  );
}
