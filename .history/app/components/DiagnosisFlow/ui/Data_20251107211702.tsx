// app/components/DiagnosisFlow/ui/DataSection.tsx
"use client";

import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { FlowSectionProps } from "@/types/flowProps";
import { dataQuestions } from "../questions/dataSection";

const DataSection = forwardRef(function DataSection(
  { answers, onChange, onNext, onBack }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (id: keyof DiagnosisAnswers, value: string | number | string[]) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const q = dataQuestions[currentIndex];

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

      {/* === 条件付き質問を同ページ内で展開 === */}
      {dataQuestions
        .filter((sub) => sub.condition && sub.condition(answers))
        .filter((sub) => sub.id !== q.id)
        .map((sub) => (
          <div key={sub.id} className="mt-4 pl-4 border-l-4 border-sky-200">
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
