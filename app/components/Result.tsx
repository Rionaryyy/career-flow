// components/ResultComparison.tsx
"use client";

import React from "react";
import { DiagnosisAnswers } from "@/types/types";

interface Props {
  answers: DiagnosisAnswers;
  onRestart: () => void;
}

export default function ResultComparison({ answers, onRestart }: Props) {
  // 仮データ：今後ユーザー回答に応じて動的に変更可能
  const plans = [
    {
      name: "SIMのみプラン（最安）",
      monthlyFee: "2,980円",
      cashback: "-",
      description: "端末なし、最安プラン"
    },
    {
      name: "SIMのみプラン＋キャッシュバック",
      monthlyFee: "2,980円",
      cashback: "10,000円",
      description: "端末なし、乗り換えCB適用"
    },
    {
      name: "端末購入プラン（最安）",
      monthlyFee: "4,500円",
      cashback: "-",
      description: "端末分割払いあり、最安プラン"
    },
    {
      name: "端末購入プラン＋キャッシュバック",
      monthlyFee: "4,500円",
      cashback: "15,000円",
      description: "端末分割払いあり、CB適用"
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">
        📊 仮診断結果比較
      </h1>

      <p className="text-center text-gray-700 mb-4">
        まだ仮データです。将来的にはあなたの回答に基づいたプランが表示されます。
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-lg">
          <thead className="bg-sky-100">
            <tr>
              <th className="px-4 py-2 border-b">プラン名</th>
              <th className="px-4 py-2 border-b">月額料金</th>
              <th className="px-4 py-2 border-b">キャッシュバック</th>
              <th className="px-4 py-2 border-b">説明</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                <td className="px-4 py-2 border-b">{plan.name}</td>
                <td className="px-4 py-2 border-b">{plan.monthlyFee}</td>
                <td className="px-4 py-2 border-b">{plan.cashback}</td>
                <td className="px-4 py-2 border-b">{plan.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-white font-semibold shadow-md transition-all duration-200"
        >
          診断をやり直す
        </button>
      </div>
    </div>
  );
}
