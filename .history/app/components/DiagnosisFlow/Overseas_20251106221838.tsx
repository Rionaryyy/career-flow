"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";

const Phase2Overseas = forwardRef(function Phase2Overseas(
  { answers, onChange, onNext, onBack }: FlowSectionProps,
  ref
) {
  const questions = [
    {
      id: "overseasSupport",
      question:
        "海外でスマホを使うことがある場合、ローミングプランが用意されているキャリアを希望しますか？",
      options: [
        "はい（海外旅行・出張などでも使いたい）",
        "いいえ（国内利用がメイン）",
      ],
      type: "radio" as const,
      note: "※「はい」を選ぶと、ローミングプランを提供していないキャリアは除外されます。",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 外部制御（にゃんこボタン対応）
  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= questions.length - 1;
    },
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (
    id: keyof DiagnosisAnswers,
    value: string | number | string[]
  ) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const q = questions[currentIndex];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === 現在の質問カード === */}
      <QuestionCard
        id={q.id}
        question={q.question}
        options={q.options}
        type={q.type}
        value={answers[q.id as keyof DiagnosisAnswers] as string | null}
        onChange={handleChange}
        answers={answers}
      />

      {/* === 補足メモ（同ページ内） === */}
      {q.note && (
        <p className="text-sm text-gray-500 mt-2 pl-1">{q.note}</p>
      )}

      {/* 🐾 にゃんこボタン制御に統一（ページ操作ボタン削除） */}
    </div>
  );
});

export default Phase2Overseas;
