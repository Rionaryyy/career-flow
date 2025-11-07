"use client";

import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { FlowSectionProps } from "@/types/flowProps";
import { dataQuestions } from "../questions/dataSection";

const DataSection = forwardRef(function DataSection(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // にゃんこボタン・進行管理
  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < dataQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= dataQuestions.length - 1;
    },
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

  const handleChange = (id: keyof DiagnosisAnswers, value: string | number | string[]) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const q = dataQuestions[currentIndex];

  // ✅ 同ページ内に「追加質問」として出していいIDを限定
  const inlineFollowups = {
    dataUsage: ["speedLimitImportance"], // Q1の下にQ2を出す
    tetheringNeeded: ["tetheringUsage"], // Q3の下にQ4を出す
  };

  const followupIds = inlineFollowups[q.id as keyof typeof inlineFollowups] || [];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === 現在の質問カード === */}
      <QuestionCard
        key={q.id}
        id={q.id}
        question={q.question}
        options={q.options}
        type={q.type}
        value={answers[q.id as keyof DiagnosisAnswers] as string | null}
        onChange={handleChange}
        answers={answers}
      />

      {/* === 同ページ内で展開する追加質問 === */}
      {dataQuestions
        .filter(
          (sub) =>
            followupIds.includes(sub.id) && // ← 限定された質問のみ
            sub.condition &&
            sub.condition(answers)
        )
        .map((sub) => (
          <div
            key={`${sub.id}-${JSON.stringify(answers[sub.id as keyof DiagnosisAnswers])}`}
            className="mt-4 pl-4 border-l-4 border-sky-200"
          >
            <QuestionCard
              id={sub.id}
              question={sub.question}
              options={sub.options}
              type={sub.type}
              value={answers[sub.id as keyof DiagnosisAnswers] as string | null}
              onChange={handleChange}
              answers={answers}
            />
          </div>
        ))}
    </div>
  );
});

export default DataSection;
