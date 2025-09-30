"use client";

import { useState } from "react";
import Phase1, { Phase1Props } from "./Phase1";
import Phase2 from "./Phase2";
import Result from "./Result";
import { Phase1Answers, Phase2Answers, DiagnosisAnswers } from "@/types/types";

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"start" | "phase1" | "phase2" | "result">("start");

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
    // 親背景はページ全体に任せ、ここは透明
    <div className="w-full min-h-screen py-10 px-2 space-y-8">
      {step === "start" && (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-white">📱 キャリア診断スタート</h1>
          <p className="text-slate-300">
            いくつかの質問に答えるだけで、あなたに最適な通信キャリアとプランを診断します。
          </p>
          <button
            onClick={() => setStep("phase1")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-2xl shadow-lg transition-all"
          >
            診断を始める
          </button>
        </div>
      )}

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
          onRestart={() => setStep("start")}
        />
      )}
    </div>
  );
}
