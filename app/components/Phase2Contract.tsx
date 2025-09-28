"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}


export default function Phase2Contract({ answers, onChange}: Props) {
  const [familyLines, setFamilyLines] = useState<string | null>(null);
  const [setDiscount, setSetDiscount] = useState<string | null>(null);
  const [infraSet, setInfraSet] = useState<string | null>(null);

  const handleNext = () => {
    onChange({
      familyLines,
      setDiscount,
      infraSet,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">③ 契約条件・割引について</h2>

      {/* Q5 家族割引 */}
      <div>
        <p className="font-semibold mb-2">1. 家族割引を適用できる回線数はどのくらいですか？</p>
        <select
          value={familyLines || ""}
          onChange={(e) => setFamilyLines(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="1">1回線</option>
          <option value="2">2回線</option>
          <option value="3+">3回線以上</option>
          <option value="none">利用できない / わからない</option>
        </select>
      </div>

      {/* Q6 光回線セット割 */}
      <div>
        <p className="font-semibold mb-2">2. 光回線とのセット割を適用できますか？</p>
        <select
          value={setDiscount || ""}
          onChange={(e) => setSetDiscount(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="yes">はい（契約中または契約予定）</option>
          <option value="no">いいえ / わからない</option>
        </select>
      </div>

      {/* Q7 電気・ガスなどのセット割 */}
      <div>
        <p className="font-semibold mb-2">3. 電気やガスなどのインフラサービスとのセット割は適用できますか？</p>
        <select
          value={infraSet || ""}
          onChange={(e) => setInfraSet(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="yes">はい（契約中または契約予定）</option>
          <option value="no">いいえ / わからない</option>
        </select>
      </div>

      <button
        onClick={handleNext}
        disabled={!familyLines}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}
