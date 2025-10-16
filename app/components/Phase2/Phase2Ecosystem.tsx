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
    {
      id: "shoppingList",
      question:
        "現在よく利用している、または「還元条件が良ければ今後利用してもよい」と思う日々のショッピング先はどれですか？（複数選択可）",
      options: [
        "楽天市場・楽天ブックス・楽天トラベルなど（楽天経済圏）",
        "Yahoo!ショッピング・PayPayモールなど（PayPay / ソフトバンク経済圏）",
        "LOHACO・au PAY加盟店・au Wowma!など（au PAY / Ponta経済圏）",
        "どれが一番お得か分からないので、すべてのパターンを比較したい",
        "特になし",
      ],
      type: "checkbox" as const,
    },
    {
      id: "shoppingMonthly",
      question: "月あたりの想定利用額は？",
      options: [
        "〜5,000円",
        "5,000〜10,000円",
        "10,000〜30,000円",
        "30,000〜50,000円",
        "50,000円以上",
        "まだわからない",
      ],
      type: "radio" as const,
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.shoppingList) && !ans.shoppingList.includes("特になし"),
    },
    {
      id: "paymentList",
      question:
        "現在よく利用している、または「還元条件が良ければ今後利用してもよい」と思う日々の支払い方法はどれですか？（複数選択可）",
      options: [
        "楽天Pay / 楽天カード（楽天経済圏）",
        "d払い / dカード（dポイント経済圏）",
        "PayPay / ペイペイカード（PayPay経済圏）",
        "au PAY / au PAYカード（Ponta経済圏）",
        "どれが一番お得か分からないので、すべてのパターンを比較したい",
        "特になし",
      ],
      type: "checkbox" as const,
    },
    {
      id: "paymentMonthly",
      question: "月あたりの想定利用額は？",
      options: [
        "〜5,000円",
        "5,000〜10,000円",
        "10,000〜30,000円",
        "30,000〜50,000円",
        "50,000円以上",
        "まだわからない",
      ],
      type: "radio" as const,
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.paymentList) && !ans.paymentList.includes("特になし"),
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    let newValue = value;

    // 「特になし」を選んだら他の選択肢を解除
    if (Array.isArray(value) && value.includes("特になし")) {
      newValue = ["特になし"];
    }

    const updates: Partial<Phase2Answers> = { [id]: newValue };

    // 「特になし」の場合、対応する月額質問の値をリセット
    if (id === "shoppingList" && Array.isArray(newValue) && newValue.includes("特になし")) {
      updates.shoppingMonthly = undefined;
    }
    if (id === "paymentList" && Array.isArray(newValue) && newValue.includes("特になし")) {
      updates.paymentMonthly = undefined;
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
          />
        );
      })}
    </div>
  );
}
