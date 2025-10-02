// components/phase1/Phase1.tsx
"use client";

import React from "react";
import { Phase1Answers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";

export interface Phase1Props {
  defaultValues: Phase1Answers;
  onSubmit: (answers: Phase1Answers) => void;
  onBack?: () => void;
}

const questions = [
  {
    id: "includePoints",
    question: "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
    options: [
      "はい（ポイントも含めて最安を知りたい）",
      "いいえ（現金支出だけで比べたい）",
    ],
  },
  {
    id: "networkQuality",
    question: "通信品質（速度・安定性）はどの程度重視しますか？",
    options: [
      "とても重視する（大手キャリア水準が望ましい）",
      "ある程度重視する（格安でも安定していればOK）",
      "こだわらない（コスト最優先）",
    ],
  },
  {
    id: "carrierType",
    question: "キャリアの種類に希望はありますか？",
    options: [
      "大手キャリア（ドコモ / au / ソフトバンク / 楽天）",
      "サブブランド（ahamo / povo / LINEMO / UQなど）もOK",
      "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい",
    ],
  },
  {
    id: "supportPreference",
    question: "契約・サポートはオンライン完結で問題ありませんか？",
    options: ["はい（店舗サポートは不要）", "いいえ（店頭での手続きや相談が必要）"],
  },
  {
    id: "contractLockPreference",
    question: "契約期間の縛りや解約金について、どの程度気にしますか？",
    options: [
      "絶対に嫌（縛りなしが前提）",
      "できれば避けたいが内容次第",
      "気にしない（条件次第でOK）",
    ],
  },
];

export default function Phase1({ defaultValues, onSubmit, onBack }: Phase1Props) {
  const [answers, setAnswers] = React.useState<Phase1Answers>(defaultValues);

  const handleSelect = (id: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const answeredCount = questions.filter(
    (q) => answers[q.id as keyof typeof answers]
  ).length;

  return (
    <QuestionLayout
      title="📍 フェーズ①：前提条件"
      onNext={() => onSubmit(answers)}
      onBack={onBack}
      answeredCount={answeredCount}
      totalCount={questions.length}
      nextLabel="次へ進む →"
    >
      {/* 質問カード */}
      {questions.map((q, index) => (
        <div
          key={q.id}
          className="w-full bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl shadow-lg p-5 transition hover:shadow-xl mb-4"
        >
          <p className="text-lg font-semibold text-center text-black mb-4">
            {index + 1}. {q.question}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(q.id, option)}
                className={`w-full py-3 rounded-xl border transition-all text-black text-base ${
                  answers[q.id as keyof typeof answers] === option
                    ? "bg-pink-300 border-pink-400 shadow-md scale-[1.02]"
                    : "bg-white border-blue-200 hover:bg-blue-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </QuestionLayout>
  );
}
