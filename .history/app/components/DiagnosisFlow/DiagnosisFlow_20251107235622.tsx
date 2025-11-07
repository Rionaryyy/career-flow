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

interface SectionRef {
  goNext: () => void;
  isCompleted: () => boolean;
  getCurrentIndex?: () => number;
  setCurrentIndex?: (i: number) => void;
}

export default function DiagnosisFlow({ onSubmit, defaultValues, onBack }: Props) {
  const [answers, setAnswers] = useState<DiagnosisAnswers>({ ...defaultValues });
  const [step, setStep] = useState<number>(0);

  // 🔹 各セクション用 ref（にゃんこボタン対応＋進捗管理）
  const basicRef = useRef<SectionRef | null>(null);
  const dataRef = useRef<SectionRef | null>(null);
  const callRef = useRef<SectionRef | null>(null);
  const contractRef = useRef<SectionRef | null>(null);
  const ecosystemRef = useRef<SectionRef | null>(null);
  const subscriptionRef = useRef<SectionRef | null>(null);
  const deviceRef = useRef<SectionRef | null>(null);
  const overseasRef = useRef<SectionRef | null>(null);
  const paymentRef = useRef<SectionRef | null>(null);

  // 🔹 各セクションの進捗（内部カード位置など）を保持
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

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

  const refs = {
    basic: basicRef,
    data: dataRef,
    call: callRef,
    contract: contractRef,
    ecosystem: ecosystemRef,
    subscription: subscriptionRef,
    device: deviceRef,
    overseas: overseasRef,
    payment: paymentRef,
  } as const;

  const updateAnswers = (updated: Partial<DiagnosisAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...updated }));
  };

  const handleNext = () => {
    const currentId = questions[step].id;
    const ref = refs[currentId as keyof typeof refs];

    // 🔸 カードがまだ残っていれば次のカードへ
    if (ref?.current && !ref.current.isCompleted()) {
      ref.current.goNext();
      // 進捗記録
      const index = ref.current.getCurrentIndex?.() ?? 0;
      setSectionProgress((prev) => ({ ...prev, [currentId]: index }));
      return;
    }

    // 🔹 パートを進める
    if (step < questions.length - 1) {
      // 現在位置も保存
      const idx = ref?.current?.getCurrentIndex?.() ?? 0;
      setSectionProgress((prev) => ({ ...prev, [currentId]: idx }));
      setStep((prev) => prev + 1);
    } else {
      onSubmit({ ...answers });
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleBack = () => {
    if (step > 0) {
      const currentId = questions[step].id;
      const prevStep = step - 1;
      const prevId = questions[prevStep].id;

      // 現在の進捗を保存
      const currentRef = refs[currentId as keyof typeof refs];
      if (currentRef?.current?.getCurrentIndex) {
        setSectionProgress((prev) => ({
          ...prev,
          [currentId]: currentRef.current?.getCurrentIndex?.() ?? 0,
        }));
      }

      // 前のセクションへ戻る
      setStep(prevStep);

      // 前回の進捗を復元
      setTimeout(() => {
        const prevRef = refs[prevId as keyof typeof refs];
        const savedIndex = sectionProgress[prevId];
        if (prevRef?.current?.setCurrentIndex && savedIndex !== undefined) {
          prevRef.current.setCurrentIndex(savedIndex);
        }
      }, 0);
    } else if (onBack) {
      onBack();
    }

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
        return <EcosystemSection ref={ecosystemRef} {...commonProps} />;
      case "subscription":
        return <SubscriptionSection ref={subscriptionRef} {...commonProps} />;
      case "device":
        return <DeviceSection ref={deviceRef} {...commonProps} />;
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

        {/* 🐾 にゃんこナビゲーション */}
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
