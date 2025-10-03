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

export default function Phase2Device({ answers, onChange, onNext, onBack }: Props) {
  const questions = [
    {
      id: "devicePreference",
      question: "1. 新しい端末も一緒に購入する予定ですか？",
      options: ["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"],
      type: "radio" as const,
    },
    {
      id: "oldDevicePlan",
      question: "2. 端末の購入方法（複数選択可）",
      options: [
        "Appleなど正規ストア・家電量販店で本体のみ購入したい",
        "キャリアで端末を購入したい（通常購入）",
        "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
        "どれが最もお得か分からないので、すべてのパターンを比較したい",
      ],
      type: "checkbox" as const,
      condition: (ans: Phase2Answers) =>
        ans.devicePreference === "はい（端末も一緒に購入する）",
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  // 進捗バー用の回答済み数
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const handleNext = () => onNext();
  const handleBack = () => onBack?.();

  return (
    <QuestionLayout>
              {/* 画面上部に直接タイトル */}
              <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">
                📍 フェーズ②：詳細条件
              </h1>
      <div className="w-full py-6 space-y-6">
        {questions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

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
    </QuestionLayout>
  );
}
