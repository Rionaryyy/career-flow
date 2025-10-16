"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Data({ answers, onChange }: Props) {
  const questions = [
  {
    id: "dataUsage",
    question: "1. 月のデータ使用量はどのくらいですか？",
    options: ["〜5GB（ライトユーザー）", "10〜20GB（標準）", "20GB以上（ヘビーユーザー）", "無制限が必要"],
    type: "radio" as const,
  },
  {
    id: "speedLimitImportance",
    question: "2. 速度制限後の通信速度も重視しますか？",
    options: ["はい（制限後も快適な速度がほしい）", "いいえ（速度低下は気にしない）"],
    type: "radio" as const,
  },
  {
    id: "tetheringNeeded",
    question: "3. テザリング機能は必要ですか？",
    options: ["はい（必要）","いいえ（不要）"],
    type: "radio" as const,
  },
  {
    id: "tetheringUsage",
    question: "3-2. 必要な場合、月あたりどのくらいのデータ量を使いそうですか？",
    options: ["〜5GB（ライトユーザー）", "10〜20GB（標準）", "20GB以上（ヘビーユーザー）", "無制限が必要"],
    type: "radio" as const,
    condition: (ans: Phase2Answers) => ans.tetheringNeeded === "はい",
  },
];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
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
            value={currentValue}
            onChange={handleChange}
            answers={answers}
          />
        );
      })}
    </div>
  );
}
