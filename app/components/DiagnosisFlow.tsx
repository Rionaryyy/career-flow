"use client";

import { useState } from "react";
import Phase1 from "./Phase1";
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

  subs: null,
  subsDiscountPreference: null,

  buyingDevice: null,
  devicePurchaseMethods: null,

  overseasUse: null,
  overseasPreference: null,
  dualSim: null,
  specialUses: null,

  paymentMethods: null,

  // ✅ 必須プロパティをすべて初期化
  usingEcosystem: null,
  monthlyUsage: null,
  usingServices: null,
  monthlySubscriptionCost: null,

  // 🩹 これを追加！
  subscriptions: null,
},

  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      {step === "start" && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">キャリア診断スタート</h1>
          <button
            onClick={() => setStep("phase1")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            診断を開始する
          </button>
        </div>
      )}

     {step === "phase1" && (
  <Phase1
    answers={answers.phase1}
    setAnswers={(newAnswers: Phase1Answers) =>
      setAnswers((prev) => ({
        ...prev,
        phase1: newAnswers,
      }))
    }
    onNext={() => setStep("phase2")}
    onBack={() => setStep("start")}
  />
)}


      {step === "phase2" && (
        <Phase2
          answers={answers.phase2}
          setAnswers={(partial) =>
            setAnswers((prev) => ({
              ...prev,
              phase2: { ...prev.phase2, ...partial },
            }))
          }
          onNext={() => setStep("result")}
          onBack={() => setStep("phase1")}
        />
      )}

      {step === "result" && <Result answers={answers} />}
    </div>
  );
}
