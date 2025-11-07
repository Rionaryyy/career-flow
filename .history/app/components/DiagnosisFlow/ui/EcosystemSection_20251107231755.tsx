"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";
import { ecosystemQuestions } from "../questions/ecosystemSection";

const EcosystemSection = forwardRef(function EcosystemSection(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const rawAnswer = answers?.includePoints ?? "";
  const normalizedAnswer = rawAnswer
    .replace(/\s/g, "")
    .replace(/（/g, "(")
    .replace(/）/g, ")");
  const skipQuestions = normalizedAnswer.includes("いいえ(現金支出だけで比べたい)");

  // 🔹 「いいえ」選択時はスキップ
  if (skipQuestions) {
    return (
      <div className="w-full py-6 space-y-6">
        <p className="text-sky-900 text-lg">
          前提条件「ポイント還元や経済圏特典を料金に含めて考えますか？」に
          「いいえ（現金支出だけで比べたい）」と選択されたため、
          このページでの経済圏に関する質問は省略されます。
        </p>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 DiagnosisFlowから制御されるメソッド定義
  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < ecosystemQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= ecosystemQuestions.length - 1;
    },
    // 🧭 戻る時の進行位置保持・復元用
    getCurrentIndex() {
      return currentIndex;
    },
    setCurrentIndex(i: number) {
      setCurrentIndex(i);
    },
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  // === 回答変更処理 ===
  const handleChange = (
    id: string | number | symbol,
    value: string | string[] | number
  ) => {
    let newValue = value;

    // 「特になし」選択時は単一化
    if (Array.isArray(value) && value.includes("特になし")) {
      newValue = ["特になし"];
    }

    // 「すべて比較したい」選択時は全選択
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

    // 「特になし」を選んだら関連値をリセット
    if (
      id === "shoppingEcosystem" &&
      Array.isArray(newValue) &&
      newValue.includes("特になし")
    ) {
      updates.monthlyShoppingSpend = undefined;
    }

    onChange(updates);
  };

  const q = ecosystemQuestions[currentIndex];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === 現在の質問カード === */}
      <QuestionCard
  key={q.id}
  id={q.id}
  question={q.question}
  options={q.options ?? []}   // ← 修正
  type={q.type}
  value={
    answers[q.id as keyof DiagnosisAnswers] as
      | string
      | string[]
      | number
      | null
  }
  onChange={handleChange}
  answers={answers}
  min={q.min}
  max={q.max}
  step={q.step}
  unit={q.unit}
/>


      {/* === 条件付き質問（同ページ内に展開） === */}
      {ecosystemQuestions
        .filter(
          (sub) =>
            sub.condition &&
            sub.condition(answers) &&
            sub.parentId === q.id // ← 追加ポイント：同ページ内限定
        )
        .map((sub) => (
          <div key={sub.id} className="mt-4 pl-4 border-l-4 border-sky-200">
            <QuestionCard
  id={sub.id}
  question={sub.question}
  options={sub.options ?? []}   // ← 修正
  type={sub.type}
  value={
    answers[sub.id as keyof DiagnosisAnswers] as
      | string
      | string[]
      | number
      | null
  }
  onChange={handleChange}
  answers={answers}
  min={sub.min}
  max={sub.max}
  step={sub.step}
  unit={sub.unit}
/>

          </div>
        ))}
    </div>
  );
});

export default EcosystemSection;
