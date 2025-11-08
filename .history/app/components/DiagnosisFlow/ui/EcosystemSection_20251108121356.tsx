// app/components/DiagnosisFlow/ui/EcosystemSection.tsx
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
  // === 前提条件スキップ判定 ===
  const skipPoints = answers?.includePoints === "no"; // valueベース判定に変更
  if (skipPoints) {
    return (
      <div className="w-full py-6 space-y-6">
        <p className="text-sky-900 text-lg">
          前提条件「ポイント還元や経済圏特典を料金に含めて考えますか？」に
          「いいえ（現金支出だけで比べたい）」を選択されたため、
          このページでの経済圏に関する質問は省略されます。
        </p>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  // === にゃんこボタン対応 ===
  useImperativeHandle(ref, () => ({
    goNext() {
      const visibleQuestions = ecosystemQuestions.filter((q) => !q.parentId);
      if (currentIndex < visibleQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      const visibleQuestions = ecosystemQuestions.filter((q) => !q.parentId);
      return currentIndex >= visibleQuestions.length - 1;
    },
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

    // 🔸「特になし」→ 単一化（value対応）
    if (Array.isArray(value) && value.includes("none")) {
      newValue = ["none"];
    }

    // 🔸「すべて比較」→ 全選択（value対応）
    if (Array.isArray(value) && value.includes("compare_all")) {
      const allValues = ["rakuten", "paypay", "aupay", "compare_all"];
      newValue = allValues.filter((v) => v !== "none");
    }

    const updates: Partial<DiagnosisAnswers> = { [id as string]: newValue };

    // 🔸「特になし」選択時は月額利用額リセット
    if (id === "shoppingEcosystem" && Array.isArray(newValue) && newValue.includes("none")) {
      updates.monthlyShoppingSpend = undefined;
    }

    onChange(updates);
  };

  // === 現在の質問 ===
  const visibleQuestions = ecosystemQuestions.filter((q) => !q.parentId);
  const q = visibleQuestions[currentIndex];

  // === optionsをlabel/value対応で正規化 ===
  const normalizeOptions = (opts: any[]) =>
    opts?.map((opt: any) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    ) ?? [];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === メイン質問カード === */}
      <QuestionCard
        key={q.id}
        id={q.id}
        question={q.question}
        options={normalizeOptions(q.options)}
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

      {/* === 同ページ内の補足質問 === */}
      {ecosystemQuestions
        .filter(
          (sub) =>
            sub.condition &&
            sub.condition(answers) &&
            sub.parentId === q.id
        )
        .map((sub) => (
          <div key={sub.id} className="mt-4 pl-4 border-l-4 border-sky-200">
            <QuestionCard
              id={sub.id}
              question={sub.question}
              options={normalizeOptions(sub.options)}
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
