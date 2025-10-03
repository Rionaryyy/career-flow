// components/phase2/Phase2.tsx
"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";
import FeatureHighlightsFlow from "../FeatureHighlightsFlow"; 

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
    { id: "data", label: "データ通信" },
    { id: "call", label: "通話" },
    { id: "contract", label: "契約条件・割引" },
    { id: "ecosystem", label: "経済圏・ポイント" },
    { id: "subscription", label: "サブスク" },
    { id: "device", label: "端末・購入形態" },
    { id: "overseas", label: "海外利用・特殊ニーズ" },
    { id: "payment", label: "支払い方法" },
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

  const stepProps = {
    answers,
    onChange: updateAnswers,
    onNext: handleNext,
    onBack: handleBack,
  };

  const renderStep = () => {
    switch (steps[step].id) {
      case "data":
        return <Phase2Data {...stepProps} />;
      case "call":
        return <Phase2Call {...stepProps} />;
      case "contract":
        return <Phase2Contract {...stepProps} />;
      case "ecosystem":
        return <Phase2Ecosystem {...stepProps} />;
      case "subscription":
        return <Phase2Subscription {...stepProps} />;
      case "device":
        return <Phase2Device {...stepProps} />;
      case "overseas":
        return <Phase2Overseas {...stepProps} />;
      case "payment":
        return <Phase2Payment {...stepProps} />;
      default:
        return null;
    }
  };

 
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <h2 className="text-3xl font-bold text-center text-sky-900 mb-4">
        📍 フェーズ②：詳細条件
      </h2>

      {/* 各カードラップ */}
      <div className="w-full px-0">
        {renderStep()}
      </div>

      {/* ナビボタン */}
      <div className="flex justify-between items-center pt-6 w-full">
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

      {/* 👇 ここに追加すればフェーズ②の全画面で共通表示 */}
      <FeatureHighlightsFlow />
    </div>
  );
}
