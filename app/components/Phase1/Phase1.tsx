"use client";

import React from "react";
import { Phase1Answers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";
import QuestionCard from "../layouts/QuestionCard";

export interface Phase1Props {
  defaultValues: Phase1Answers;
  onSubmit: (answers: Phase1Answers) => void;
  onBack?: () => void;
}

const phase1Questions = [
  {
    id: "includePoints",
    question: "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
    type: "radio",
    options: [
      "はい（ポイントも含めて最安を知りたい）",
      "いいえ（現金支出だけで比べたい）",
    ],
  },
  {
    id: "networkQuality",
    question: "通信品質（速度・安定性）はどの程度重視しますか？",
    type: "radio",
    options: [
      "とても重視する（大手キャリア水準が望ましい）",
      "ある程度重視する（格安でも安定していればOK）",
      "こだわらない（コスト最優先）",
    ],
  },
  {
    id: "carrierType",
    question: "キャリアの種類に希望はありますか？",
    type: "radio",
    options: [
      "大手キャリア（ドコモ / au / ソフトバンク / 楽天）",
      "サブブランド（ahamo / povo / LINEMO / UQなど）もOK",
      "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい",
    ],
  },
  {
    id: "supportPreference",
    question: "契約・サポートはオンライン完結で問題ありませんか？",
    type: "radio",
    options: ["はい（店舗サポートは不要）", "いいえ（店頭での手続きや相談が必要）"],
  },
  {
    id: "contractLockPreference",
    question: "契約期間の縛りや解約金について、どの程度気にしますか？",
    type: "radio",
    options: [
      "絶対に嫌（縛りなしが前提）",
      "できれば避けたいが内容次第",
      "気にしない（条件次第でOK）",
    ],
  },
  // 🔹 Q6 を追加
  {
    id: "initialCostImportance",
    question: "初期費用やキャッシュバックの有無はどのくらい重視しますか？",
    type: "radio",
    options: [
      "🔥 非常に重視する（高額CBがあるプランを優先したい）",
      "💰 少し気にする（他条件が同じならCB付きがいい）",
      "🤔 あまり気にしない（長期的なコスパ重視）",
      "🪶 全く気にしない（月額や品質だけで決めたい）",
    ],
  },
];

export default function Phase1({ defaultValues, onSubmit, onBack }: Phase1Props) {
  const [answers, setAnswers] = React.useState<Phase1Answers>(defaultValues);

  const handleChange = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value as string }));
  };

  const answeredCount = phase1Questions.filter(
    (q) => answers[q.id as keyof Phase1Answers]
  ).length;

  return (
    <QuestionLayout
      title="📍 フェーズ①：前提条件"
      onNext={() => onSubmit(answers)}
      onBack={onBack}
      answeredCount={answeredCount}
      totalCount={phase1Questions.length}
      nextLabel="次へ進む →"
    >
      <div className="space-y-6 w-full">
        {phase1Questions.map((q) => (
          <QuestionCard
            key={q.id}
            id={q.id}
            question={q.question}
            options={q.options}
            type={q.type as "radio" | "checkbox"}
            value={answers[q.id as keyof Phase1Answers] as string}
            onChange={handleChange}
          />
        ))}
      </div>
    </QuestionLayout>
  );
}
