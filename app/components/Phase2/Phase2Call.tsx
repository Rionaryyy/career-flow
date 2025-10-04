"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Call({ answers, onChange }: Props) {
  const questions = [
  {
    id: "callFrequency",
    question: "ふだんの通話頻度に近いものを選んでください",
    options: [
      "ほとんど通話しない（LINEなどが中心）",
      "月に数回だけ短い通話をする（1〜5分程度）",
      "毎週何度か短い通話をする（5分以内が多い）",
      "月に数回〜十数回、10〜20分程度の通話をする",
      "毎日のように長時間の通話をする（20分以上・仕事など）"
    ],
    type: "radio" as const,
  },
  {
    id: "familyCallRatio",
    question: "通話のうち、家族との通話はどのくらいですか？",
    options: [
      "ほとんど家族との通話はない",
      "半分程度が家族との通話",
      "ほとんどが家族との通話"
    ],
    type: "radio" as const,
  },
  {
    id: "overseasCallFrequency",
    question: "海外への通話はどのくらいしますか？",
    options: [
      "ほとんど通話しない",
      "月に数回だけ短い通話をする（1〜5分程度）",
      "毎週何度か短い通話をする（5分以内が多い）",
      "月に数回〜十数回、10〜20分程度の通話をする",
      "毎日のように長時間の通話をする（20分以上・仕事など）"
    ],
    type: "radio" as const,
  },
  {
    id: "callOptionsNeeded",
    question: "留守番電話や着信転送などのオプションは必要ですか？",
    options: ["はい（必要）", "いいえ（不要）"],
    type: "radio" as const,
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
          value={answers[q.id as keyof Phase2Answers]}
          onChange={handleChange}
          answers={answers}
        />
      ))}
    </div>
  );
}
