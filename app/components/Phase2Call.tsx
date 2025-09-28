"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2CallProps {
  onSubmit: (partial: Partial<Phase2Answers>) => void;
}

export default function Phase2Call({ onSubmit }: Phase2CallProps) {
  const [callFrequency, setCallFrequency] = useState<string | null>(null);
  const [callPriority, setCallPriority] = useState<string | null>(null);
  const [callOptionsNeeded, setCallOptionsNeeded] = useState<string | null>(null);
  const [callPurpose, setCallPurpose] = useState<string | null>(null);

  const handleSubmit = () => {
    onSubmit({
      callFrequency,
      callPriority,
      callOptionsNeeded,
      callPurpose,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">② 通話に関する質問</h2>

      {/* Q1 */}
      <div>
        <p className="font-semibold">Q1. ふだんの通話頻度に近いものを選んでください</p>
        <select
          value={callFrequency ?? ""}
          onChange={(e) => setCallFrequency(e.target.value)}
          className="w-full mt-2 border rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="ほとんど通話しない">ほとんど通話しない</option>
          <option value="月に数回短い通話">月に数回だけ短い通話</option>
          <option value="毎週何度か短い通話">毎週何度か短い通話</option>
          <option value="月に数回〜十数回長めの通話">月に数回〜十数回、10〜20分程度</option>
          <option value="毎日のように長時間通話">毎日のように長時間の通話</option>
        </select>
      </div>

      {/* Q2 */}
      <div>
        <p className="font-semibold">Q2. 通話料の優先事項として一番近いものを選んでください</p>
        <select
          value={callPriority ?? ""}
          onChange={(e) => setCallPriority(e.target.value)}
          className="w-full mt-2 border rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="短時間かけ放題">短時間かけ放題が良い</option>
          <option value="月の合計時間で考える">月の合計時間で考える</option>
          <option value="完全かけ放題">完全かけ放題が良い</option>
          <option value="専用アプリOK">専用アプリでもOK</option>
          <option value="家族・特定の人中心">家族・特定の人との通話中心</option>
        </select>
      </div>

      {/* Q3 */}
      <div>
        <p className="font-semibold">Q3. 留守番電話や着信転送などのオプションは必要ですか？</p>
        <select
          value={callOptionsNeeded ?? ""}
          onChange={(e) => setCallOptionsNeeded(e.target.value)}
          className="w-full mt-2 border rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="必要">はい、必要</option>
          <option value="不要">いいえ、不要</option>
        </select>
      </div>

      {/* Q4 */}
      <div>
        <p className="font-semibold">Q4. 通話の目的に近いものを選んでください</p>
        <select
          value={callPurpose ?? ""}
          onChange={(e) => setCallPurpose(e.target.value)}
          className="w-full mt-2 border rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="個人用">家族や友人との連絡が中心</option>
          <option value="仕事用">仕事・ビジネス用途が多い</option>
          <option value="両方同程度">どちらも同じくらい</option>
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
