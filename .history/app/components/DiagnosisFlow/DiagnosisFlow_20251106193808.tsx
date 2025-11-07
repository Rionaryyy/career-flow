"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phase2Answers, Phase1Answers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";

// 🟦 各セクション
import Phase1 from "./Phase1";
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
  phase1Answers: Phase1Answers;
}

export default function Phase2({
  onSubmit,
  defaultValues,
  onBack,
  phase1Answers,
}: Phase2Props) {
  const [answers, setAnswers] = useState<Phase2Answers>({ ...defaultValues });
  const [phase1, setPhase1] = useState<Phase1Answers>({ ...phase1Answers }); // ← 🔹追加
  const [step, setStep] = useState<number>(0);

  // 🔹フェーズ①を最初のステップとして追加
  const steps = [
    { id: "phase1", label: "前提条件" },
    { id: "data", label: "データ通信" },
    { id: "call", label: "通話" },
    { id: "contract", label: "契約条件・割引" },
    { id: "ecosystem", label: "経済圏・ポイント" },
    { id: "subscription", label: "サブスクリプションサービス" },
    { id: "device", label: "端末・購入形態" },
    { id: "overseas", label: "海外利用" },
    { id: "payment", label: "支払い方法" },
  ];

  const updateAnswers = (updated: Partial<Phase2Answers>) => {
    setAnswers((prev) => ({ ...prev, ...updated }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log("🚀 Submitting Phase2:", answers);
      onSubmit({ ...answers });
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
      // 🔹フェーズ①を統合
      case "phase1":
        return (
          <Phase1
            defaultValues={phase1}
            onSubmit={(updatedPhase1) => {
              setPhase1(updatedPhase1);
              handleNext(); // ← 終了後に次へ進む
            }}
          />
        );
      case "data":
        return <Phase2Data {...stepProps} />;
      case "call":
        return <Phase2Call {...stepProps} />;
      case "contract":
        return <Phase2Contract {...stepProps} />;
      case "ecosystem":
        return <Phase2Ecosystem {...stepProps} phase1Answers={phase1} />;
      case "subscription":
        return <Phase2Subscription {...stepProps} phase1Answers={phase1} />;
      case "device":
        return <Phase2Device {...stepProps} />;
      case "overseas":
        return <Phase2Overseas {...stepProps} />;
      case "payment":
        return <Phase2Payment {...stepProps} phase1Answers={phase1} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const isBackDisabled = step === 0 && !onBack;

  return (
    <QuestionLayout answeredCount={step + 2} totalCount={steps.length + 1}>
      <h2 className="text-3xl font-bold text-sky-900 text-center mb-6">
        {steps[step].label}
      </h2>

      <div className="w-full px-0">{renderStep()}</div>

      {/* 🐾 ナビゲーション部分は既存そのまま */}
      <div className="flex justify-between items-center pt-6 w-full max-w-4xl">
        <button
          onClick={handleBack}
          disabled={isBackDisabled}
          aria-label="戻る"
          className="relative inline-flex items-center justify-center"
        >
          <Image
            src="/images/calico-paw-back.png"
            alt="戻る"
            width={60}
            height={60}
            className={isBackDisabled ? "opacity-40 cursor-not-allowed" : "drop-shadow-md"}
          />
        </button>

        <button
          onClick={handleNext}
          aria-label={step === steps.length - 1 ? "結果を見る" : "次へ"}
          className="relative inline-flex items-center justify-center"
        >
          <Image
            src="/images/calico-paw-next.png"
            alt={step === steps.length - 1 ? "結果を見る" : "次へ"}
            width={60}
            height={60}
            className="drop-shadow-md"
          />
        </button>
      </div>
    </QuestionLayout>
  );
}
