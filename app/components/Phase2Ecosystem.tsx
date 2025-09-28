"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2EcosystemProps {
  onSubmit: (partial: Partial<Phase2Answers>) => void;
}

export default function Phase2Ecosystem({ onSubmit }: Phase2EcosystemProps) {
  const [usingEcosystem, setUsingEcosystem] = useState<string | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<string | null>(null);

  const handleSubmit = () => {
    onSubmit({
      usingEcosystem,
      monthlyUsage,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">③ 経済圏・ポイント利用</h2>

      {/* Q5 */}
      <div>
        <p className="font-semibold">Q5. 現在利用しているポイント経済圏はありますか？</p>
        <select
          value={usingEcosystem ?? ""}
          onChange={(e) => setUsingEcosystem(e.target.value)}
          className="w-full mt-2 border rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="楽天">楽天経済圏</option>
          <option value="PayPay">PayPay経済圏</option>
          <option value="dポイント">dポイント経済圏</option>
          <option value="au PAY">au PAY経済圏</option>
          <option value="特に使っていない">特に利用していない</option>
        </select>
      </div>

      {/* Q6 */}
      {usingEcosystem && usingEcosystem !== "特に使っていない" && (
        <div>
          <p className="font-semibold">Q6. その経済圏での月間利用額に近いものを選んでください</p>
          <select
            value={monthlyUsage ?? ""}
            onChange={(e) => setMonthlyUsage(e.target.value)}
            className="w-full mt-2 border rounded p-2"
          >
            <option value="">選択してください</option>
            <option value="〜5,000円">〜5,000円</option>
            <option value="5,000〜10,000円">5,000〜10,000円</option>
            <option value="10,000〜30,000円">10,000〜30,000円</option>
            <option value="30,000円以上">30,000円以上</option>
          </select>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        次へ進む
      </button>
    </div>
  );
}
