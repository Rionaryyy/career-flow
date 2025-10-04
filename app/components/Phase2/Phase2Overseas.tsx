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
      id: "overseasUse",
      question: "1. 海外でスマホを利用する予定はありますか？",
      options: [
        "はい（短期旅行・年数回レベル）",
        "はい（長期滞在・留学・海外出張など）",
        "いいえ（国内利用のみ）",
      ],
      type: "radio" as const,
    },
    {
      id: "overseasPreference",
      question: "2. 海外利用時の希望に近いものを選んでください",
      options: [
        "海外でも日本と同じように通信したい（ローミング含め使い放題が希望）",
        "現地でSNSや地図だけ使えればOK（低速・少量でも可）",
        "必要に応じて現地SIMを使うので、特に希望はない",
      ],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい"),
    },
    {
      id: "dualSim",
      question: "3. デュアルSIM（2回線利用）を検討していますか？",
      options: [
        "はい（メイン＋サブで使い分けたい）",
        "はい（海外用と国内用で使い分けたい）",
        "いいえ（1回線のみの予定）",
      ],
      type: "radio" as const,
    },
    {
      id: "specialUses",
      question: "4. 特殊な利用目的がありますか？（複数選択可）",
      options: [
        "副回線として安価なプランを探している（メインとは別）",
        "法人契約または業務用利用を検討している",
        "子ども・高齢者向けなど家族のサブ回線用途",
        "IoT機器・見守り用など特殊用途",
        "特になし",
      ],
      type: "checkbox" as const,
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <div className="w-full py-6 space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
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
  );
}
