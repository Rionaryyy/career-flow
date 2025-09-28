"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";
import { Button } from "@/components/ui/button";

interface Props {
  defaultValues: Phase2Answers;
  onNext: (data: Partial<Phase2Answers>) => void;
  onBack: () => void;
}

export default function Phase2Ecosystem({ defaultValues, onNext, onBack }: Props) {
  const [ecosystem, setEcosystem] = useState(defaultValues.ecosystem);
  const [ecosystemMonthly, setEcosystemMonthly] = useState(defaultValues.ecosystemMonthly);

  const handleSubmit = () => {
    onNext({ ecosystem, ecosystemMonthly });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">④ 経済圏・ポイント利用状況</h2>

      <div className="space-y-6">
        <div>
          <p className="font-semibold mb-2">1. 現在よく利用している、または今後メインで使う可能性が高いポイント経済圏はどれですか？</p>
          {[
            "楽天経済圏（楽天カード・楽天市場など）",
            "dポイント（ドコモ・dカードなど）",
            "PayPay / ソフトバンク経済圏",
            "au PAY / Ponta経済圏",
            "特になし",
          ].map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="ecosystem"
                value={opt}
                checked={ecosystem === opt}
                onChange={(e) => setEcosystem(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        {ecosystem && ecosystem !== "特になし" && (
          <div>
            <p className="font-semibold mb-2">2. その経済圏での月間利用額はどのくらいですか？</p>
            {["〜5,000円", "5,000〜10,000円", "10,000〜30,000円", "30,000円以上"].map(opt => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name="ecosystemMonthly"
                  value={opt}
                  checked={ecosystemMonthly === opt}
                  onChange={(e) => setEcosystemMonthly(e.target.value)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={onBack}>戻る</Button>
        <Button onClick={handleSubmit}>次へ進む</Button>
      </div>
    </div>
  );
}
