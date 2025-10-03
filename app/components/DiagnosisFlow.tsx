"use client";

import { useState } from "react";
import Phase1 from "./Phase1/Phase1";
import Phase2 from "./Phase2/Phase2";
import Result from "./Result";
import FeatureHighlightsFlow from "./FeatureHighlightsFlow";
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

  // フェーズ①完了 → フェーズ②に進む
  const handlePhase1Submit = (phase1Answers: Phase1Answers) => {
    setAnswers((prev) => ({ ...prev, phase1: phase1Answers }));
    setStep("phase2");
    window.scrollTo({ top: 0, behavior: "auto" }); // スクロールリセット
  };

  // フェーズ②完了 → 結果画面に進む
  const handlePhase2Submit = (phase2Answers: Phase2Answers) => {
    setAnswers((prev) => ({ ...prev, phase2: phase2Answers }));
    setStep("result");
    window.scrollTo({ top: 0, behavior: "auto" }); // スクロールリセット
  };

  return (
    <div className="min-h-screen bg-white text-black py-12 space-y-8">

      {/* フェーズ1 */}
      {step === "phase1" && (
        <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
          <Phase1
            defaultValues={answers.phase1}
            onSubmit={handlePhase1Submit}
          />
        </div>
      )}

      {/* フェーズ2：画面端まで広げる */}
      {step === "phase2" && (
        <div className="w-full">
          <Phase2
            onSubmit={handlePhase2Submit}
            defaultValues={answers.phase2}
            onBack={() => {
              setStep("phase1"); // フェーズ①に戻る
              window.scrollTo({ top: 0, behavior: "auto" }); // スクロールリセット
            }}
          />
        </div>
      )}

      {/* 結果画面 */}
      {step === "result" && (
        <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
          <Result
            answers={answers}
            onRestart={() => {
              setStep("phase1");
              window.scrollTo({ top: 0, behavior: "auto" });
            }}
          />
        </div>
      )}

      {/* 下部セクション（フェーズ②以外で表示） */}
      {step !== "phase2" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeatureHighlightsFlow />
        </div>
      )}
    </div>
  );
}
