"use client";

import { FC } from "react";
import { DiagnosisAnswers, Phase2Answers } from "../types/types";

interface Phase2Props {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  next: () => void;
  back: () => void;
}

const Phase2: FC<Phase2Props> = ({ answers, setAnswers, next, back }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">📍 フェーズ②：詳細条件</h2>

      {/* ① 契約条件まわり */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">家族割を利用していますか？</h3>
        <div className="grid gap-2">
          {["はい", "いいえ"].map((option) => (
            <button
              key={option}
              onClick={() => setAnswers({ ...answers, familyDiscount: option as Phase2Answers["familyDiscount"] })}
              className={`p-3 rounded ${
                answers.familyDiscount === option ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">光回線・電気などとのセット割を利用していますか？</h3>
        <div className="grid gap-2">
          {["はい", "いいえ"].map((option) => (
            <button
              key={option}
              onClick={() => setAnswers({ ...answers, bundleDiscount: option as Phase2Answers["bundleDiscount"] })}
              className={`p-3 rounded ${
                answers.bundleDiscount === option ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ② 経済圏・ポイント利用 */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">よく利用する経済圏はありますか？</h3>
        <div className="grid gap-2">
          {["楽天", "dポイント", "PayPay", "au PAY", "特になし"].map((option) => (
            <button
              key={option}
              onClick={() => setAnswers({ ...answers, ecosystemUse: option as Phase2Answers["ecosystemUse"] })}
              className={`p-3 rounded ${
                answers.ecosystemUse === option ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ③ データ通信ニーズ */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">月のデータ使用量はどのくらいですか？</h3>
        <div className="grid gap-2">
          {["〜5GB（メール中心）", "10〜20GB（動画・SNS多め）", "無制限"].map((option) => (
            <button
              key={option}
              onClick={() => setAnswers({ ...answers, dataUsage: option as Phase2Answers["dataUsage"] })}
              className={`p-3 rounded ${
                answers.dataUsage === option ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ④ 通話ニーズ */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">通話はどのくらいしますか？</h3>
        <div className="grid gap-2">
          {["ほとんどしない", "5分以内が多い", "無制限が必要"].map((option) => (
            <button
              key={option}
              onClick={() => setAnswers({ ...answers, callFrequency: option as Phase2Answers["callFrequency"] })}
              className={`p-3 rounded ${
                answers.callFrequency === option ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ ボタン操作 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={back}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          ← 戻る
        </button>
        <button
          onClick={next}
          disabled={
            !answers.familyDiscount ||
            !answers.bundleDiscount ||
            !answers.ecosystemUse ||
            !answers.dataUsage ||
            !answers.callFrequency
          }
          className={`px-6 py-3 rounded font-semibold ${
            answers.familyDiscount &&
            answers.bundleDiscount &&
            answers.ecosystemUse &&
            answers.dataUsage &&
            answers.callFrequency
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          診断結果を見る →
        </button>
      </div>
    </section>
  );
};

export default Phase2;
