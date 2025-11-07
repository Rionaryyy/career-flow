"use client";

import { useState, useEffect } from "react";
import SubscriptionAccordion from "./SubscriptionAccordion";
import { DiagnosisAnswers } from "@/types/types";
import { phase2SubscriptionQuestions } from "./SubscriptionQuestions";
import { FlowSectionProps } from "@/types/flowProps";

/**
 * 統合後: サブスクリプション質問セクション
 * - Phase1/Phase2統合構成対応版
 * - 「includeSubscription」の回答をDiagnosisAnswersから直接参照
 * - 1ページ1カード＋スキップ条件対応
 */
export default function SubscriptionSection({
  answers,
  onChange,
  onNext,
  onBack,
}: FlowSectionProps) {
  const includeSubAnswer = answers?.includeSubscription ?? "";
  const showQuestions = includeSubAnswer.includes("はい");
  const showExplanationOnly = !showQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  // 🟦 「いいえ」の場合はスキップメッセージを表示
  if (showExplanationOnly) {
    return (
      <div className="w-full py-6 space-y-6">
        <p className="text-sky-900 text-lg">
          前提条件「契約予定のサブスクリプション料金や割引も“実質料金”に含めて比較しますか？」に「いいえ」と選択されたため、
          このページでのサブスクリプションに関する質問はスキップされます。
        </p>

        <div className="flex justify-end pt-6">
          {onNext && (
            <button
              onClick={onNext}
              className="px-4 py-2 rounded-lg text-sky-700 hover:text-sky-800 text-sm"
            >
              次へ →
            </button>
          )}
        </div>
      </div>
    );
  }

  // サブスク質問を1枚構成に統合（Accordion内部は複数カード管理）
  const questions = [
    {
      id: "subscriptionList",
      question:
        "契約中または契約予定のサブスクリプションサービスを選択してください（複数選択可）",
    },
  ];

  const q = questions[currentIndex];

  const handleNext = () => {
    const next = currentIndex + 1;
    if (next < questions.length) setCurrentIndex(next);
    else onNext && onNext();
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else onBack && onBack();
  };

  // 🟩 「はい」の場合：質問カード群を表示
  return (
    <div className="w-full space-y-4 py-6">
      {/* === 現在の質問カード === */}
      <div className="w-full bg-white p-6 rounded-2xl border border-sky-200 shadow-md space-y-4">
        <p className="text-xl font-semibold text-sky-900 text-center">
          {q.question}
        </p>

        <div className="mt-4">
          <SubscriptionAccordion answers={answers} onChange={onChange} />
        </div>
      </div>

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
          {currentIndex === questions.length - 1 ? "次へ →" : "次へ →"}
        </button>
      </div>
    </div>
  );
}
