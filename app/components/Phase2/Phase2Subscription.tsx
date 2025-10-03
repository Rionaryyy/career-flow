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
  if (id === "subscriptionServices") {  // ← id は質問定義のID名に合わせて変更
    // value が配列の場合だけ排他処理
    if (Array.isArray(value)) {
      // 「特になし」が選ばれていたら他は全部解除
      if (value.includes("特になし")) {
        value = ["特になし"];
      } else {
        // 「特になし」が含まれていれば削除
        value = value.filter((v) => v !== "特になし");
      }
    }
  }

  onChange({ [id]: value } as Partial<Phase2Answers>);
};

  return (
    <QuestionLayout title="⑤ サブスク利用状況" onNext={onNext} onBack={onBack}>
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
              value={currentValue} // ← 配列のまま渡す
              onChange={handleChange} // id と value の2引数で渡す
              answers={answers}
            />
          );
        })}
      </div>
    </QuestionLayout>
  );
}
