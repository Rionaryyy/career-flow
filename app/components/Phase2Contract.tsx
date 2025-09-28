"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";
import { Button } from "@/components/ui/button";

interface Props {
  defaultValues: Phase2Answers;
  onNext: (data: Partial<Phase2Answers>) => void;
  onBack: () => void;
}

export default function Phase2Contract({ defaultValues, onNext, onBack }: Props) {
  const [familyLines, setFamilyLines] = useState(defaultValues.familyLines);
  const [setDiscount, setSetDiscount] = useState(defaultValues.setDiscount);
  const [infraSet, setInfraSet] = useState(defaultValues.infraSet);

  const handleSubmit = () => {
    onNext({ familyLines, setDiscount, infraSet });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">③ 契約条件・割引系</h2>

      <div className="space-y-6">
        <div>
          <p className="font-semibold mb-2">1. 家族割引を適用できる回線数はどのくらいですか？</p>
          {["1回線", "2回線", "3回線以上", "利用できない / わからない"].map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="familyLines"
                value={opt}
                checked={familyLines === opt}
                onChange={(e) => setFamilyLines(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <div>
          <p className="font-semibold mb-2">2. 光回線とのセット割を適用できますか？</p>
          {["はい（対象の光回線を契約予定・契約中）", "いいえ / わからない"].map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="setDiscount"
                value={opt}
                checked={setDiscount === opt}
                onChange={(e) => setSetDiscount(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <div>
          <p className="font-semibold mb-2">3. 電気やガスなどのインフラサービスとのセット割を適用できますか？</p>
          {["はい（対象サービスを契約予定・契約中）", "いいえ / わからない"].map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="infraSet"
                value={opt}
                checked={infraSet === opt}
                onChange={(e) => setInfraSet(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={onBack}>戻る</Button>
        <Button onClick={handleSubmit}>次へ進む</Button>
      </div>
    </div>
  );
}
