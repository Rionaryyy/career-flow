"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2SubscriptionProps {
  onAnswer: (answers: Partial<Phase2Answers>) => void;
  defaultValues?: Phase2Answers;
}

export default function Phase2Subscription({
  onAnswer,
  defaultValues,
}: Phase2SubscriptionProps) {
  const [subs, setSubs] = useState<string[]>(defaultValues?.subs || []);
  const [subsDiscountPreference, setSubsDiscountPreference] = useState<string | null>(
    defaultValues?.subsDiscountPreference || null
  );

  const handleSubsChange = (sub: string) => {
    setSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleSubmit = () => {
    onAnswer({
      subs,
      subsDiscountPreference,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">サブスクサービスの利用について</h2>

      <div className="space-y-2">
        <p>利用している（または利用予定）のあるサブスクを選んでください：</p>
        <div className="flex flex-col space-y-2">
          {["Netflix", "YouTube Premium", "Amazon Prime", "Apple Music"].map(
            (sub) => (
              <label key={sub} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={subs.includes(sub)}
                  onChange={() => handleSubsChange(sub)}
                />
                <span>{sub}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p>サブスク割引（セット割）を重視しますか？</p>
        <select
          value={subsDiscountPreference || ""}
          onChange={(e) => setSubsDiscountPreference(e.target.value || null)}
          className="border p-2 rounded"
        >
          <option value="">選択してください</option>
          <option value="重視する">重視する</option>
          <option value="あまり重視しない">あまり重視しない</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        次へ進む
      </button>
    </div>
  );
}
