"use client";

import { useState, useEffect } from "react";
import Header from "./layouts/Header";
import Phase1 from "./Phase1/Phase1";
import Phase2 from "./Phase2/Phase2";
import Result from "./Result";
import FeatureHighlightsFlow from "./FeatureHighlightsFlow";
import HeroMini from "./HeroMini";
import { Phase1Answers, Phase2Answers, DiagnosisAnswers } from "@/types/types";

// 🟩 フィルターロジックをインポート
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";

// 🟩 全プランデータをインポート
import { allPlans } from "@/data/plans";

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

    mainCard: null,
    paymentTiming: null,
  },
};

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"phase1" | "phase2" | "result">("phase1");
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS);

  // 🟩 フィルター結果を保持する state
  const [filteredPlans, setFilteredPlans] = useState<any[]>([]);

  // ✅ 保存済みデータを読み込み
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

  // ✅ 回答が更新されるたびにローカルストレージへ保存
  useEffect(() => {
    localStorage.setItem("diagnosisAnswers", JSON.stringify(answers));
  }, [answers]);

  // ✅ フェーズ1回答送信
  const handlePhase1Submit = (phase1Answers: Phase1Answers) => {
    setAnswers((prev) => ({ ...prev, phase1: phase1Answers }));

    // 🟩 フィルター処理を実行
    const phase1Results = filterPlansByPhase1(phase1Answers, allPlans);

    console.log("📊 フィルター結果:", phase1Results);

    // 🟩 保存
    setFilteredPlans(phase1Results);

    setStep("phase2");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // ✅ フェーズ2回答送信
  const handlePhase2Submit = (phase2Answers: Phase2Answers) => {
    setAnswers((prev) => ({ ...prev, phase2: phase2Answers }));
    setStep("result");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // ✅ 回答リセット機能
  const resetAnswers = () => {
    localStorage.removeItem("diagnosisAnswers");
    setAnswers(INITIAL_ANSWERS);
    setStep("phase1");
  };

  return (
    <div className="min-h-screen bg-white text-black w-full">
      <Header />
      <main className="w-full pt-16 space-y-8">
        <HeroMini />

        {step === "phase1" && (
          <Phase1 defaultValues={answers.phase1} onSubmit={handlePhase1Submit} />
        )}

        {step === "phase2" && (
          <Phase2
            defaultValues={answers.phase2}
            phase1Answers={answers.phase1}
            onSubmit={handlePhase2Submit}
            onBack={() => setStep("phase1")}
          />
        )}

        {step === "result" && (
          <Result
            answers={answers}
            filteredPlans={filteredPlans} // 🟩 ← ここも忘れずに渡す
            onRestart={resetAnswers}
          />
        )}

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
