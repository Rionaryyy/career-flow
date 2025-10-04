"use client";

import { useState, useEffect } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers, Phase1Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  phase1Answers: Phase1Answers; // フェーズ①の回答を受け取る
}

export default function Phase2Payment({ answers, onChange, phase1Answers }: Props) {
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [showComponent, setShowComponent] = useState(false); // 前提条件チェック用

  const questions = [
    {
      id: "mainCard",
      question:
        "通信料金の支払いに利用できる方法を教えてください（複数選択可）\n※割引はクレジットカードまたは銀行口座引き落としが対象です",
      options: [
        "クレジットカード",
        "銀行口座引き落とし",
        "プリペイド・バンドルカード",
        "ポイント残高支払い",
        "その他（店舗払いなど）",
      ],
      type: "checkbox" as const,
    },
    {
      id: "cardDetail",
      question:
        "通信料金の支払いに利用できるカード・銀行を選んでください（複数選択可）\n※クレジットカードまたは銀行口座を選択した場合に表示",
      options: [
        // クレジットカード
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
        // 銀行口座
        "みずほ銀行",
        "三井住友銀行",
        "三菱UFJ銀行",
        "その他",
      ],
      type: "checkbox" as const,
    },
  ];

  // フェーズ①の前提条件で「いいえ」を選んだ場合のみ表示
  useEffect(() => {
    setShowComponent(
      phase1Answers?.considerCardAndPayment === "いいえ"
    );
  }, [phase1Answers]);

  // Q1の選択に応じてQ2の表示を切り替え
  useEffect(() => {
    const mainCardAnswer = answers["mainCard"] as string[] | string | null;
    if (!mainCardAnswer) {
      setShowCardDetail(false);
      return;
    }

    const selected =
      Array.isArray(mainCardAnswer)
        ? mainCardAnswer
        : [mainCardAnswer];

    setShowCardDetail(
      selected.includes("クレジットカード") || selected.includes("銀行口座引き落とし")
    );
  }, [answers]);

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  // フェーズ①で「いいえ」を選んだ場合のみ表示
  if (!showComponent) return null;

  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => {
        // Q2はshowCardDetailがtrueのときのみ表示
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
