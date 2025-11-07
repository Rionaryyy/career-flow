"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DiagnosisAnswers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";

// 🟦 各セクション（統合版）
import BasicConditions from "./BaseConditions";
import DataSection from "./Data";
import CallSection from "./Call";
import ContractSection from "./Contract";
import EcosystemSection from "./Ecosystem";
import SubscriptionSection from "./Subscription";
import DeviceSection from "./Device";
import OverseasSection from "./Overseas";
import PaymentSection from "./Payment";

/**
 * 統合後の診断フロー
 * - Phase1/Phase2統合版
 * - `DiagnosisAnswers` 一元管理
 * - にゃんこボタンや進捗バーを維持
 */
interface Props {
  onSubmit: (answers: DiagnosisAnswers) => void;
  defaultValues: DiagnosisAnswers;
  onBack?: () => void;
}

export default function DiagnosisFlow({ onSubmit, defaultValues, onBack }: Props) {
  const [answers, setAnswers] = useState<DiagnosisAnswers>({ ...defaultValues });
  const [step, setStep] = useState<number>(0);

  // ステップ構成（旧Phase1を最初に統合）
  const steps = [
    { id: "basic", label: "前提条件" },
    { id: "data", label: "データ通信" },
    { id: "call", label: "通話" },
    { id: "contract", label: "契約条件・割引" },
    { id: "ecosystem", label: "経済圏・ポイント" },
    { id: "subscription", label: "サブスクリプションサービス" },
    { id: "device", label: "端末・購入形態" },
    { id: "overseas", label: "海外利用" },
    { id: "payment", label: "支払い方法" },
  ];

  const updateAnswers = (updated: Partial<DiagnosisAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...updated }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log("🚀 Submitting:", answers);
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
      case "basic":
        return (
          <BasicConditions
            defaultValues={answers}
            onSubmit={(updated) => {
              setAnswers((prev) => ({ ...prev, ...updated }));
              handleNext();
            }}
          />
        );
      case "data":
        return <DataSection {...stepProps} />;
      case "call":
        return <CallSection {...stepProps} />;
      case "contract":
        return <ContractSection {...stepProps} />;
      case "ecosystem":
        return <EcosystemSection {...stepProps} />;
      case "subscription":
        return <SubscriptionSection {...stepProps} />;
      case "device":
        return <DeviceSection {...stepProps} />;
      case "overseas":
        return <OverseasSection {...stepProps} />;
      case "payment":
        return <PaymentSection {...stepProps} />;
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

      {/* 🐾 ナビゲーション部分（既存デザインを維持） */}
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
