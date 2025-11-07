"use client";

import { useState, useEffect } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";

export default function Phase2Ecosystem({ answers, onChange, onNext, onBack }: FlowSectionProps) {
  const rawAnswer = answers?.includePoints ?? "";
  const normalizedAnswer = rawAnswer
    .replace(/\s/g, "")
    .replace(/（/g, "(")
    .replace(/）/g, ")");
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
      id: "monthlyBarcodeSpend",
      question:
        "月あたりバーコード決済はいくら使いますか？（PayPay、楽天ペイ、au PAYなど）",
      type: "slider" as const,
      min: 1000,
      max: 200000,
      step: 1000,
      unit: "円",
      options: [],
    },
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
    {
      id: "monthlyShoppingSpend",
      question:
        "選択したショッピング先での月あたりの想定利用額をスライダーで選んでください",
      type: "slider" as const,
      min: 1000,
      max: 200000,
      step: 1000,
      unit: "円",
      options: [],
      condition: (ans: DiagnosisAnswers) =>
        Array.isArray(ans.shoppingEcosystem) &&
        !ans.shoppingEcosystem.includes("特になし"),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (
    id: string | number | symbol,
    value: string | string[] | number
  ) => {
    let newValue = value;

    if (Array.isArray(value) && value.includes("特になし")) {
      newValue = ["特になし"];
    }

    if (
      Array.isArray(value) &&
      value.includes("どれが一番お得か分からないので、すべてのパターンを比較したい")
    ) {
      const allOptions = [
        "楽天市場・楽天ブックス・楽天トラベルなど（楽天経済圏）",
        "Yahoo!ショッピング・PayPayモール・LOHACOなど（PayPay / ソフトバンク経済圏）",
        "au PAYマーケット・au Wowma!など（au PAY / Ponta経済圏）",
        "どれが一番お得か分からないので、すべてのパターンを比較したい",
        "特になし",
      ];
      newValue = allOptions.filter((opt) => opt !== "特になし");
    }

    const updates: Partial<DiagnosisAnswers> = { [id as string]: newValue };

    if (
      id === "shoppingEcosystem" &&
      Array.isArray(newValue) &&
      newValue.includes("特になし")
    ) {
      updates.monthlyShoppingSpend = undefined;
    }

    onChange(updates);
  };

  const handleNext = () => {
    const next = currentIndex + 1;
    if (next < questions.length) setCurrentIndex(next);
    else onNext && onNext();
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else onBack && onBack();
  };

  const q = questions[currentIndex];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === 現在の質問カード === */}
      <QuestionCard
        key={q.id}
        id={q.id}
        question={q.question}
        options={q.options}
        type={q.type}
        value={answers[q.id as keyof DiagnosisAnswers] as
          | string
          | string[]
          | number
          | null}
        onChange={handleChange}
        answers={answers}
        min={q.min}
        max={q.max}
        step={q.step}
        unit={q.unit}
      />

      {/* === 条件付き質問（同ページ内展開） === */}
      {questions
        .filter((sub) => sub.condition && sub.condition(answers))
        .filter((sub) => sub.id !== q.id)
        .map((sub) => (
          <div key={sub.id} className="mt-4 pl-4 border-l-4 border-sky-200">
            <QuestionCard
              id={sub.id}
              question={sub.question}
              options={sub.options}
              type={sub.type}
              value={answers[sub.id as keyof DiagnosisAnswers] as
                | string
                | string[]
                | number
                | null}
              onChange={handleChange}
              answers={answers}
              min={sub.min}
              max={sub.max}
              step={sub.step}
              unit={sub.unit}
            />
          </div>
        ))}

      {/* === ページ操作ボタン === */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-lg text-sm ${
            currentIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-sky-700 hover:text-sky-800"
          }`}
        >
          ← 戻る
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg text-sky-700 hover:text-sky-800 text-sm"
        >
          {currentIndex === questions.length - 1 ? "次へ" : "次へ →"}
        </button>
      </div>
    </div>
  );
}
