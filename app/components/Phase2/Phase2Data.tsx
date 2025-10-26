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
  question: "月にどのくらいのデータ通信量が必要ですか？",
  options: [
    "できるだけ安く使いたい（容量は少なくてOK）",
    "3GB以上（Wi-Fiメイン・通話専用など）",
    "5GB以上（ライトユーザー・SNS中心）",
    "10GB以上（標準的な利用・動画も少し）",
    "20GB以上（外出時もよく使う）",
    "30GB以上（大容量ユーザー・動画中心）",
    "50GB以上（モバイル中心・高頻度利用）",
    "無制限（上限なしで使いたい）",
  ],
  type: "radio" as const,
},
    {
      id: "speedLimitImportance",
      question: "速度制限後の通信速度について、どの程度の快適さを求めますか？",
      options: [
        "大手キャリア水準以上（1〜3Mbps・YouTube低画質も可）",
        "サブブランド水準以上（0.5〜1Mbps・SNSやWeb閲覧は可）",
        "格安SIM水準でも可（128〜300kbps・チャット中心向け）",
      ],
      type: "radio" as const,
      // 🔽 条件: 無制限以外を選んだ場合のみ表示
      condition: (ans: Phase2Answers) =>
        ans.dataUsage !== "無制限（上限なしで使いたい）" &&
        ans.dataUsage !== null &&
        ans.dataUsage !== "",
    },
    {
      id: "tetheringNeeded",
      question: "テザリング機能は必要ですか？",
      options: ["はい（必要）", "いいえ（不要）"],
      type: "radio" as const,
    },
    {
  id: "tetheringUsage",
  question: "テザリングを利用する場合、月にどのくらいのデータ量が必要ですか？",
  options: [
    "30GB以上（出先での作業やPC接続が多い）",
    "60GB以上（在宅ワークなどで頻繁に利用）",
    "制限なし・無制限プラン希望",
  ],
  type: "radio" as const,
  condition: (ans: Phase2Answers) => ans.tetheringNeeded?.includes("はい"),
},
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => {
        // 分岐条件があれば表示制御
        if (q.condition && !q.condition(answers)) return null;

        const currentValue = answers[q.id as keyof Phase2Answers] as
          | string
          | null;

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
