"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

// 各セクションのコンポーネント
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
  onBack?: () => void;
}

export default function Phase2({ onSubmit, defaultValues, onBack }: Phase2Props) {
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
    else onBack && onBack();
  };

  const renderStep = () => {
    switch (steps[step].id) {
      case "data":
        return <Phase2Data answers={answers} onChange={updateAnswers} />;
      case "call":
        return <Phase2Call answers={answers} onChange={updateAnswers} />;
      case "contract":
        return <Phase2Contract answers={answers} onChange={updateAnswers} />;
      case "ecosystem":
        return <Phase2Ecosystem answers={answers} onChange={updateAnswers} />;
      case "subscription":
        return <Phase2Subscription answers={answers} onChange={updateAnswers} />;
      case "device":
        return <Phase2Device answers={answers} onChange={updateAnswers} />;
      case "overseas":
        return <Phase2Overseas answers={answers} onChange={updateAnswers} />;
      case "payment":
        return <Phase2Payment answers={answers} onChange={updateAnswers} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <h2 className="text-3xl font-bold text-center text-white mb-4">📍 フェーズ②：詳細条件</h2>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg shadow-slate-900/40 w-[98%] mx-auto transition-all duration-300">
        <p className="text-xl font-semibold mb-4 text-white text-center">{steps[step].label}</p>
        <div className="space-y-4">{renderStep()}</div>
      </div>

      <div className="flex justify-between items-center pt-6">
        <button
          onClick={handleBack}
          className={`px-4 py-2 rounded-full ${
            step === 0 && !onBack
              ? "bg-slate-600 text-slate-300 cursor-not-allowed"
              : "bg-slate-700 hover:bg-slate-600 text-white"
          }`}
        >
          ← 戻る
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-900/40"
        >
          {step === steps.length - 1 ? "結果を見る →" : "次へ →"}
        </button>
      </div>
    </div>
  );
}
