"use client";

import { useState, useEffect } from "react";
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
      window.scrollTo({ top: 0, behavior: "auto" }); // フェーズ②→結果でもスクロール
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      onBack && onBack();
      window.scrollTo({ top: 0, behavior: "auto" }); // フェーズ②→フェーズ①でもスクロール
    }
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

  // 👇 stepが変わるたびにスクロールトップ
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <h2 className="text-3xl font-bold text-center text-sky-900 mb-4">
        📍 フェーズ②：詳細条件
      </h2>

      {/* 各カードラップ */}
      <div className="w-full px-0">
        {renderStep()}
      </div>

      

      {/* フェーズ②全体で共通表示 */}
      <FeatureHighlightsFlow />
    </div>
  );
}
