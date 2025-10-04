"use client";

import { useState } from "react";
import Header from "./layouts/Header";
import Phase1 from "./Phase1/Phase1";
import Phase2 from "./Phase2/Phase2";
import Result from "./Result";
import FeatureHighlightsFlow from "./FeatureHighlightsFlow";
import HeroMini from "./HeroMini";
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
    <div className="min-h-screen bg-white text-black w-full">

      {/* ヘッダー常時表示 */}
      <Header />

      {/* メインコンテンツ */}
      <main className="w-full pt-16 space-y-8">

        {/* HeroMini */}
        <HeroMini />

        {/* フェーズ1 */}
        {step === "phase1" && <Phase1 defaultValues={answers.phase1} onSubmit={handlePhase1Submit} />}

        {/* フェーズ2 */}
        {step === "phase2" && (
          <Phase2
            defaultValues={answers.phase2}
            onSubmit={handlePhase2Submit}
            onBack={() => setStep("phase1")}
          />
        )}

        {/* 結果画面 */}
        {step === "result" && <Result answers={answers} onRestart={() => setStep("phase1")} />}

        {/* 下部セクション */}
        <FeatureHighlightsFlow />

      </main>
    </div>
  );
}
