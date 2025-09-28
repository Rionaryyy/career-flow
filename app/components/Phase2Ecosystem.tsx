"use client";

import { Phase2Answers } from "@/types/types";

type Phase2EcosystemProps = {
  answers: Phase2Answers;
  onAnswer: (partial: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Phase2Ecosystem({
  answers,
  onAnswer,
  onNext,
  onBack,
}: Phase2EcosystemProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <h2 className="text-3xl font-bold text-center text-white mb-4">
        🌐 経済圏・ポイント利用状況
      </h2>

      {/* 経済圏を使っているか */}
      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg w-[98%] mx-auto">
        <p className="text-xl font-semibold mb-4 text-white text-center">
          経済圏（楽天・au・ドコモなど）を活用していますか？
        </p>
        <div className="space-y-3">
          {["はい", "いいえ"].map((option) => (
            <button
              key={option}
              onClick={() => onAnswer({ usingEcosystem: option })}
              className={`w-full py-3 rounded-lg border transition ${
                answers.usingEcosystem === option
                  ? "bg-blue-600 border-blue-400 text-white"
                  : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 毎月の経済圏利用額 */}
      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg w-[98%] mx-auto">
        <p className="text-xl font-semibold mb-4 text-white text-center">
          毎月の経済圏での利用額（概算）を教えてください
        </p>
        <div className="space-y-3">
          {["〜1万円", "1〜3万円", "3〜5万円", "5万円以上"].map((option) => (
            <button
              key={option}
              onClick={() => onAnswer({ monthlyUsage: option })}
              className={`w-full py-3 rounded-lg border transition ${
                answers.monthlyUsage === option
                  ? "bg-blue-600 border-blue-400 text-white"
                  : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-slate-600 hover:bg-slate-500 text-sm"
        >
          戻る
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-900/40"
        >
          次へ進む
        </button>
      </div>
    </div>
  );
}
