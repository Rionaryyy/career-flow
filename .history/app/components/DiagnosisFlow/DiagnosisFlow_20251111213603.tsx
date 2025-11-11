"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { DiagnosisAnswers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";
import { FlowSectionProps } from "@/types/flowProps";

// === 🧩 デバッグ用インポート ===
import { filterPlans } from "@/utils/filters/filterPlans"; // ✅ 統合版フィルター関数を使用
import { calculatePlanCost } from "@/utils/logic/calcEffectivePrice";
import { allPlans } from "@/data/allPlans";

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
  const [lastChangedKey, setLastChangedKey] = useState<string | null>(null);

  // === 📊 前回の件数・平均料金を記録 ===
  const prevCountRef = useRef<number>(allPlans.length);
  const prevAvgRef = useRef<number | null>(null);

  // 🔹 各セクション ref
  const basicRef = useRef<SectionRef | null>(null);
  const dataRef = useRef<SectionRef | null>(null);
  const callRef = useRef<SectionRef | null>(null);
  const contractRef = useRef<SectionRef | null>(null);
  const ecosystemRef = useRef<SectionRef | null>(null);
  const subscriptionRef = useRef<SectionRef | null>(null);
  const deviceRef = useRef<SectionRef | null>(null);
  const overseasRef = useRef<SectionRef | null>(null);
  const paymentRef = useRef<SectionRef | null>(null);

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

  // === 🧩 回答更新処理（リアルタイムで件数＋料金変化を表示） ===
  const updateAnswers = (updated: Partial<DiagnosisAnswers>) => {
    const changedKey = Object.keys(updated)[0] as string;
    const changedValue = updated[changedKey as keyof DiagnosisAnswers];
    setLastChangedKey(changedKey);

    const tempAnswers = { ...answers, ...updated };

    // === 📊 統合フィルター適用 ===
    const filtered = filterPlans(allPlans, tempAnswers);

    const total = allPlans.length;
    const currentCount = filtered.length;
    const prevCount = prevCountRef.current;
    const countDiff = currentCount - prevCount;
    prevCountRef.current = currentCount;

    // === 💰 各プランの実質料金計算（平均） ===
    const costs = filtered.map((p) => calculatePlanCost(p, tempAnswers));
    const avg = costs.length
      ? costs.reduce((sum, c) => sum + (c.totalWithDevice ?? c.total ?? 0), 0) /
        costs.length
      : 0;

    const prevAvg = prevAvgRef.current ?? avg;
    const diff = avg - prevAvg;
    prevAvgRef.current = avg;

    // === 🧾 ログ出力 ===
    console.log(`🧩 [${changedKey}] 回答変更: ${changedValue}`);
    console.log(`📊 対象 ${currentCount} 件 / 全 ${total} 件`);

    // 件数変化
    if (countDiff < 0)
      console.log(`📉 ${Math.abs(countDiff)} 件減少 (${prevCount} → ${currentCount})`);
    else if (countDiff > 0)
      console.log(`📈 ${countDiff} 件増加 (${prevCount} → ${currentCount})`);
    else console.log(`➖ 件数変化なし (${currentCount} 件)`);

    // 料金変化
    if (diff < 0)
      console.log(`💸 実質料金 ↓ ${Math.abs(diff).toFixed(0)}円 (${avg.toFixed(0)}円/月)`);
    else if (diff > 0)
      console.log(`💰 実質料金 ↑ +${diff.toFixed(0)}円 (${avg.toFixed(0)}円/月)`);
    else console.log(`💤 実質料金 変化なし (${avg.toFixed(0)}円/月)`);

    console.log(""); // 改行
    setAnswers(tempAnswers);
  };

  // === 🐾 次へボタン処理 ===
  const handleNext = () => {
    const currentId = questions[step].id;
    const ref = refs[currentId as keyof typeof refs];

    if (ref?.current && !ref.current.isCompleted()) {
      ref.current.goNext();
      const index = ref.current.getCurrentIndex?.() ?? 0;
      setSectionProgress((prev) => ({ ...prev, [currentId]: index }));
      return;
    }

    if (step < questions.length - 1) {
      const idx = ref?.current?.getCurrentIndex?.() ?? 0;
      setSectionProgress((prev) => ({ ...prev, [currentId]: idx }));
      setStep((prev) => prev + 1);
    } else {
      onSubmit({ ...answers });
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // === 🐾 戻る処理 ===
  const handleBack = () => {
    const currentId = questions[step].id;
    const currentRef = refs[currentId as keyof typeof refs];
    const currentIndex = currentRef?.current?.getCurrentIndex?.() ?? 0;

    if (currentIndex > 0 && currentRef?.current?.setCurrentIndex) {
      currentRef.current.setCurrentIndex(currentIndex - 1);
      setSectionProgress((prev) => ({
        ...prev,
        [currentId]: currentIndex - 1,
      }));
      return;
    }

    if (step > 0) {
      const prevStep = step - 1;
      const prevId = questions[prevStep].id;
      setSectionProgress((prev) => ({
        ...prev,
        [currentId]: currentIndex,
      }));
      setStep(prevStep);

      setTimeout(() => {
        const prevRef = refs[prevId as keyof typeof refs];
        const savedIndex = sectionProgress[prevId] ?? 0;
        if (prevRef?.current?.setCurrentIndex) {
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
              style={{ width: "auto", height: "auto" }}
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
              style={{ width: "auto", height: "auto" }}
              className="drop-shadow-md"
            />
          </button>
        </div>
      </div>
    </QuestionLayout>
  );
}
