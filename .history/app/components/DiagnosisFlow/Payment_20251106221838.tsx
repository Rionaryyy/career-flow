"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";

const Phase2Payment = forwardRef(function Phase2Payment(
  { answers, onChange, onNext, onBack }: FlowSectionProps,
  ref
) {
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // === 表示条件制御 ===
  const answerStr = answers?.considerCardAndPayment?.toString() ?? "";
  const showQuestions = answerStr.startsWith("いいえ") || answerStr === "";
  const showExplanationOnly = !showQuestions;

  const questions = [
    {
      id: "mainCard",
      question:
        "通信料金の支払いに利用できる方法を教えてください（複数選択可）\n※割引はクレジットカードまたは銀行口座引き落としが対象です",
      options: ["クレジットカード", "デビットカード", "銀行口座引き落とし"],
      type: "checkbox" as const,
    },
    {
      id: "cardDetail",
      question:
        "通信料金の支払いに利用できるカード・銀行を選んでください（複数選択可）",
      options: [
        "dカード",
        "dカード GOLD",
        "au PAYカード",
        "au PAYカード GOLD",
        "ソフトバンクカード",
        "ソフトバンクカード GOLD",
        "楽天カード",
        "楽天カード GOLD",
        "PayPayカード",
        "三井住友カード",
        "IIJmioクレジットカード",
        "mineoクレジットカード",
        "UQカード",
        "NUROモバイルクレジットカード",
        "その他",
        "みずほ銀行",
        "三井住友銀行",
        "三菱UFJ銀行",
        "その他",
      ],
      type: "checkbox" as const,
      condition: () => showCardDetail,
    },
  ];

  // 🔹 外部制御（にゃんこボタン対応）
  useImperativeHandle(ref, () => ({
    goNext() {
      if (showExplanationOnly) {
        onNext && onNext();
        return;
      }
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return showExplanationOnly || currentIndex >= questions.length - 1;
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
          前提条件「お得になるなら、専用クレジットカードの発行や特定の支払い方法の利用も検討しますか？」に「はい」と選択されたため、このページでの支払い方法に関する質問は省略されます。
        </p>
      </div>
    );
  }

  // === 通常質問表示 ===
  const q = questions[currentIndex];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === 現在の質問カード === */}
      {(!q.condition || q.condition()) && (
        <QuestionCard
          key={q.id}
          id={q.id}
          question={q.question}
          options={q.options}
          type={q.type}
          value={
            answers[q.id as keyof DiagnosisAnswers] as
              | string
              | string[]
              | null
          }
          onChange={handleChange}
          answers={answers}
        />
      )}

      {/* === 同ページで条件を満たす質問（Q2） === */}
      {questions
        .filter((sub) => sub.condition && sub.condition())
        .filter((sub) => sub.id !== q.id)
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

      {/* 🐾 にゃんこボタン制御に統一（ページ操作ボタン削除） */}
    </div>
  );
});

export default Phase2Payment;
