// app/components/DiagnosisFlow/sections/PaymentSection.tsx
"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";
import { paymentQuestions } from "../questions/paymentSection";

// 💳 クレカ・銀行の候補リストを定義
const creditCardList = [
  "楽天カード",
  "PayPayカード",
  "dカード",
  "au PAYカード",
  "三井住友カード（NL）",
  "セゾンカード",
  "イオンカード",
  "UQカード",
  "NUROモバイルクレジットカード",
  "その他",
];

const bankList = [
  "三菱UFJ銀行",
  "みずほ銀行",
  "三井住友銀行",
  "ゆうちょ銀行",
  "楽天銀行",
  "PayPay銀行",
  "住信SBIネット銀行",
  "その他",
];

const PaymentSection = forwardRef(function PaymentSection(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // === 表示条件制御 ===
  const answerStr = answers?.considerCardAndPayment?.toString() ?? "";
  const showExplanationOnly = !(answerStr.startsWith("いいえ") || answerStr === "");

  // === Q1の選択に応じて「カード詳細」を同ページ内で出す ===
  const mainCardAnswer = answers["mainCard"];
  const selected = Array.isArray(mainCardAnswer)
    ? mainCardAnswer
    : mainCardAnswer
    ? [mainCardAnswer]
    : [];

  const showCardDetail =
    selected.includes("クレジットカード") ||
    selected.includes("銀行口座引き落とし");

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

      {/* ✅ クレカ／銀行を選択した場合のみ詳細を出す */}
      {showCardDetail && cardDetailQuestion && (
        <div className="mt-4 pl-4 border-l-4 border-sky-200 space-y-6">
          {/* クレジットカード選択時 */}
          {selected.includes("クレジットカード") && (
            <QuestionCard
              id={`${cardDetailQuestion.id}-credit`}
              question="どのクレジットカードを主に利用しますか？（複数選択可）"
              options={creditCardList}
              type="checkbox"
              value={
                answers[`${cardDetailQuestion.id}-credit` as keyof DiagnosisAnswers] as
                  | string
                  | string[]
                  | null
              }
              onChange={(id, value) =>
                handleChange(`${cardDetailQuestion.id}-credit`, value)
              }
              answers={answers}
            />
          )}

          {/* 銀行口座引き落とし選択時 */}
          {selected.includes("銀行口座引き落とし") && (
            <QuestionCard
              id={`${cardDetailQuestion.id}-bank`}
              question="どの銀行口座を主に利用しますか？（複数選択可）"
              options={bankList}
              type="checkbox"
              value={
                answers[`${cardDetailQuestion.id}-bank` as keyof DiagnosisAnswers] as
                  | string
                  | string[]
                  | null
              }
              onChange={(id, value) =>
                handleChange(`${cardDetailQuestion.id}-bank`, value)
              }
              answers={answers}
            />
          )}
        </div>
      )}
    </div>
  );
});

export default PaymentSection;
