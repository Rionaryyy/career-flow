"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
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
  const showExplanationOnly = !(answerStr.startsWith("いいえ") || answerStr === "");

  // === Q1の選択に応じて「カード詳細」を同ページ内で出す ===
  const showCardDetail = (() => {
    const mainCardAnswer = answers["mainCard"];
    if (!mainCardAnswer) return false;
    const selected = Array.isArray(mainCardAnswer)
      ? mainCardAnswer
      : [mainCardAnswer];
    return (
      selected.includes("クレジットカード") ||
      selected.includes("銀行口座引き落とし")
    );
  })();

  // === 外部制御（にゃんこボタン対応）===
  useImperativeHandle(ref, () => ({
    goNext() {
      if (showExplanationOnly) {
        onNext && onNext();
        return;
      }

      // ✅ cardDetail はページ送り対象から完全除外
      let nextIdx = currentIndex + 1;
      if (paymentQuestions[nextIdx]?.id === "cardDetail") {
        nextIdx++; // 強制スキップ
      }

      if (nextIdx < paymentQuestions.length) {
        setCurrentIndex(nextIdx);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      // cardDetail を無視した判定
      let nextIdx = currentIndex + 1;
      if (paymentQuestions[nextIdx]?.id === "cardDetail") {
        nextIdx++;
      }
      return showExplanationOnly || nextIdx >= paymentQuestions.length;
    },
    getCurrentIndex() {
      return currentIndex;
    },
    setCurrentIndex(i: number) {
      // 直接ジャンプ時も cardDetail はスキップ
      if (paymentQuestions[i]?.id === "cardDetail") {
        setCurrentIndex(i + 1);
      } else {
        setCurrentIndex(i);
      }
    },
  }));

  const handleChange = (id: string, value: string | number | string[]) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
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

  // === 現在の質問を描画（cardDetailは無視）===
  const q = paymentQuestions[currentIndex];
  const cardDetailQuestion = paymentQuestions.find((q) => q.id === "cardDetail");

  return (
    <div className="w-full py-6 space-y-6">
      {/* === メイン質問 === */}
      <QuestionCard
        key={q.id}
        id={q.id}
        question={q.question}
        options={q.options}
        type={q.type}
        value={answers[q.id as keyof DiagnosisAnswers] as string | string[] | null}
        onChange={handleChange}
        answers={answers}
      />

      {/* ✅ cardDetailを同ページ内に展開（独立しない） */}
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
