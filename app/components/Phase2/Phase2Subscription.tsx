// app/components/phase2/Phase2Subscription.tsx
"use client";

import SubscriptionAccordion from "./SubscriptionAccordion";
import { Phase2Answers } from "@/types/types";
import { phase2SubscriptionQuestions } from "./Phase2SubscriptionQuestions";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Subscription({ answers, onChange }: Props) {
  // 追加質問の表示判定
  const subscriptionMonthlyQuestion = phase2SubscriptionQuestions.find(
    (q) => q.id === "subscriptionMonthly"
  );
  const showSubscriptionMonthly = subscriptionMonthlyQuestion?.condition?.(answers);

  return (
    <div className="w-full space-y-4">
      {/* メインカード */}
      <div className="w-full bg-white p-6 rounded-2xl border border-sky-200 shadow-md space-y-4">
        <p className="text-xl font-semibold text-sky-900 text-center">
          契約中または契約予定のサブスクリプションサービスを選択してください（複数選択可）
        </p>
        <div className="mt-4">
          <SubscriptionAccordion answers={answers} onChange={onChange} />
        </div>
      </div>

      {/* 追加質問をカードの外側に表示 */}
      {showSubscriptionMonthly && subscriptionMonthlyQuestion && (
        <div className="w-full bg-white p-6 rounded-2xl border border-sky-200 shadow-md space-y-4">
          <p className="text-xl font-semibold text-sky-900 text-left">
            {subscriptionMonthlyQuestion.question}
          </p>
          <div className="mt-4 flex flex-col space-y-3">
            {subscriptionMonthlyQuestion.options.map((opt) => {
              const checked = answers.subscriptionMonthly === opt;
              return (
                <div
                  key={opt}
                  onClick={() => onChange({ subscriptionMonthly: opt })}
                  className={`flex items-center justify-start cursor-pointer h-16 px-4 rounded-xl border text-sm font-medium transition-all duration-200 select-none ${
                    checked
                      ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow"
                      : "bg-white border-sky-200 text-sky-900 hover:border-sky-300 hover:shadow-sm"
                  }`}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
