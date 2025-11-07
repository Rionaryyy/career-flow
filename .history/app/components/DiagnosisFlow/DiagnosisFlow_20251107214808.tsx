// app/components/DiagnosisFlow/DiagnosisFlow.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { DiagnosisAnswers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";
import { FlowSectionProps } from "@/types/flowProps";

// 各セクション（uiフォルダ配下）
import BasicConditions from "./ui/BaseConditions";
import DataSection from "./ui/DataSection";
import CallSection from "./ui/CallSection";
import ContractSection from "./ui/ContractSection";
import EcosystemSection from "./ui/EcosystemSection";
import SubscriptionSection from "./ui/SubscriptionSection";
import DeviceSection from "./ui/DeviceSection";
import OverseasSection from "./ui/OverseasSection";
import PaymentSection from "./ui/PaymentSection";

interface Props {
  onSubmit: (answers: DiagnosisAnswers) => void;
  defaultValues: DiagnosisAnswers;
  onBack?: () => void;
}

export default function DiagnosisFlow({ onSubmit, defaultValues, onBack }: Props) {
  const [answers, setAnswers] = useState<DiagnosisAnswers>({ ...defaultValues });
  const [step, setStep] = useState<number>(0);

  // 🔹 各セクション用 ref（にゃんこボタン対応）
  const basicRef = useRef<{ goNext: () => void; isCompleted: () => boolean } | null>(null);
  const dataRef = useRef<{ goNext: () => void; isCompleted: () => boolean } | null>(null);
  const callRef = useRef<{ goNext: () => void; isCompleted: () => boolean } | null>(null);
  const contractRef = useRef<{ goNext: () => void; isCompleted: () => boolean } | null>(null);
  const subscriptionRef = useRef<{ goNext: () => void; isCompleted: () => boolean } | null>(null);
  const overseasRef = useRef<{ goNext: () => void; isCompleted: () => boolean } | null>(null);
  const paymentRef = useRef<{ goNext: () => void; isCompleted: () => boolean } | null>(null);

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
    const currentId = questions[step].id;

    // 🐾 各 ref 制御（カード内で未完ならカード内を進める）
    const refs = {
      basic: basicRef,
      data: dataRef,
      call: callRef,
      contract: contractRef,
      subscription: subscriptionRef,
      overseas: overseasRef,
      payment: paymentRef,
    } as const;

    const ref = refs[currentId as keyof typeof refs];
    if (ref?.current && !ref.current.isCompleted()) {
      ref.current.goNext();
      return;
    }

    // 🔹 通常パート遷移
    if (step < questions.length - 1) setStep((prev) => prev + 1);
    else onSubmit({ ...answers });

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
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

  // ✅ 各セクションを条件分岐して描画
  const renderSection = () => {
    switch (currentId) {
      case "basic":
        return <BasicConditions ref={basicRef} {...commonProps} />;
      case "data":
        return <DataSection ref={dataRef} {...commonProps} />;
      case "call":
        return <CallSection ref={callRef} {...commonProps} />;
      case "contract":
        return <ContractSection ref={contractRef} {...commonProps} />;
      case "ecosystem":
        return <EcosystemSection {...commonProps} />;
      case "subscription":
        return <SubscriptionSection ref={subscriptionRef} {...commonProps} />;
      case "device":
        return <DeviceSection {...commonProps} />;
      case "overseas":
        return <OverseasSection ref={overseasRef} {...commonProps} />;
      case "payment":
        return <PaymentSection ref={paymentRef} {...commonProps} />;
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

        {/* 🐾 にゃんこナビゲーション（上のみ残す） */}
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
                isBackDisabled ? "opacity-40 cursor-not-allowed" : "drop-shadow-md"
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
