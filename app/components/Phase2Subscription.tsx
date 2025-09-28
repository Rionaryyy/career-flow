"use client";

import React from "react";
import { Phase2Answers } from "@/types/types";

export interface Phase2SubscriptionProps {
  answers: Phase2Answers; // ✅ 追加
  onAnswer: (partial: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Phase2Subscription({
  answers,
  onAnswer,
  onNext,
  onBack,
}: Phase2SubscriptionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <h2 className="text-3xl font-bold text-center text-white mb-4">
        📦 フェーズ②：サブスク・サービス利用状況
      </h2>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 w-[98%] mx-auto transition-all duration-300">
        <p className="text-xl font-semibold mb-4 text-white text-center">
          現在利用中のサブスクサービスを選んでください（複数選択可）
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Netflix",
            "Amazon Prime",
            "YouTube Premium",
            "Apple Music",
            "Spotify",
            "Disney+",
          ].map((service) => (
            <button
              key={service}
              onClick={() => {
                const current = answers.subscriptions || [];
                const updated = current.includes(service)
                  ? current.filter((s) => s !== service)
                  : [...current, service];
                onAnswer({ subscriptions: updated });
              }}
              className={`w-full py-3 rounded-lg border transition ${
                answers.subscriptions?.includes(service)
                  ? "bg-blue-600 border-blue-400 text-white"
                  : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
              }`}
            >
              {service}
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
