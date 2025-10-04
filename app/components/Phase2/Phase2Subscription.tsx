"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";
import { phase2SubscriptionQuestions } from "./Phase2SubscriptionQuestions";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Subscription({ answers, onChange }: Props) {
 const handleChange = (id: string, value: string | string[]) => {
  // 「特になし」の排他制御
  if (id === "subscriptionServices" && Array.isArray(value)) {
    if (value.includes("特になし")) {
      // 「特になし」を選んだら他の選択肢を解除
      value = ["特になし"];
    } else {
      // 他の選択肢を選んだら「特になし」を除外
      value = value.filter((v) => v !== "特になし");
    }
  }

  onChange({ [id]: value } as Partial<Phase2Answers>);
};


  return (
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
  );
}
