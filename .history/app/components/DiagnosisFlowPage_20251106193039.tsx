"use client";

import { useState, useEffect } from "react";
import Header from "./layouts/Header";
import Phase2 from "./Phase2/Phase2"; // ← Phase1は削除してOK
import Result from "./Result";
import FeatureHighlightsFlow from "./FeatureHighlightsFlow";
import HeroMini from "./HeroMini";
import { Phase1Answers, Phase2Answers, DiagnosisAnswers } from "@/types/types";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { allPlans } from "@/data/plans";
import { Plan } from "@/types/planTypes";

const INITIAL_ANSWERS: DiagnosisAnswers = {
  phase1: {
    includePoints: null,
    networkQuality: null,
    carrierType: null,
    supportPreference: null,
    contractLockPreference: null,
    considerCardAndPayment: null,
  },
  phase2: {
    dataUsage: null,
    speedLimitImportance: null,
    tetheringNeeded: null,
    tetheringUsage: null,

    callDuration: "",
    callFrequencyPerWeek: "",
    familyCallRatio: "",
    overseasCallDuration: "",
    overseasCallFrequencyPerWeek: "",
    callOptionsNeeded: "",

    familyLines: null,
    setDiscount: null,
    infraSet: null,

    shoppingList: null,
    shoppingMonthly: null,
    paymentList: null,
    paymentMonthly: null,

    videoSubscriptions: null,
    musicSubscriptions: null,
    bookSubscriptions: null,
    gameSubscriptions: null,
    cloudSubscriptions: null,
    otherSubscriptions: null,
    subscriptionMonthly: null,

    buyingDevice: null,
    devicePurchaseMethods: [],
    devicePreference: null,
    oldDevicePlan: null,

    overseasUse: null,
    overseasPreference: null,
    dualSim: null,
    specialUses: [],

    mainCard: [],
    paymentTiming: null,
  },
};

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"phase2" | "result">("phase2"); // ← 🔹最初の画面をphase2に変更
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("diagnosisAnswers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DiagnosisAnswers;
        setAnswers(parsed);
        console.log("💾 保存された回答を復元しました");
      } catch (e) {
        console.error("保存データの読み込みに失敗しました", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diagnosisAnswers", JSON.stringify(answers));
  }, [answers]);

  // ✅ Phase2完了時
  const handlePhase2Submit = (phase2Answers: Phase2Answers) => {
    console.log("📨 Phase2 Submit Data:", JSON.stringify(phase2Answers, null, 2));

    setAnswers((prev) => {
      const updated: DiagnosisAnswers = {
        ...prev,
        phase2: { ...prev.phase2, ...phase2Answers },
      };
      localStorage.setItem("diagnosisAnswers", JSON.stringify(updated));
      return JSON.parse(JSON.stringify(updated)) as DiagnosisAnswers;
    });

    setStep("result");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const resetAnswers = () => {
    localStorage.removeItem("diagnosisAnswers");
    setAnswers(JSON.parse(JSON.stringify(INITIAL_ANSWERS)) as DiagnosisAnswers);
    setFilteredPlans([]);
    setStep("phase2"); // ← 最初に戻る
  };

  return (
    <div className="min-h-screen bg-transparent text-black w-full">
      <Header />
      <main className="w-full pt-16 space-y-8">
        <HeroMini />

        {/* 🟦 フェーズ②がフェーズ①を内包 */}
        {step === "phase2" && (
          <Phase2
            defaultValues={answers.phase2}
            phase1Answers={answers.phase1}
            onSubmit={handlePhase2Submit}
            onBack={() => setStep("phase2")}
          />
        )}

        {step === "result" && (
          <Result
            answers={answers}
            filteredPlans={filteredPlans}
            onRestart={resetAnswers}
          />
        )}

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
