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
      id: "dualSim",
      question: "2. デュアルSIM（2回線利用）を検討していますか？",
      options: [
        "はい（メイン＋サブで使い分けたい）",
        "はい（海外用と国内用で使い分けたい）",
        "いいえ（1回線のみの予定）",
      ],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい"),
    },
    {
      id: "stayDuration",
      question: "3. 滞在期間・頻度を教えてください",
      options: ["短期旅行（数日〜2週間）", "長期滞在（1か月〜数年）"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい"),
    },
    {
      id: "usageType",
      question: "4. 利用内容を選んでください",
      options: ["データ通信のみ", "通話のみ", "データ＋通話両方"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい"),
    },
    {
      id: "stayCountry",
      question: "5. 滞在国・地域を教えてください",
      options: ["地域を入力（判定ロジックで条件付与）"],
      type: "custom" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい"),
    },
    {
      id: "monthlyData",
      question: "6. 月間データ通信量の目安は？",
      options: ["〜50MB/日", "〜200MB/日", "〜500MB/日", "1GB以上/日", "特にこだわらない"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい"),
    },
    {
      id: "monthlyCall",
      question: "7. 通話は週あたりどのくらいですか？",
      options: ["5分未満", "5〜30分", "30〜60分", "60分以上", "特にこだわらない"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい"),
    },
    {
      id: "localSimPurchase",
      question: "8. 現地SIMを自分で購入・利用できますか？",
      options: ["はい（併用プランを希望）", "いいえ（国内SIM＋海外オプション中心）"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい") && ans.dualSim?.startsWith("はい"),
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
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
  );
}
