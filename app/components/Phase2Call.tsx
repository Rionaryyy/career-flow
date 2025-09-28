"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}


export default function Phase2Call({ answers, onChange }: Props) {
  const [callFrequency, setCallFrequency] = useState<string | null>(null);
  const [callPriority, setCallPriority] = useState<string | null>(null);
  const [callOptionsNeeded, setCallOptionsNeeded] = useState<string | null>(null);
  const [callPurpose, setCallPurpose] = useState<string | null>(null);

  const handleNext = () => {
    onChange({
      callFrequency,
      callPriority,
      callOptionsNeeded,
      callPurpose,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">② 通話に関する質問</h2>

      <div>
        <p className="font-semibold mb-2">1. 通話の頻度はどのくらいですか？</p>
        <select
          value={callFrequency || ""}
          onChange={(e) => setCallFrequency(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="rarely">ほとんどしない</option>
          <option value="sometimes">時々する（月数回）</option>
          <option value="often">よくする（週数回〜毎日）</option>
        </select>
      </div>

      <div>
        <p className="font-semibold mb-2">2. 通話品質の重視度は？</p>
        <select
          value={callPriority || ""}
          onChange={(e) => setCallPriority(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="low">あまり重視しない</option>
          <option value="medium">ある程度重視</option>
          <option value="high">非常に重視</option>
        </select>
      </div>

      <div>
        <p className="font-semibold mb-2">3. 通話オプション（かけ放題など）は必要？</p>
        <select
          value={callOptionsNeeded || ""}
          onChange={(e) => setCallOptionsNeeded(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="no">特に不要</option>
          <option value="short">5分〜10分かけ放題</option>
          <option value="unlimited">無制限かけ放題</option>
        </select>
      </div>

      <div>
        <p className="font-semibold mb-2">4. 主な通話の目的は？</p>
        <select
          value={callPurpose || ""}
          onChange={(e) => setCallPurpose(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="personal">プライベート</option>
          <option value="business">仕事</option>
          <option value="mixed">両方</option>
        </select>
      </div>

      <button
        onClick={handleNext}
        disabled={!callFrequency}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}
