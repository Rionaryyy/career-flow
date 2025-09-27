"use client";

import { Phase1Answers } from "@/types/types";

interface Phase1Props {
  onSubmit: (answers: Phase1Answers) => void;
}

export default function Phase1({ onSubmit }: Phase1Props) {
  const handleSubmit = () => {
    const answers: Phase1Answers = {
      includePoints: true, // ← boolean型ならOK
      networkQuality: "high",
      carrierType: "major",
      supportLevel: "high",
      contractFlexibility: "flexible", // ✅ true → "flexible" に修正
    };
    onSubmit(answers);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">フェーズ①：基本条件</h2>
      <p className="text-gray-600 mb-6">
        以下の条件について選んでください（仮のUIです）
      </p>

      {/* サンプルUI - carrierType */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">希望するキャリアの種類</label>
        <select
          className="border rounded-lg p-2 w-full"
          defaultValue="major"
          onChange={(e) =>
            onSubmit({
              includePoints: true,
              networkQuality: "high",
              carrierType: e.target.value as "major" | "sub" | "cheap",
              supportLevel: "high",
              contractFlexibility: "flexible", // ✅ 型に合わせて文字列で渡す
            })
          }
        >
          <option value="major">大手キャリア</option>
          <option value="sub">サブブランド</option>
          <option value="cheap">格安SIM</option>
        </select>
      </div>

      {/* 契約の柔軟性 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">契約の柔軟性</label>
        <select
          className="border rounded-lg p-2 w-full"
          defaultValue="flexible"
          onChange={(e) =>
            onSubmit({
              includePoints: true,
              networkQuality: "high",
              carrierType: "major",
              supportLevel: "high",
              contractFlexibility: e.target.value as "strict" | "flexible",
            })
          }
        >
          <option value="flexible">縛りなし・柔軟</option>
          <option value="strict">縛りありでもOK</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        次へ進む
      </button>
    </div>
  );
}
