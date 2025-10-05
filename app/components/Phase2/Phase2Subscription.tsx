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
  if (Array.isArray(value)) {
    if (value.includes("特になし")) {
      // この質問内で「特になし」を選んだ場合のみ置き換え
      value = ["特になし"];
    } else {
      // この質問内で他の選択肢を選んだ場合、「特になし」を除外
      value = value.filter((v) => v !== "特になし");
    }
  }

  // 更新は該当する質問の回答のみ
  onChange({ [id]: value } as Partial<Phase2Answers>);
};
  // ジャンルごとに質問をまとめて表示
  const groupedQuestions = phase2SubscriptionQuestions.reduce<Record<string, typeof phase2SubscriptionQuestions>>(
    (acc, q) => {
      const section = q.section || "その他";
      if (!acc[section]) acc[section] = [];
      acc[section].push(q);
      return acc;
    },
    {}
  );

  return (
    <div className="w-full py-6 space-y-8">
      {Object.entries(groupedQuestions).map(([section, questions]) => (
        <div key={section} className="space-y-6">
          {/* セクションタイトル */}
          {section && <h3 className="text-lg font-semibold">{section}</h3>}

          {/* セクション内の質問 */}
          {questions.map((q) => {
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
      ))}
    </div>
  );
}
