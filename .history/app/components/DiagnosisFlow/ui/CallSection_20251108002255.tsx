"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";
import { paymentQuestions } from "../questions/paymentSection";

const PaymentSection = forwardRef(function PaymentSection(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // === 表示条件制御 ===
  const answerStr = answers?.considerCardAndPayment?.toString() ?? "";
  const showQuestions = answerStr.startsWith("いいえ") || answerStr === "";
  const showExplanationOnly = !showQuestions;

  // 🔹 Q1 で「カード詳細」を同ページ内に出すための判定
  const showCardDetail = (() => {
    const mainCardAnswer = answers["mainCard"] as string[] | string | null;
    if (!mainCardAnswer) return false;
    const selected = Array.isArray(mainCardAnswer)
      ? mainCardAnswer
      : [mainCardAnswer];
    return (
      selected.includes("クレジットカード") ||
      selected.includes("銀行口座引き落とし")
    );
  })();

  // === 外部制御（にゃんこボタン対応） ===
  useImperativeHandle(ref, () => ({
    goNext() {
      if (showExplanationOnly) {
        onNext && onNext();
        return;
      }
      // 現在が最後の質問でなければ進む
      if (currentIndex < paymentQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return showExplanationOnly || currentIndex >= paymentQuestions.length - 1;
    },
    getCurrentIndex() {
      return currentIndex;
    },
    setCurrentIndex(i: number) {
      setCurrentIndex(i);
    },
    isAtLastQuestion() {
      return showExplanationOnly || currentIndex >= paymentQuestions.length - 1;
    },
  }));

  const handleChange = (
    id: string | number | symbol,
    value: string | number | string[]
  ) => {
    onChange({ [id as string]: value } as Partial<DiagnosisAnswers>);
  };

  // === 「はい」選択時は説明文のみ表示 ===
  if (showExplanationOnly) {
    return (
      <div className="w-full py-6 space-y-6">
        <p className="text-sky-900 text-lg">
          前提条件「お得になるなら、専用クレジットカードの発行や特定の支払い方法の利用も検討しますか？」に
          「はい」と選択されたため、このページでの支払い方法に関する質問は省略されます。
        </p>
      </div>
    );
  }

  // === 表示するメイン質問 ===
  const q = paymentQuestions[currentIndex];

  // ✅ ここが重要：cardDetailは currentIndex に依存せず、同ページ内で動的展開
  const cardDetailQuestion = paymentQuestions.find((q) => q.id === "cardDetail");

  return (
    <div className="w-full py-6 space-y-6">
      {/* === 現在の質問カード === */}
      <QuestionCard
        key={q.id}
        id={q.id}
        question={q.question}
        options={q.options}
        type={q.type}
        value={
          answers[q.id as keyof DiagnosisAnswers] as string | string[] | null
        }
        onChange={handleChange}
        answers={answers}
      />

      {/* === 「カード詳細」を同ページ内で展開 === */}
      {showCardDetail && cardDetailQuestion && (
        <div className="mt-4 pl-4 border-l-4 border-sky-200">
          <QuestionCard
            id={cardDetailQuestion.id}
            question={cardDetailQuestion.question}
            options={cardDetailQuestion.options}
            type={cardDetailQuestion.type}
            value={
              answers[cardDetailQuestion.id as keyof DiagnosisAnswers] as
                | string
                | string[]
                | null
            }
            onChange={handleChange}
            answers={answers}
          />
        </div>
      )}
    </div>
  );
});

export default PaymentSection;
