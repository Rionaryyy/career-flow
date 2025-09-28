"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}


export default function Phase2Data({ answers, onChange }: Props) {
  const [dataUsage, setDataUsage] = useState<string | null>(null);
  const [speedLimitImportance, setSpeedLimitImportance] = useState<string | null>(null);
  const [tetheringNeeded, setTetheringNeeded] = useState<string | null>(null);
  const [tetheringUsage, setTetheringUsage] = useState<string | null>(null);

  const handleNext = () => {
    onChange({
      dataUsage,
      speedLimitImportance,
      tetheringNeeded,
      tetheringUsage,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">① データ通信に関する質問</h2>

      <div>
        <p className="font-semibold mb-2">1. 毎月のデータ利用量は？</p>
        <select
          value={dataUsage || ""}
          onChange={(e) => setDataUsage(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="low">～5GB</option>
          <option value="medium">5GB～20GB</option>
          <option value="high">20GB以上</option>
          <option value="unlimited">無制限が理想</option>
        </select>
      </div>

      <div>
        <p className="font-semibold mb-2">2. 速度制限後の速度の重要性は？</p>
        <select
          value={speedLimitImportance || ""}
          onChange={(e) => setSpeedLimitImportance(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="not_important">あまり気にしない</option>
          <option value="important">ある程度重要</option>
          <option value="very_important">非常に重要</option>
        </select>
      </div>

      <div>
        <p className="font-semibold mb-2">3. テザリング機能は必要？</p>
        <select
          value={tetheringNeeded || ""}
          onChange={(e) => setTetheringNeeded(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="no">不要</option>
          <option value="yes">必要</option>
        </select>
      </div>

      {tetheringNeeded === "yes" && (
        <div>
          <p className="font-semibold mb-2">4. テザリングの主な用途は？</p>
          <select
            value={tetheringUsage || ""}
            onChange={(e) => setTetheringUsage(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">選択してください</option>
            <option value="pc_work">PC作業</option>
            <option value="tablet">タブレット</option>
            <option value="other">その他</option>
          </select>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!dataUsage}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}
