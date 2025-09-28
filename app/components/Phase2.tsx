"use client";

import Phase2Ecosystem from "./Phase2Ecosystem";
import Phase2Subscription from "./Phase2Subscription";
import { Phase2Answers } from "@/types/types";

interface Phase2Props {
  answers: Phase2Answers;
  setAnswers: (partial: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Phase2({ answers, setAnswers, onNext, onBack }: Phase2Props) {
  const handleAnswer = (partial: Partial<Phase2Answers>) => {
    setAnswers(partial);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center mb-6">詳細条件を入力</h2>

      {/* ✅ サブセクションごとに onAnswer を渡す */}
      <Phase2Ecosystem answers={answers} onAnswer={handleAnswer} />
      <Phase2Subscription answers={answers} onAnswer={handleAnswer} />

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          戻る
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          結果を見る
        </button>
      </div>
    </div>
  );
}
