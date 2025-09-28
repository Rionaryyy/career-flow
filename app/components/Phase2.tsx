"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

// ✅ 各セクションのコンポーネント読み込み（直下にある想定）
import Phase2Data from "./Phase2Data";
import Phase2Call from "./Phase2Call";
import Phase2Contract from "./Phase2Contract";
import Phase2Ecosystem from "./Phase2Ecosystem";
import Phase2Subscription from "./Phase2Subscription";
import Phase2Device from "./Phase2Device";
import Phase2Overseas from "./Phase2Overseas";
import Phase2Payment from "./Phase2Payment";

interface Phase2Props {
  onSubmit: (answers: Phase2Answers) => void;
  defaultValues: Phase2Answers;
}

export default function Phase2({ onSubmit, defaultValues }: Phase2Props) {
  const [answers, setAnswers] = useState<Phase2Answers>(defaultValues);
  const [step, setStep] = useState<number>(0);

  const steps = [
    { id: "data", label: "① データ通信" },
    { id: "call", label: "② 通話" },
    { id: "contract", label: "③ 契約条件・割引" },
    { id: "ecosystem", label: "④ 経済圏・ポイント" },
    { id: "subscription", label: "⑤ サブスク" },
    { id: "device", label: "⑥ 端末・購入形態" },
    { id: "overseas", label: "⑦ 海外利用・特殊ニーズ" },
    { id: "payment", label: "⑧ 支払い方法" },
  ];

  const updateAnswers = (updated: Partial<Phase2Answers>) => {
    setAnswers((prev) => ({ ...prev, ...updated }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">{steps[step].label}</h2>
        <div className="text-slate-400 text-sm">
          {step + 1} / {steps.length}
        </div>
      </div>

      {/* ✅ セクション切り替え */}
      {step === 0 && <Phase2Data answers={answers} onChange={updateAnswers} />}
      {step === 1 && <Phase2Call answers={answers} onChange={updateAnswers} />}
      {step === 2 && <Phase2Contract answers={answers} onChange={updateAnswers} />}
      {step === 3 && <Phase2Ecosystem answers={answers} onChange={updateAnswers} />}
      {step === 4 && <Phase2Subscription answers={answers} onChange={updateAnswers} />}
      {step === 5 && <Phase2Device answers={answers} onChange={updateAnswers} />}
      {step === 6 && <Phase2Overseas answers={answers} onChange={updateAnswers} />}
      {step === 7 && <Phase2Payment answers={answers} onChange={updateAnswers} />}

      {/* ✅ ナビゲーションボタン */}
      <div className="flex justify-between mt-10">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`px-6 py-3 rounded-2xl shadow-lg transition-all ${
            step === 0
              ? "bg-slate-600 text-slate-300 cursor-not-allowed"
              : "bg-slate-700 hover:bg-slate-600 text-white"
          }`}
        >
          ← 戻る
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg transition-all"
        >
          {step === steps.length - 1 ? "結果を見る →" : "次へ →"}
        </button>
      </div>
    </div>
  );
}
