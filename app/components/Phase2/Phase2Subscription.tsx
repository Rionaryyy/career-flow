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
  const handleChange = (id: keyof Phase2Answers, value: string | string[]) => {
    onChange({ [id]: Array.isArray(value) ? value.join(", ") : value });
  };

  return (
    <QuestionLayout title="⑤ サブスク利用状況" onNext={onNext} onBack={onBack}>
      <div className="w-full px-2 sm:px-4 py-6 space-y-4">
        {phase2SubscriptionQuestions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          const currentValue = answers[q.id] as string | string[] | undefined;

          return (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q.question}
              options={q.options}
              type={q.type}
              value={currentValue || undefined}
              onChange={(value) => handleChange(q.id, value)}
            />
          );
        })}
      </div>
    </QuestionLayout>
  );
}
