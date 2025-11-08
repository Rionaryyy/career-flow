// app/components/DiagnosisFlow/ui/OverseasSection.tsx
"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";
import { overseasQuestions } from "../questions/overseasSection";

const OverseasSection = forwardRef(function OverseasSection(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 外部制御（にゃんこボタン対応）
  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < overseasQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= overseasQuestions.length - 1;
    },
    // 🧭 戻る時の位置保持・復元対応
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

  const handleChange = (
    id: keyof DiagnosisAnswers,
    value: string | number | string[]
  ) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const q = overseasQuestions[currentIndex];

  // ✅ optionsを {label, value} 構造に対応（後方互換あり）
  const normalizedOptions =
    q.options?.map((opt: any) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    ) ?? [];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === 現在の質問カード === */}
      <QuestionCard
        id={q.id}
        question={q.question}
        options={normalizedOptions}
        type={q.type}
        value={answers[q.id as keyof DiagnosisAnswers] as string | null}
        onChange={handleChange}
        answers={answers}
      />

      {/* === 補足メモ === */}
      {q.note && <p className="text-sm text-gray-500 mt-2 pl-1">{q.note}</p>}
    </div>
  );
});

export default OverseasSection;
