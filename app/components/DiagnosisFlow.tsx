"use client";

import { useState, useEffect } from "react";
import Header from "./layouts/Header";
import Phase1 from "./Phase1/Phase1";
import Phase2 from "./Phase2/Phase2";
import Result from "./Result";
import FeatureHighlightsFlow from "./FeatureHighlightsFlow";
import HeroMini from "./HeroMini";
import { Phase1Answers, Phase2Answers, DiagnosisAnswers } from "@/types/types";

const INITIAL_ANSWERS: DiagnosisAnswers = {
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
};

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"phase1" | "phase2" | "result">("phase1");
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS);

  // 初回マウント時に保存済みデータを読み込む
  useEffect(() => {
    const saved = localStorage.getItem("diagnosisAnswers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        console.log("💾 保存された回答を復元しました");
      } catch (e) {
        console.error("保存データの読み込みに失敗しました", e);
      }
    }
  }, []);

  // 回答が更新されるたびにローカルストレージへ保存
  useEffect(() => {
    localStorage.setItem("diagnosisAnswers", JSON.stringify(answers));
  }, [answers]);

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

  const resetAnswers = () => {
    localStorage.removeItem("diagnosisAnswers");
    setAnswers(INITIAL_ANSWERS);
    setStep("phase1");
  };

  return (
    <div className="min-h-screen bg-white text-black w-full">
      <Header />

      <main className="w-full pt-16 sm:pt-20 space-y-8 px-4 sm:px-6 lg:px-8">
        <HeroMini />

        {step === "phase1" && (
          <Phase1 defaultValues={answers.phase1} onSubmit={handlePhase1Submit} />
        )}

        {step === "phase2" && (
          <Phase2
            defaultValues={answers.phase2}
            onSubmit={handlePhase2Submit}
            onBack={() => setStep("phase1")}
          />
        )}

        {step === "result" && (
          <Result
            answers={answers}
            onRestart={resetAnswers}
          />
        )}

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
