"use client";

import { useState } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers, Phase1Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  phase1Answers: Phase1Answers;
  onNext: () => void;
}

export default function Phase2Ecosystem({ answers, onChange, phase1Answers, onNext }: Props) {
  const rawAnswer = phase1Answers?.includePoints ?? "";
  const normalizedAnswer = rawAnswer.replace(/\s/g, "").replace(/（/g, "(").replace(/）/g, ")");
  const skipQuestions = normalizedAnswer.includes("いいえ(現金支出だけで比べたい)");

  if (skipQuestions) {
    return (
      <div className="w-full py-6 space-y-6">
        <p className="text-sky-900 text-lg">
          前提条件「ポイント還元や経済圏特典を料金に含めて考えますか？」に
          「いいえ（現金支出だけで比べたい）」と選択されたため、このページでの経済圏に関する質問は省略されます。
        </p>
      </div>
    );
  }

  const questions = [
    // ====== 🏧 バーコード決済利用額 ======
    {
      id: "monthlyBarcodeSpend",
      question: "月あたりバーコード決済はいくら使いますか？（PayPay、楽天ペイ、au PAYなど）",
      type: "slider" as const,
      min: 1000,
      max: 200000,
      step: 1000,
      unit: "円",
      options: [],
    },

    // ====== 🛒 ショッピング先（経済圏）選択 ======
    {
      id: "shoppingEcosystem",
      question:
        "利用している、または利用してもよい日々のショッピング先を選んでください（複数選択可）",
      options: [
        "楽天市場・楽天ブックス・楽天トラベルなど（楽天経済圏）",
        "Yahoo!ショッピング・PayPayモール・LOHACOなど（PayPay / ソフトバンク経済圏）",
        "au PAYマーケット・au Wowma!など（au PAY / Ponta経済圏）",
        "どれが一番お得か分からないので、すべてのパターンを比較したい",
        "特になし",
      ],
      type: "checkbox" as const,
    },

    // ====== 💰 ショッピング利用額 ======
    {
      id: "monthlyShoppingSpend",
      question: "選択したショッピング先での月あたりの想定利用額をスライダーで選んでください",
      type: "slider" as const,
      min: 1000,
      max: 200000,
      step: 1000,
      unit: "円",
      options: [],
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.shoppingEcosystem) && !ans.shoppingEcosystem.includes("特になし"),
    },
  ];

  const handleChange = (id: string, value: string | string[] | number) => {
    let newValue = value;

    // 「特になし」を選んだら他の選択肢を解除
    if (Array.isArray(value) && value.includes("特になし")) {
      newValue = ["特になし"];
    }

    const updates: Partial<Phase2Answers> = { [id]: newValue };

    // 「特になし」の場合、対応する月額質問の値をリセット
    if (id === "shoppingEcosystem" && Array.isArray(newValue) && newValue.includes("特になし")) {
      updates.monthlyShoppingSpend = undefined;
    }

    onChange(updates);
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
            min={q.min}
            max={q.max}
            step={q.step}
            unit={q.unit}
          />
        );
      })}
    </div>
  );
}
