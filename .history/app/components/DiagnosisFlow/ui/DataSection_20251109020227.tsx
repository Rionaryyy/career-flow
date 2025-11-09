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

  // 🔍 「補足扱い」の質問IDリスト
  const inlineFollowups = {
    dataUsage: ["speedLimitImportance"],
    tetheringNeeded: ["tetheringUsage"],
  };

  // --- 共通ロジック ---
  // 補足質問をスキップして「次の通常質問」インデックスを取得
  function findNextIndex(startIndex: number) {
    let idx = startIndex;
    while (idx < dataQuestions.length) {
      const q = dataQuestions[idx];
      const isInline = Object.values(inlineFollowups).some((arr) =>
        arr.includes(q.id)
      );
      if (!isInline) break;
      idx++;
    }
    return idx;
  }

  // 補足質問をスキップして「前の通常質問」インデックスを取得
  function findPrevIndex(startIndex: number) {
    let idx = startIndex;
    while (idx > 0) {
      const q = dataQuestions[idx];
      const isInline = Object.values(inlineFollowups).some((arr) =>
        arr.includes(q.id)
      );
      if (!isInline) break;
      idx--;
    }
    return Math.max(0, idx);
  }

  // --- にゃんこボタン対応 ---
  useImperativeHandle(ref, () => ({
    goNext() {
      const nextIndex = findNextIndex(currentIndex + 1);
      if (nextIndex < dataQuestions.length) {
        setCurrentIndex(nextIndex);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return findNextIndex(currentIndex + 1) >= dataQuestions.length;
    },
    getCurrentIndex() {
      return currentIndex;
    },
    setCurrentIndex(i: number) {
      // DiagnosisFlowの戻る処理から呼ばれる
      const prevIndex = findPrevIndex(i);
      setCurrentIndex(prevIndex);
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

  const q = dataQuestions[currentIndex];
  const followupIds = inlineFollowups[q.id as keyof typeof inlineFollowups] || [];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === メイン質問 === */}
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

      {/* === 同ページ内の補足質問 === */}
      {dataQuestions
        .filter(
          (sub) =>
            followupIds.includes(sub.id) &&
            sub.condition &&
            sub.condition(answers)
        )
        .map((sub) => (
          <div
            key={sub.id}
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
