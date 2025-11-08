// app/components/DiagnosisFlow/sections/PaymentSection.tsx
"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";
import { paymentQuestions } from "../questions/paymentSection";

// 💳 クレカ・銀行の候補リスト（label/value対応）
const creditCardList = [
  { label: "楽天カード", value: "rakuten_card" },
  { label: "PayPayカード", value: "paypay_card" },
  { label: "dカード", value: "d_card" },
  { label: "au PAYカード", value: "aupay_card" },
  { label: "三井住友カード（NL）", value: "smbc_nl" },
  { label: "セゾンカード", value: "saison" },
  { label: "イオンカード", value: "aeon" },
  { label: "UQカード", value: "uq" },
  { label: "NUROモバイルクレジットカード", value: "nuro_card" },
  { label: "その他", value: "other" },
];

const bankList = [
  { label: "三菱UFJ銀行", value: "mufg" },
  { label: "みずほ銀行", value: "mizuho" },
  { label: "三井住友銀行", value: "smbc" },
  { label: "ゆうちょ銀行", value: "jp_bank" },
  { label: "楽天銀行", value: "rakuten_bank" },
  { label: "PayPay銀行", value: "paypay_bank" },
  { label: "住信SBIネット銀行", value: "sbi" },
  { label: "その他", value: "other" },
];

const PaymentSection = forwardRef(function PaymentSection(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // === 表示条件制御 ===
  const considerValue = answers?.considerCardAndPayment ?? "";
  const showExplanationOnly = considerValue === "yes"; // valueベースに変更

  // === Q1の選択に応じて「カード詳細」を同ページ内で出す ===
  const mainCardAnswer = answers["mainCard"];
  const selected = Array.isArray(mainCardAnswer)
    ? mainCardAnswer
    : mainCardAnswer
    ? [mainCardAnswer]
    : [];

  const showCardDetail =
    selected.includes("credit") || selected.includes("bank");

  // === 外部制御（にゃんこボタン対応）===
  useImperativeHandle(ref, () => ({
    goNext() {
      if (showExplanationOnly) {
        onNext && onNext();
        return;
      }

      // ✅ cardDetail はページ送り対象から除外
      let nextIdx = currentIndex + 1;
      if (paymentQuestions[nextIdx]?.id === "cardDetail") {
        nextIdx++;
      }

      if (nextIdx < paymentQuestions.length) {
        setCurrentIndex(nextIdx);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
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

  // ✅ optionsを {label,value} 構造に統一
  const normalizedOptions =
    q.options?.map((opt: any) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    ) ?? [];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === メイン質問 === */}
      <QuestionCard
        key={q.id}
        id={q.id}
        question={q.question}
        options={normalizedOptions}
        type={q.type}
        value={answers[q.id as keyof DiagnosisAnswers] as string | string[] | null}
        onChange={handleChange}
        answers={answers}
      />

      {/* ✅ クレカ／銀行を選択した場合のみ詳細を出す */}
      {showCardDetail && cardDetailQuestion && (
        <div className="mt-4 pl-4 border-l-4 border-sky-200 space-y-6">
          {/* クレジットカード選択時 */}
          {selected.includes("credit") && (
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
          {selected.includes("bank") && (
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
