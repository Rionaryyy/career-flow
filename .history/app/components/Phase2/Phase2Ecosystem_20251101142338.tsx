"use client";

import { useState, useEffect } from "react";
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

  // 🟩 支払い額を上限としてショッピングスライダー上限を制御
  const [shoppingMax, setShoppingMax] = useState(200000);
  useEffect(() => {
    if (answers.paymentMonthly) {
      const numericPayment = Number(answers.paymentMonthly);
      setShoppingMax(Math.min(numericPayment, 200000));
    } else {
      setShoppingMax(200000);
    }
  }, [answers.paymentMonthly]);

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
    // ====== 支払い方法（Step1 経済圏選択） ======
    {
      id: "paymentEcosystem",
      question:
        "よく利用している、または興味のある経済圏を選んでください（複数選択可）",
      options: [
        "楽天経済圏（楽天Pay / 楽天カードなど）",
        "dポイント経済圏（d払い / dカードなど）",
        "PayPay経済圏（PayPay / PayPayカードなど）",
        "Ponta経済圏（au PAY / au PAYカードなど）",
        "どれが一番お得か分からないので、すべてのパターンを比較したい",
        "特になし",
      ],
      type: "checkbox" as const,
    },

    // ====== 支払い方法（Step2 経済圏ごとの詳細） ======
    {
      id: "rakutenDetails",
      question: "楽天経済圏で利用している、または検討中の支払い方法を選んでください（複数選択可）",
      options: [
        "楽天Pay（QRコード決済）",
        "楽天カード（クレジットカード）",
        "楽天ゴールドカード（上位カード）",
      ],
      type: "checkbox" as const,
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.paymentEcosystem) &&
        ans.paymentEcosystem.includes("楽天経済圏（楽天Pay / 楽天カードなど）"),
    },
    {
      id: "dDetails",
      question: "dポイント経済圏で利用している、または検討中の支払い方法を選んでください（複数選択可）",
      options: [
        "d払い（QRコード決済）",
        "dカード（クレジットカード）",
        "dカード GOLD（上位カード）",
      ],
      type: "checkbox" as const,
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.paymentEcosystem) &&
        ans.paymentEcosystem.includes("dポイント経済圏（d払い / dカードなど）"),
    },
    {
      id: "paypayDetails",
      question: "PayPay経済圏で利用している、または検討中の支払い方法を選んでください（複数選択可）",
      options: [
        "PayPay（QRコード決済）",
        "PayPayカード（クレジットカード）",
        "PayPayゴールドカード（上位カード）",
      ],
      type: "checkbox" as const,
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.paymentEcosystem) &&
        ans.paymentEcosystem.includes("PayPay経済圏（PayPay / PayPayカードなど）"),
    },
    {
      id: "auDetails",
      question: "Ponta経済圏（au PAY）で利用している、または検討中の支払い方法を選んでください（複数選択可）",
      options: [
        "au PAY（QRコード決済）",
        "au PAYカード（クレジットカード）",
        "au PAY ゴールドカード（上位カード）",
      ],
      type: "checkbox" as const,
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.paymentEcosystem) &&
        ans.paymentEcosystem.includes("Ponta経済圏（au PAY / au PAYカードなど）"),
    },

    // ====== 支払い金額スライダー ======
    {
      id: "paymentMonthly",
      question: "選択した支払い方法での日常の支払い（月あたり）の想定利用額をスライダーで選んでください",
      type: "slider" as const,
      min: 1000,
      max: 200000,
      step: 1000,
      unit: "円",
      options: [],
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.paymentEcosystem) && !ans.paymentEcosystem.includes("特になし"),
    },

    // ====== ショッピング ======
    {
      id: "shoppingList",
      question:
        "選択した支払い方法で、利用してもよい日々のショッピング先を選んでください（複数選択可）",
      options: [
        "楽天市場・楽天ブックス・楽天トラベルなど（楽天経済圏）",
        "Yahoo!ショッピング・PayPayモールなど（PayPay / ソフトバンク経済圏）",
        "dショッピング・d fashion・dトラベルなど（dポイント / ドコモ経済圏）",
        "LOHACO・au PAYマーケット・au Wowma!など（au PAY / Ponta経済圏）",
        "どれが一番お得か分からないので、すべてのパターンを比較したい",
        "特になし",
      ],
      type: "checkbox" as const,
    },
    {
      id: "shoppingMonthly",
      question: "選択したショッピング先での日々のショッピング（月あたり）の想定利用額をスライダーで選んでください",
      type: "slider" as const,
      min: 1000,
      max: shoppingMax, // 🟩 支払い額に連動
      step: 1000,
      unit: "円",
      options: [],
      condition: (ans: Phase2Answers) =>
        Array.isArray(ans.shoppingList) && !ans.shoppingList.includes("特になし"),
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
    if (id === "shoppingList" && Array.isArray(newValue) && newValue.includes("特になし")) {
      updates.shoppingMonthly = undefined;
    }
    if (id === "paymentEcosystem" && Array.isArray(newValue) && newValue.includes("特になし")) {
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
