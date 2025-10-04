"use client";

import { useState } from "react";
import Header from "./layouts/Header"; // ヘッダー
import Phase1 from "./Phase1/Phase1";
import Phase2 from "./Phase2/Phase2";
import Result from "./Result";
import FeatureHighlightsFlow from "./FeatureHighlightsFlow";
import HeroMini from "./HeroMini"; // ← 新規追加
import { Phase1Answers, Phase2Answers, DiagnosisAnswers } from "@/types/types";

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"phase1" | "phase2" | "result">("phase1");

  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    phase1: {
      includePoints: null,
      networkQuality: null,
      carrierType: null,
      supportPreference: null,
      contractLockPreference: null,
    },
    phase2: {
      dataUsage: null,
      speedLimitImportance: null,
      tetheringNeeded: null,
      tetheringUsage: null,
      callFrequency: null,
      callPriority: null,
      callOptionsNeeded: null,
      callPurpose: null,
      familyLines: null,
      setDiscount: null,
      infraSet: null,
      ecosystem: null,
      ecosystemMonthly: null,
      usingEcosystem: null,
      monthlyUsage: null,
      subs: [],
      subsDiscountPreference: null,
      usingServices: [],
      monthlySubscriptionCost: null,
      subscriptions: [],
      subscriptionServices: [],
      subscriptionMonthly: null,
      buyingDevice: null,
      devicePurchaseMethods: [],
      devicePreference: null,
      oldDevicePlan: null,
      overseasUse: null,
      overseasPreference: null,
      dualSim: null,
      specialUses: [],
      paymentMethods: [],
      mainCard: null,
      paymentTiming: null,
    },
  });

  const handlePhase1Submit = (phase1Answers: Phase1Answers) => {
    setAnswers((prev) => ({ ...prev, phase1: phase1Answers }));
    setStep("phase2");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handlePhase2Submit = (phase2Answers: Phase2Answers) => {
    setAnswers((prev) => ({ ...prev, phase2: phase2Answers }));
    setStep("result");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="min-h-screen bg-white text-black">

      {/* ヘッダー常時表示 */}
      <Header />

      {/* ヘッダーの高さ分だけパディング */}
      <div className="pt-16 space-y-8">

  {/* HeroMini を追加 */}
  <HeroMini />

  {step === "phase1" && (
  <div className="w-full space-y-8">
    <Phase1 defaultValues={answers.phase1} onSubmit={handlePhase1Submit} />
  </div>
)}

{step === "phase2" && (
  <div className="w-full">
    <Phase2
      defaultValues={answers.phase2}
      onSubmit={handlePhase2Submit}
      onBack={() => {
        setStep("phase1");
        window.scrollTo({ top: 0, behavior: "auto" });
      }}
    />
  </div>
)}

{step === "result" && (
  <div className="w-full space-y-8">
    <Result
      answers={answers}
      onRestart={() => {
        setStep("phase1");
        window.scrollTo({ top: 0, behavior: "auto" });
      }}
    />
  </div>
)}
  {/* 下部セクション（全ステップ共通で表示） */}
  <div className="w-full">
    <FeatureHighlightsFlow />
  </div>


      </div>
    </div>
  );
}
