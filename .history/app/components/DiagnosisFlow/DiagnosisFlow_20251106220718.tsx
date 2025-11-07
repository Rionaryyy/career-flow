"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { DiagnosisAnswers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";
import { FlowSectionProps } from "@/types/flowProps";

// 各セクション
import BasicConditions from "./BaseConditions";
import DataSection from "./Data";
import CallSection from "./Call";
import ContractSection from "./Contract";
import EcosystemSection from "./Ecosystem";
import SubscriptionSection from "./Subscription";
import DeviceSection from "./Device";
import OverseasSection from "./Overseas";
import PaymentSection from "./Payment";

interface Props {
  onSubmit: (answers: DiagnosisAnswers) => void;
  defaultValues: DiagnosisAnswers;
  onBack?: () => void;
}

export default function DiagnosisFlow({ onSubmit, defaultValues, onBack }: Props) {
  const [answers, setAnswers] = useState<DiagnosisAnswers>({ ...defaultValues });
  const [step, setStep] = useState<number>(0);

  // 🔹 BasicConditions用ref（カード制御）
  const basicRef = useRef<{ goNext: () => void; isCompleted: () => boolean } | null>(null);

  const questions = [
    { id: "basic", label: "前提条件" },
    { id: "data", label: "データ通信" },
    { id: "call", label: "通話" },
    { id: "contract", label: "契約条件・割引" },
    { id: "ecosystem", label: "経済圏・ポイント" },
    { id: "subscription", label: "サブスクリプション" },
    { id: "device", label: "端末・購入形態" },
    { id: "overseas", label: "海外利用" },
    { id: "payment", label: "支払い方法" },
  ];

  const updateAnswers = (updated: Partial<DiagnosisAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...updated }));
  };

  const handleNext = () => {
    // 🔸 BasicConditions内のカード制御
    if (questions[step].id === "basic" && basicRef.current) {
      if (!basicRef.current.isCompleted()) {
        basicRef.current.goNext();
        return;
      }
    }

    // 🔹 通常パート遷移
    if (step < questions.length - 1) setStep(step + 1);
    else onSubmit({ ...answers });

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else if (onBack) onBack();
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const currentId = questions[step].id;
  const isBackDisabled = step === 0 && !onBack;

  const commonProps: FlowSectionProps = {
    answers,
    onChange: updateAnswers,
    onNext: handleNext,
    onBack: handleBack,
  };

  // ✅ BasicConditions だけ ref を追加して渡す
  const renderSection = () => {
    if (currentId === "basic") {
      return (
        <BasicConditions
          ref={basicRef}
          answers={answers}
          onChange={updateAnswers}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }

    switch (currentId) {
      case "data":
        return <DataSection key="data" {...commonProps} />;
      case "call":
        return <CallSection key="call" {...commonProps} />;
      case "contract":
        return <ContractSection key="contract" {...commonProps} />;
      case "ecosystem":
        return <EcosystemSection key="eco" {...commonProps} />;
      case "subscription":
        return <SubscriptionSection key="sub" {...commonProps} />;
      case "device":
        return <DeviceSection key="device" {...commonProps} />;
      case "overseas":
        return <OverseasSection key="overseas" {...commonProps} />;
      case "payment":
        return <PaymentSection key="payment" {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <QuestionLayout answeredCount={step + 1} totalCount={questions.length}>
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-3xl font-bold text-sky-900 text-center mb-6">
          {questions[step].label}
        </h2>

        <div className="w-full px-0">{renderSection()}</div>

        {/* 🐾 にゃんこナビゲーション（上下のうち上だけ残す） */}
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
              className={
                isBackDisabled
                  ? "opacity-40 cursor-not-allowed"
                  : "drop-shadow-md"
              }
            />
          </button>

          <button
            onClick={handleNext}
            aria-label={step === questions.length - 1 ? "結果を見る" : "次へ"}
            className="relative inline-flex items-center justify-center"
          >
            <Image
              src="/images/calico-paw-next.png"
              alt={step === questions.length - 1 ? "結果を見る" : "次へ"}
              width={60}
              height={60}
              className="drop-shadow-md"
            />
          </button>
        </div>
      </div>
    </QuestionLayout>
  );
}
