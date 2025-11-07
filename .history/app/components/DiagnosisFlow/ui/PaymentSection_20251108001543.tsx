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
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // === 表示条件制御 ===
  const answerStr = answers?.considerCardAndPayment?.toString() ?? "";
  const showQuestions = answerStr.startsWith("いいえ") || answerStr === "";
  const showExplanationOnly = !showQuestions;

  // === 外部制御（にゃんこボタン対応） ===
  useImperativeHandle(ref, () => ({
    goNext() {
      if (showExplanationOnly) {
        onNext && onNext();
        return;
      }
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
    // 🔹 追加：最後の質問を検知（DiagnosisFlow 側の「結果を見る」切替に使う）
    isAtLastQuestion() {
      return showExplanationOnly || currentIndex >= paymentQuestions.length - 1;
    },
  }));

  // === Q1の選択に応じてQ2の表示を制御 ===
  useEffect(() => {
    const mainCardAnswer = answers["mainCard"] as string[] | string | null;
    if (!mainCardAnswer) {
      setShowCardDetail(false);
      return;
    }
    const selected = Array.isArray(mainCardAnswer)
      ? mainCardAnswer
      : [mainCardAnswer];
    setShowCardDetail(
      selected.includes("クレジットカード") ||
        selected.includes("銀行口座引き落とし")
    );
  }, [answers]);

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

  // === 通常質問表示 ===
  const q = paymentQuestions[currentIndex];

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

      {/* === 条件付きでQ2（カード詳細）を同ページ内に展開 === */}
      {showCardDetail &&
        paymentQuestions
          .filter((sub) => sub.id === "cardDetail")
          .map((sub) => (
            <div key={sub.id} className="mt-4 pl-4 border-l-4 border-sky-200">
              <QuestionCard
                id={sub.id}
                question={sub.question}
                options={sub.options}
                type={sub.type}
                value={
                  answers[sub.id as keyof DiagnosisAnswers] as
                    | string
                    | string[]
                    | null
                }
                onChange={handleChange}
                answers={answers}
              />
            </div>
          ))}
    </div>
  );
});

export default PaymentSection;
