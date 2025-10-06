// app/components/phase2/Phase2Subscription.tsx
"use client";

import SubscriptionAccordion from "./SubscriptionAccordion";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Subscription({ answers, onChange }: Props) {
  return (
    <div className="w-full py-6 space-y-6">
      {/* 説明文を追加 */}
      <p className="text-lg text-gray-600">
        契約中または契約予定のサブスクリプションサービスを選択してください
      </p>
      {/* サブスク質問をアコーディオンで表示 */}
      <SubscriptionAccordion answers={answers} onChange={onChange} />
    </div>
  );
}
