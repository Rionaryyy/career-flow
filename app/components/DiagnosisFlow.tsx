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
      // ① データ通信ニーズ
      dataUsage: null,
      speedLimitImportance: null,
      tetheringNeeded: null,
      tetheringUsage: null,

      // ② 通話
      callFrequency: null,
      callPriority: null,
      callOptionsNeeded: null,
      callPurpose: null,

      // ③ 契約条件・割引
      familyLines: null,
      setDiscount: null,
      infraSet: null,

      // ④ 経済圏・ポイント
      ecosystem: null,
      ecosystemMonthly: null,
      usingEcosystem: null,
      monthlyUsage: null,

      // ⑤ サブスク
      subs: null,
      subsDiscountPreference: null,
      usingServices: null,
      monthlySubscriptionCost: null,
      subscriptions: null,

      // ⑥ 端末・購入形態
      buyingDevice: null,
      devicePurchaseMethods: null,

      // ⑦ 海外利用・特殊ニーズ
      overseasUse: null,
      overseasPreference: null,
      dualSim: null,
      specialUses: null,

      // ⑧ 支払い方法
      paymentMethods: null,
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
    <div className="max-w-3xl mx-auto px-4 py-10">
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
