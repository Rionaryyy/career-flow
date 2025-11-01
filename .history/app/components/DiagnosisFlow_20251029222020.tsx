"use client";

import { useState, useEffect } from "react";
import Header from "./layouts/Header";
import Phase1 from "./Phase1/Phase1";
import Phase2 from "./Phase2/Phase2";
import Result from "./Result";
import FeatureHighlightsFlow from "./FeatureHighlightsFlow";
import HeroMini from "./HeroMini";
import { Phase1Answers, Phase2Answers, DiagnosisAnswers } from "@/types/types";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { allPlans } from "@/data/plans";
import { Plan } from "@/types/planTypes"; // ✅ 型を明示

// 🟦 初期値
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

    mainCard: [], // ← ✅ 修正ここ
    paymentTiming: null,
  },
};

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"phase1" | "phase2" | "result">("phase1");
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS);

  // ✅ Plan 型で管理（any禁止）
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);

  // ✅ 保存データ読み込み
  useEffect(() => {
    const saved = localStorage.getItem("diagnosisAnswers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DiagnosisAnswers; // ✅ 型指定
        setAnswers(parsed);
        console.log("💾 保存された回答を復元しました");
      } catch (e) {
        console.error("保存データの読み込みに失敗しました", e);
      }
    }
  }, []);

  // ✅ 回答が変わるたびに保存
  useEffect(() => {
    localStorage.setItem("diagnosisAnswers", JSON.stringify(answers));
  }, [answers]);

  // ✅ フェーズ1送信
  const handlePhase1Submit = (phase1Answers: Phase1Answers) => {
    setAnswers((prev) => {
      const updated: DiagnosisAnswers = { ...prev, phase1: phase1Answers };
      return JSON.parse(JSON.stringify(updated)) as DiagnosisAnswers; // ✅ 型を保持
    });

    const phase1Results = filterPlansByPhase1(phase1Answers, allPlans);
    console.log("📊 フィルター結果:", phase1Results);

    setFilteredPlans(phase1Results);
    setStep("phase2");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // ✅ フェーズ2送信（JSON展開＋部分更新）
  const handlePhase2Submit = (phase2Answers: Phase2Answers) => {
    console.log("📨 Phase2 Submit Data:", JSON.stringify(phase2Answers, null, 2)); // ← 展開して表示

    setAnswers((prev) => {
      const updated: DiagnosisAnswers = {
        ...prev,
        phase2: {
          ...prev.phase2,   // ← 既存値を保持
          ...phase2Answers, // ← 今回の回答を上書き
        },
      };

      console.log("💾 DiagnosisAnswers 更新後:", JSON.stringify(updated.phase2, null, 2)); // ← 確認用ログ

      // ローカル保存も同時に更新
      localStorage.setItem("diagnosisAnswers", JSON.stringify(updated));

      return JSON.parse(JSON.stringify(updated)) as DiagnosisAnswers;
    });

    setStep("result");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // ✅ リセット
  const resetAnswers = () => {
    localStorage.removeItem("diagnosisAnswers");
    setAnswers(JSON.parse(JSON.stringify(INITIAL_ANSWERS)) as DiagnosisAnswers);
    setFilteredPlans([]);
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
            filteredPlans={filteredPlans}
            onRestart={resetAnswers}
          />
        )}

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
