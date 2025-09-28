"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}


export default function Phase2Ecosystem({ answers, onChange }: Props) {
  const [ecosystem, setEcosystem] = useState<string | null>(null);
  const [ecosystemMonthly, setEcosystemMonthly] = useState<string | null>(null);

  const handleNext = () => {
    onChange({
      ecosystem,
      ecosystemMonthly,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">④ 経済圏・ポイント利用状況</h2>

      {/* Q8 経済圏選択 */}
      <div>
        <p className="font-semibold mb-2">
          1. 現在よく利用している、または今後メインで使う可能性が高いポイント経済圏はどれですか？
        </p>
        <select
          value={ecosystem || ""}
          onChange={(e) => setEcosystem(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">選択してください</option>
          <option value="rakuten">楽天経済圏（楽天カード・楽天市場など）</option>
          <option value="docomo">dポイント（ドコモ・dカードなど）</option>
          <option value="softbank">PayPay / ソフトバンク経済圏</option>
          <option value="au">au PAY / Ponta経済圏</option>
          <option value="none">特になし</option>
        </select>
      </div>

      {/* Q8-2 利用額（「特になし」以外を選んだときだけ表示） */}
      {ecosystem && ecosystem !== "none" && (
        <div>
          <p className="font-semibold mb-2">
            2. その経済圏での月間利用額はどのくらいですか？（おおよそでOK）
          </p>
          <select
            value={ecosystemMonthly || ""}
            onChange={(e) => setEcosystemMonthly(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">選択してください</option>
            <option value="~5000">〜5,000円</option>
            <option value="5000-10000">5,000〜10,000円</option>
            <option value="10000-30000">10,000〜30,000円</option>
            <option value="30000+">30,000円以上</option>
          </select>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!ecosystem || (ecosystem !== "none" && !ecosystemMonthly)}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}
