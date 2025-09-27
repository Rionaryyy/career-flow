"use client";

import { useState } from "react";
import { Phase1Answers } from "@/types/types";

interface Phase1Props {
  onSubmit: (answers: Phase1Answers) => void;
  onBack?: () => void;
}

export default function Phase1({ onSubmit, onBack }: Phase1Props) {
  const [includePoints, setIncludePoints] = useState<boolean | null>(null);
  const [networkQuality, setNetworkQuality] = useState<"low" | "medium" | "high" | null>(null);
  const [carrierType, setCarrierType] = useState<"major" | "sub" | "cheap" | null>(null);
  const [supportLevel, setSupportLevel] = useState<"low" | "medium" | "high" | null>(null);
  const [contractFlexibility, setContractFlexibility] = useState<"strict" | "flexible" | null>(null);

  const handleSubmit = () => {
    const answers: Phase1Answers = {
      includePoints,
      networkQuality,
      carrierType,
      supportLevel,
      contractFlexibility,
    };
    onSubmit(answers);
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-slate-50">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">フェーズ①：基本条件</h2>

        {/* includePoints */}
        <div className="mb-6">
          <p className="font-semibold mb-2">ポイント還元や特典を料金に含めますか？</p>
          <div className="flex gap-3">
            <button
              onClick={() => setIncludePoints(true)}
              className={`px-4 py-2 rounded ${includePoints === true ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              はい
            </button>
            <button
              onClick={() => setIncludePoints(false)}
              className={`px-4 py-2 rounded ${includePoints === false ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              いいえ
            </button>
          </div>
        </div>

        {/* networkQuality */}
        <div className="mb-6">
          <p className="font-semibold mb-2">通信品質の重視度</p>
          <div className="flex gap-3">
            <button onClick={() => setNetworkQuality("low")} className={`px-4 py-2 rounded ${networkQuality === "low" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>低</button>
            <button onClick={() => setNetworkQuality("medium")} className={`px-4 py-2 rounded ${networkQuality === "medium" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>中</button>
            <button onClick={() => setNetworkQuality("high")} className={`px-4 py-2 rounded ${networkQuality === "high" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>高</button>
          </div>
        </div>

        {/* carrierType */}
        <div className="mb-6">
          <p className="font-semibold mb-2">希望するキャリアの種類</p>
          <div className="flex gap-3">
            <button onClick={() => setCarrierType("major")} className={`px-4 py-2 rounded ${carrierType === "major" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>大手</button>
            <button onClick={() => setCarrierType("sub")} className={`px-4 py-2 rounded ${carrierType === "sub" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>サブブランド</button>
            <button onClick={() => setCarrierType("cheap")} className={`px-4 py-2 rounded ${carrierType === "cheap" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>格安SIM</button>
          </div>
        </div>

        {/* supportLevel */}
        <div className="mb-6">
          <p className="font-semibold mb-2">サポートの重視度</p>
          <div className="flex gap-3">
            <button onClick={() => setSupportLevel("low")} className={`px-4 py-2 rounded ${supportLevel === "low" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>低</button>
            <button onClick={() => setSupportLevel("medium")} className={`px-4 py-2 rounded ${supportLevel === "medium" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>中</button>
            <button onClick={() => setSupportLevel("high")} className={`px-4 py-2 rounded ${supportLevel === "high" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>高</button>
          </div>
        </div>

        {/* contractFlexibility */}
        <div className="mb-8">
          <p className="font-semibold mb-2">契約の縛り</p>
          <div className="flex gap-3">
            <button onClick={() => setContractFlexibility("strict")} className={`px-4 py-2 rounded ${contractFlexibility === "strict" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>縛りあり</button>
            <button onClick={() => setContractFlexibility("flexible")} className={`px-4 py-2 rounded ${contractFlexibility === "flexible" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>縛りなし</button>
          </div>
        </div>

        <div className="flex justify-between">
          {onBack ? (
            <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">戻る</button>
          ) : <div />}

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            次へ進む
          </button>
        </div>
      </div>
    </div>
  );
}
