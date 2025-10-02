// components/phase2/Phase2.tsx
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
    const commonProps = { answers, onChange: updateAnswers, onNext: handleNext, onBack: handleBack };
    switch (steps[step].id) {
      case "data":
        return <Phase2Data {...commonProps} />;
      case "call":
        return <Phase2Call {...commonProps} />;
      case "contract":
        return <Phase2Contract {...commonProps} />;
      case "ecosystem":
        return <Phase2Ecosystem {...commonProps} />;
      case "subscription":
        return <Phase2Subscription {...commonProps} />;
      case "device":
        return <Phase2Device {...commonProps} />;
      case "overseas":
        return <Phase2Overseas {...commonProps} />;
      case "payment":
        return <Phase2Payment {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-0">
      <h2 className="text-3xl font-bold text-center text-sky-900 mb-4">📍 フェーズ②：詳細条件</h2>

      {/* カード全体をフェーズ①と同じ幅・影・角丸仕様でラップ */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="rounded-2xl shadow-lg bg-gradient-to-br from-pink-50 to-blue-50 p-6">
          {renderStep()}
        </div>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-between items-center pt-6 px-6 max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className={`px-4 py-2 rounded-full ${
            step === 0 && !onBack
              ? "bg-sky-100 text-sky-300 cursor-not-allowed"
              : "bg-sky-200 hover:bg-sky-300 text-sky-900 shadow-sm"
          } transition-all duration-200`}
        >
          ← 戻る
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-lg font-semibold text-white shadow-md transition-all duration-200"
        >
          {step === steps.length - 1 ? "結果を見る →" : "次へ →"}
        </button>
      </div>
    </div>
  );
}
