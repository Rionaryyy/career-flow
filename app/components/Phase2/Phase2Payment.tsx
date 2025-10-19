"use client";

import { useState, useEffect } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers, Phase1Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  phase1Answers: Phase1Answers; // フェーズ①の回答を受け取る
  onNext: () => void; // 「結果を見る」ボタン用
}

export default function Phase2Payment({ answers, onChange, phase1Answers, onNext }: Props) {
  const [showCardDetail, setShowCardDetail] = useState(false);

  // フェーズ①で「いいえ」を選択した場合のみ質問を表示
  // フェーズ①で「いいえ」を選択した場合のみ質問を表示
// 未選択(undefined) の場合は質問を表示するように修正
const answerStr = phase1Answers?.considerCardAndPayment?.toString() ?? "";
const showQuestions = answerStr.startsWith("いいえ") || answerStr === ""; // ← 修正点！
const showExplanationOnly = !showQuestions;

  const questions = [
    {
      id: "mainCard",
      question:
        "通信料金の支払いに利用できる方法を教えてください（複数選択可）\n※割引はクレジットカードまたは銀行口座引き落としが対象です",
      options: [
        "クレジットカード",
        "デビットカード",
        "銀行口座引き落とし",
      ],
      type: "checkbox" as const,
    },
    {
      id: "cardDetail",
      question:
        "通信料金の支払いに利用できるカード・銀行を選んでください（複数選択可）",
      options: [
        "dカード",
        "dカード GOLD",
        "au PAYカード",
        "au PAYカード GOLD",
        "ソフトバンクカード",
        "ソフトバンクカード GOLD",
        "楽天カード",
        "楽天カード GOLD",
        "PayPayカード",
        "三井住友カード",
        "IIJmioクレジットカード",
        "mineoクレジットカード",
        "UQカード",
        "NUROモバイルクレジットカード",
        "その他",
        "みずほ銀行",
        "三井住友銀行",
        "三菱UFJ銀行",
        "その他",
      ],
      type: "checkbox" as const,
    },
  ];

  // Q1の選択に応じてQ2の表示を切り替え
  useEffect(() => {
    const mainCardAnswer = answers["mainCard"] as string[] | string | null;
    if (!mainCardAnswer) {
      setShowCardDetail(false);
      return;
    }

    const selected = Array.isArray(mainCardAnswer) ? mainCardAnswer : [mainCardAnswer];
    setShowCardDetail(
      selected.includes("クレジットカード") || selected.includes("銀行口座引き落とし")
    );
  }, [answers]);

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  // はいの場合は説明文と「結果を見る」ボタンだけ表示
  if (showExplanationOnly) {
    return (
      <div className="w-full py-6 space-y-6">
        <p className="text-sky-900 text-lg">
          前提条件「お得になるなら、専用クレジットカードの発行や特定の支払い方法の利用も検討しますか？」に「はい」と選択されたため、このページでの支払い方法に関する質問は省略されます。
        </p>

        <div className="flex justify-end pt-6">
        </div>
      </div>
    );
  }

  // いいえの場合は通常通り質問を表示
  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => {
        if (q.id === "cardDetail" && !showCardDetail) return null;

        const currentValue = answers[q.id as keyof Phase2Answers] as
          | string
          | string[]
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
