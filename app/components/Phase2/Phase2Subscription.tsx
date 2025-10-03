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
  // 配列のまま保持して渡す
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

  // 進捗バー用：回答済みの質問数をカウント
  const answeredCount = phase2SubscriptionQuestions.reduce((count, q) => {
    if (q.condition && !q.condition(answers)) return count; // 条件を満たさなければカウントしない
    const val = answers[q.id as keyof Phase2Answers];
    if (Array.isArray(val)) {
      return val.length > 0 ? count + 1 : count;
    } else if (val) {
      return count + 1;
    }
    return count;
  }, 0);

  return (
    <QuestionLayout answeredCount={answeredCount} totalCount={phase2SubscriptionQuestions.length} onNext={onNext} onBack={onBack} pageTitle="📦 フェーズ②：サブスク条件">
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
    </QuestionLayout>
  );
}
