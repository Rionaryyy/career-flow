"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2SubscriptionProps {
  onSubmit: (partial: Partial<Phase2Answers>) => void;
}

export default function Phase2Subscription({ onSubmit }: Phase2SubscriptionProps) {
  const [usingServices, setUsingServices] = useState<string[]>([]);
  const [monthlySubscriptionCost, setMonthlySubscriptionCost] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setUsingServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      usingServices,
      monthlySubscriptionCost,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">④ サブスク利用状況</h2>

      {/* Q7 */}
      <div>
        <p className="font-semibold">Q7. 現在利用している定額サービスがあれば選択してください（複数選択可）</p>
        <div className="space-y-2 mt-2">
          {[
            "Netflix",
            "YouTube Premium",
            "Amazon Prime",
            "Apple One",
            "Spotify",
            "LINE MUSIC",
            "なし",
          ].map((service) => (
            <label key={service} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={usingServices.includes(service)}
                onChange={() => toggleService(service)}
              />
              <span>{service}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Q8 */}
      <div>
        <p className="font-semibold">Q8. サブスク全体で月額いくらくらい支払っていますか？</p>
        <select
          value={monthlySubscriptionCost ?? ""}
          onChange={(e) => setMonthlySubscriptionCost(e.target.value)}
          className="w-full mt-2 border rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="0〜500円">0〜500円</option>
          <option value="500〜1,000円">500〜1,000円</option>
          <option value="1,000〜2,000円">1,000〜2,000円</option>
          <option value="2,000円以上">2,000円以上</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        次へ進む
      </button>
    </div>
  );
}
