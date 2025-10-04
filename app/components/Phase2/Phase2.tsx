"use client";

import { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";

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
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onBack && onBack();
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const stepProps = { answers, onChange: updateAnswers, onNext: handleNext, onBack: handleBack };

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  return (
    <QuestionLayout answeredCount={step + 1} totalCount={steps.length}>
      <h2 className="text-2xl sm:text-3xl font-bold text-sky-900 text-center mb-6">
        {steps[step].label}
      </h2>

      <div className="w-full max-w-3xl mx-auto px-2 sm:px-0">{renderStep()}</div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 w-full max-w-3xl mx-auto gap-4">
        <button
          onClick={handleBack}
          className={`px-4 py-2 rounded-full w-full sm:w-auto ${
            step === 0 && !onBack
              ? "bg-sky-100 text-sky-300 cursor-not-allowed"
              : "bg-sky-200 hover:bg-sky-300 text-sky-900 shadow-sm"
          } transition-all duration-200`}
          disabled={step === 0 && !onBack}
        >
          ← 戻る
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-full w-full sm:w-auto bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-lg font-semibold text-white shadow-md transition-all duration-200"
        >
          {step === steps.length - 1 ? "結果を見る →" : "次へ →"}
        </button>
      </div>
    </QuestionLayout>
  );
}
