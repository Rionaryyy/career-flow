"use client";

import { useState, useEffect } from "react";
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

  // ✅ BasicConditions だけ answers を追加して渡す
  const renderSection = () => {
    if (currentId === "basic") {
      const props = {
        answers, // ← 追加！
        defaultValues: answers,
        onSubmit: (updated: DiagnosisAnswers) => {
          setAnswers((prev) => ({ ...prev, ...updated }));
          handleNext();
        },
      };
      const Basic = BasicConditions as any;
      return <Basic {...props} />;
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

       

      </div>
    </QuestionLayout>
  );
}
