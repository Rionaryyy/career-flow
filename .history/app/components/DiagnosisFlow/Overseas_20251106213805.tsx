"use client";

import { useState, useEffect } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { FlowSectionProps } from "@/types/flowProps";

export default function Phase2Overseas({ answers, onChange, onNext, onBack }: FlowSectionProps) {
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (
    id: keyof DiagnosisAnswers,
    value: string | number | string[]
  ) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const handleNext = () => {
    const next = currentIndex + 1;
    if (next < questions.length) setCurrentIndex(next);
    else onNext && onNext();
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else onBack && onBack();
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

      {/* === ページ操作ボタン === */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-lg text-sm ${
            currentIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-sky-700 hover:text-sky-800"
          }`}
        >
          ← 戻る
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg text-sky-700 hover:text-sky-800 text-sm"
        >
          {currentIndex === questions.length - 1 ? "次へ" : "次へ →"}
        </button>
      </div>
    </div>
  );
}
