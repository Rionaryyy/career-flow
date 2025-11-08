"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import SubscriptionAccordion from "./SubscriptionAccordion";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";

/**
 * SubscriptionSection
 * - サブスクリプション質問セクション（Accordion一体型）
 * - includeSubscription = "はい" または "include" の場合のみ質問を表示
 * - にゃんこボタン制御対応（goNext / isCompleted / getCurrentIndex / setCurrentIndex）
 */
const SubscriptionSection = forwardRef(function SubscriptionSection(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const includeSubAnswer = answers?.includeSubscription;

  // ✅ 型安全な判定ロジック
  const showQuestions =
    (typeof includeSubAnswer === "string" &&
      (includeSubAnswer.includes("はい") ||
        includeSubAnswer.includes("include") ||
        includeSubAnswer === "true")) ||
    (typeof includeSubAnswer === "boolean" && includeSubAnswer === true);

  const showExplanationOnly = !showQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 外部制御（にゃんこボタン対応）
  useImperativeHandle(ref, () => ({
    goNext() {
      if (showExplanationOnly) {
        onNext && onNext();
        return;
      }
      if (currentIndex < 0) {
        setCurrentIndex(0);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return showExplanationOnly || currentIndex >= 0;
    },
    getCurrentIndex() {
      return currentIndex;
    },
    setCurrentIndex(i: number) {
      setCurrentIndex(i);
    },
  }));

  // ページ遷移時にスクロールトップへ
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  // 🟦 「いいえ」または「exclude」選択時 → スキップ表示
  if (showExplanationOnly) {
    return (
      <div className="w-full py-6 space-y-6">
        <p className="text-sky-900 text-lg leading-relaxed">
          前提条件「契約予定のサブスクリプション料金や割引も“実質料金”に含めて比較しますか？」
          に「いいえ」と選択されたため、このページでのサブスクリプションに関する質問はスキップされます。
        </p>
      </div>
    );
  }

  // 🟩 「はい」または「include」選択時 → 質問カード表示
  const questions = [
    {
      id: "subscriptionList",
      question:
        "契約中または契約予定のサブスクリプションサービスを選択してください（複数選択可）",
    },
  ];

  const q = questions[currentIndex];

  return (
    <div className="w-full space-y-4 py-6">
      <div className="w-full bg-white p-6 rounded-2xl border border-sky-200 shadow-md space-y-4">
        <p className="text-xl font-semibold text-sky-900 text-center">
          {q.question}
        </p>

        <div className="mt-4">
          {/* ✅ Accordionは{label, value}対応済み */}
          <SubscriptionAccordion answers={answers} onChange={onChange} />
        </div>
      </div>
    </div>
  );
});

export default SubscriptionSection;
