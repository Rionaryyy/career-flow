"use client";

import { useState } from "react";
import Phase1, { Phase1Props } from "./Phase1";
import Phase2 from "./Phase2";
import Result from "./Result";
import { Phase1Answers, Phase2Answers, DiagnosisAnswers } from "@/types/types";

export default function DiagnosisFlow() {
  // 初期ステップを "phase1" に変更
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
  };

  const handlePhase2Submit = (phase2Answers: Phase2Answers) => {
    setAnswers((prev) => ({ ...prev, phase2: phase2Answers }));
    setStep("result");
  };

  return (
    <div className="w-full min-h-screen py-10 px-2 space-y-8">
      {step === "phase1" && (
        <Phase1
          defaultValues={answers.phase1}
          onSubmit={handlePhase1Submit}
        />
      )}

      {step === "phase2" && (
        <Phase2
          onSubmit={handlePhase2Submit}
          defaultValues={answers.phase2}
        />
      )}

      {step === "result" && (
        <Result
          answers={answers}
          onRestart={() => setStep("phase1")}
        />
      )}
    </div>
  );
}
