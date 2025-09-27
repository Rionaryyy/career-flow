"use client";

import { useState } from "react";
import { Phase1Answers } from "@/types/types";

interface Phase1Props {
  onSubmit: (answers: Phase1Answers) => void;
}

export default function Phase1({ onSubmit }: Phase1Props) {
  const [answers, setAnswers] = useState<Phase1Answers>({
    includeEconomy: "no",
    networkPriority: "medium",
    carrierType: "major",
    supportPriority: "medium",
    contractBinding: "no",
  });

  const handleChange = <K extends keyof Phase1Answers>(key: K, value: Phase1Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">フェーズ①（前提条件）</h2>

      {/* Q1 */}
      <div>
        <label className="block font-medium mb-2">
          料金にポイント還元や経済圏特典を含めて考えますか？
        </label>
        <select
          value={answers.includeEconomy}
          onChange={(e) => handleChange("includeEconomy", e.target.value as "yes" | "no")}
          className="w-full p-2 border rounded"
        >
          <option value="yes">はい</option>
          <option value="no">いいえ</option>
        </select>
      </div>

      {/* Q2 */}
      <div>
        <label className="block font-medium mb-2">通信品質の重視度を教えてください</label>
        <select
          value={answers.networkPriority}
          onChange={(e) =>
            handleChange("networkPriority", e.target.value as "high" | "medium" | "low")
          }
          className="w-full p-2 border rounded"
        >
          <option value="high">高い</option>
          <option value="medium">普通</option>
          <option value="low">低くてもOK</option>
        </select>
      </div>

      {/* Q3 */}
      <div>
        <label className="block font-medium mb-2">希望するキャリアの種類を選んでください</label>
        <select
          value={answers.carrierType}
          onChange={(e) =>
            handleChange("carrierType", e.target.value as "major" | "subbrand" | "mvno")
          }
          className="w-full p-2 border rounded"
        >
          <option value="major">大手キャリア</option>
          <option value="subbrand">サブブランド</option>
          <option value="mvno">格安SIM</option>
        </select>
      </div>

      {/* Q4 */}
      <div>
        <label className="block font-medium mb-2">サポート体制の重視度を教えてください</label>
        <select
          value={answers.supportPriority}
          onChange={(e) =>
            handleChange("supportPriority", e.target.value as "high" | "medium" | "low")
          }
          className="w-full p-2 border rounded"
        >
          <option value="high">高い</option>
          <option value="medium">普通</option>
          <option value="low">低くてもOK</option>
        </select>
      </div>

      {/* Q5 */}
      <div>
        <label className="block font-medium mb-2">契約縛りがあっても問題ありませんか？</label>
        <select
          value={answers.contractBinding}
          onChange={(e) => handleChange("contractBinding", e.target.value as "yes" | "no")}
          className="w-full p-2 border rounded"
        >
          <option value="yes">はい</option>
          <option value="no">いいえ</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        次へ進む
      </button>
    </div>
  );
}
