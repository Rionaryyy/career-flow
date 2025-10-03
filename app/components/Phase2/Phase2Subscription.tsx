"use client";

import QuestionLayout from "../layouts/QuestionLayout";
import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";
import { phase2SubscriptionQuestions } from "./Phase2SubscriptionQuestions";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function Phase2Subscription({ answers, onChange, onNext, onBack }: Props) {
  const handleChange = (id: string, value: string | string[]) => {
    // サブスク選択肢用の排他制御
    if (id === "subscriptionServices") {
      if (Array.isArray(value)) {
        if (value.includes("特になし")) {
          value = ["特になし"];
        } else {
          value = value.filter((v) => v !== "特になし");
        }
      }
    }
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  // 回答済みカウント（進捗用）
  const answeredCount = phase2SubscriptionQuestions.reduce((count, q) => {
    if (q.condition && !q.condition(answers)) return count;
    const val = answers[q.id as keyof Phase2Answers];
    if (Array.isArray(val)) {
      return val.length > 0 ? count + 1 : count;
    } else if (val) {
      return count + 1;
    }
    return count;
  }, 0);

  return (
    <QuestionLayout>
      {/* タイトルを画面内で直接表示 */}
      <h2 className="text-2xl font-bold text-sky-900 text-center mb-6">
        📦 フェーズ②：サブスク条件
      </h2>

      {/* 質問カード */}
      <div className="w-full py-6 space-y-6">
        {phase2SubscriptionQuestions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          const currentValue = answers[q.id as keyof Phase2Answers] as string | string[] | null;

          return (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q.question}
              options={q.options}
              type={q.type}
              value={currentValue}
              onChange={handleChange}
              answers={answers}
            />
          );
        })}
      </div>

      {/* 下部ナビボタン */}
      <div className="flex justify-between items-center pt-6 w-full max-w-4xl">
        <button
          onClick={onBack}
          className={`px-4 py-2 rounded-full ${
            !onBack
              ? "bg-sky-100 text-sky-300 cursor-not-allowed"
              : "bg-sky-200 hover:bg-sky-300 text-sky-900 shadow-sm"
          } transition-all duration-200`}
          disabled={!onBack}
        >
          ← 戻る
        </button>

        <button
          onClick={onNext}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-lg font-semibold text-white shadow-md transition-all duration-200"
        >
          次へ →
        </button>
      </div>
    </QuestionLayout>
  );
}
