"use client";

import { useState, useEffect } from "react";
import { Phase2Answers, Phase1Answers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";

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
  phase1Answers: Phase1Answers; // ← 追加
}

export default function Phase2({ onSubmit, defaultValues, onBack, phase1Answers }: Phase2Props) {
  const [answers, setAnswers] = useState<Phase2Answers>(defaultValues);
  const [step, setStep] = useState<number>(0);

  const steps = [
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
         return <Phase2Ecosystem {...stepProps} phase1Answers={phase1Answers} />; // ✅ 修正！return <Phase2Ecosystem {...stepProps} />;
      case "subscription":
        return <Phase2Subscription {...stepProps} />;
      case "device":
        return <Phase2Device {...stepProps} />;
      case "overseas":
        return <Phase2Overseas {...stepProps} />;
      case "payment":
        return (
          <Phase2Payment
            {...stepProps}
            phase1Answers={phase1Answers} // ← Propsから渡す
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  return (
    <QuestionLayout answeredCount={step + 2} totalCount={9}>
      {/* 各ステップタイトル */}
      <h2 className="text-3xl font-bold text-sky-900 text-center mb-6">
        {steps[step].label}
      </h2>

      {/* 各ステップコンテンツ */}
      <div className="w-full px-0">{renderStep()}</div>

      {/* 下部ナビボタン */}
      <div className="flex justify-between items-center pt-6 w-full max-w-4xl">
 {/* 戻るボタン（淡め & 文字は白） */}
<button
  onClick={handleBack}
  className={`px-4 py-2 rounded-full text-lg font-semibold shadow-md transition-all duration-200
    ${
      step === 0 && !onBack
        ? "bg-sky-100 text-sky-300 cursor-not-allowed shadow-none"
        : "bg-gradient-to-r from-sky-200 to-sky-300 hover:from-sky-100 hover:to-sky-200 text-white"
    }
  `}
>
  ← 戻る
</button>


  {/* 次へボタン（少し濃いめ） */}
  <button
    onClick={handleNext}
    className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-lg font-semibold text-white shadow-md transition-all duration-200"
  >
    {step === steps.length - 1 ? "結果を見る →" : "次へ →"}
  </button>
</div>

    </QuestionLayout>
  );
}
