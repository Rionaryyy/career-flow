"use client";

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { DiagnosisAnswers } from "@/types/types";
import QuestionCard from "../../layouts/QuestionCard";
import { FlowSectionProps } from "@/types/flowProps";
import { baseConditionsQuestions } from "../questions/baseConditions";

const BaseConditions = forwardRef(function BaseConditions(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🧭 にゃんこナビ＋進捗管理対応
  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < baseConditionsQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= baseConditionsQuestions.length - 1;
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

  // 🟦 回答反映ロジック
  const handleChange = (id: string, value: string | number | string[]) => {
    // comparePeriod は phase1構造を考慮しないでトップに入れる
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const q = baseConditionsQuestions[currentIndex];

  return (
    <section className="calico-bg rounded-[1.25rem] p-5">
      <div className="space-y-6 w-full">
        <QuestionCard
          key={q.id}
          id={q.id}
          question={q.question}
          options={q.options.map((opt) =>
            typeof opt === "string" ? { label: opt, value: opt } : opt
          )}
          type={q.type}
          value={answers[q.id as keyof DiagnosisAnswers] as string}
          onChange={handleChange}
        />

        {/* ✅ compareAxis の質問に紐づく comparePeriod */}
        {q.id === "compareAxis" && answers.compareAxis === "total" && (
          <div className="mt-4 pl-4 border-l-4 border-sky-200">
            <QuestionCard
              id="comparePeriod"
              question="比較したい期間を選んでください（初期費用とキャッシュバックを平均化します）"
              type="radio"
              options={[
                { label: "1年（12ヶ月）", value: "12m" },
                { label: "2年（24ヶ月）", value: "24m" },
                { label: "3年（36ヶ月）", value: "36m" },
              ]}
              // ✅ ID化対応済みなので value は code ("12m") を直接渡す
              value={answers.comparePeriod ?? ""}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    </section>
  );
});

export default BaseConditions;
