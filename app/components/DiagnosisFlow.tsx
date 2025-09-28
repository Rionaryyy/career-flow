// test change
// force update 2025-09-28

"use client";

import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Result from "./Result";
import type { DiagnosisAnswers, Phase1Answers, Phase2Answers } from "@/types/types";

type Step =
  | "start"
  | "phase1"
  | "phase2-data"
  | "phase2-call"
  | "phase2-contract"
  | "phase2-ecosystem"
  | "phase2-subscription"
  | "phase2-device"
  | "phase2-overseas"
  | "phase2-payment"
  | "result";

export default function DiagnosisFlow() {
  const [step, setStep] = useState<Step>("start");

  const initialPhase1: Phase1Answers = {
    includePoints: null,
    networkQuality: null,
    carrierType: null,
    supportPreference: null,
    contractLockPreference: null,
  };

  const initialPhase2: Phase2Answers = {
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
    subs: null,
    subsDiscountPreference: null,
    usingServices: null,
    monthlySubscriptionCost: null,
    subscriptions: null,
    buyingDevice: null,
    devicePurchaseMethods: null,
    overseasUse: null,
    overseasPreference: null,
    dualSim: null,
    specialUses: null,
    paymentMethods: null,
  };

  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    phase1: initialPhase1,
    phase2: initialPhase2,
  });

  // ✅ Phase2用アップデート関数（Partial対応）
  const updatePhase2Answers = (partial: Partial<Phase2Answers>) => {
    setAnswers((prev) => ({
      ...prev,
      phase2: { ...prev.phase2, ...partial },
    }));
  };

  return (
    <div className="min-h-screen p-4">
      {step === "start" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6">キャリア診断をはじめよう</h1>
          <button
            onClick={() => setStep("phase1")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transition"
          >
            診断を開始する!
          </button>
        </div>
      )}

      {step === "phase1" && (
        <Phase1
          answers={answers.phase1}
          setAnswers={(newAnswers) =>
            setAnswers((prev) => ({ ...prev, phase1: newAnswers }))
          }
          onNext={() => setStep("phase2-data")}
        />
      )}

      {step.startsWith("phase2") && (
        <Phase2
          answers={answers.phase2}
          setAnswers={updatePhase2Answers}
          onNext={() => setStep("result")}
          onBack={() => setStep("phase1")}
        />
      )}

      {step === "result" && <Result answers={answers} />}
    </div>
  );
}
