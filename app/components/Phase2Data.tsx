"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";
import { Button } from "@/components/ui/button";

interface Props {
  defaultValues: Phase2Answers;
  onNext: (data: Partial<Phase2Answers>) => void;
  onBack: () => void;
  isLast?: boolean;
}

export default function Phase2Data({ defaultValues, onNext, onBack }: Props) {
  const [dataUsage, setDataUsage] = useState(defaultValues.dataUsage);
  const [speedLimitImportance, setSpeedLimitImportance] = useState(defaultValues.speedLimitImportance);
  const [tetheringNeeded, setTetheringNeeded] = useState(defaultValues.tetheringNeeded);
  const [tetheringUsage, setTetheringUsage] = useState(defaultValues.tetheringUsage);

  const handleSubmit = () => {
    onNext({ dataUsage, speedLimitImportance, tetheringNeeded, tetheringUsage });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">① データ通信ニーズ</h2>

      <div className="space-y-6">
        <div>
          <p className="font-semibold mb-2">1. 毎月のデータ使用量はどのくらいですか？</p>
          {["1GB未満", "1〜5GB", "5〜20GB", "20GB以上", "無制限プランを希望"].map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="dataUsage"
                value={opt}
                checked={dataUsage === opt}
                onChange={(e) => setDataUsage(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <div>
          <p className="font-semibold mb-2">2. 通信速度制限がかかる条件や速度を重視しますか？</p>
          {["重視する（制限後も快適に使いたい）", "ある程度気にする", "あまり気にしない"].map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="speedLimitImportance"
                value={opt}
                checked={speedLimitImportance === opt}
                onChange={(e) => setSpeedLimitImportance(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <div>
          <p className="font-semibold mb-2">3. テザリング（PCやタブレットの接続）を使いますか？</p>
          {["よく使う", "たまに使う", "使わない"].map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="tetheringNeeded"
                value={opt}
                checked={tetheringNeeded === opt}
                onChange={(e) => setTetheringNeeded(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        {tetheringNeeded !== "使わない" && (
          <div>
            <p className="font-semibold mb-2">4. テザリングの利用シーンは？</p>
            {["仕事", "旅行・外出先", "自宅で固定回線代わり", "その他"].map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name="tetheringUsage"
                  value={opt}
                  checked={tetheringUsage === opt}
                  onChange={(e) => setTetheringUsage(e.target.value)}
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
