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

  // ✅ ① 初回マウント時に保存済みデータを読み込む
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

  // ✅ ② 回答が更新されるたびにローカルストレージへ保存
  useEffect(() => {
    localStorage.setItem("diagnosisAnswers", JSON.stringify(answers));
  }, [answers]);

  // ✅ フェーズ1回答送信
  const handlePhase1Submit = (phase1Answers: Phase1Answers) => {
    setAnswers((prev) => ({ ...prev, phase1: phase1Answers }));
    setStep("phase2");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // ✅ フェーズ2回答送信
  const handlePhase2Submit = (phase2Answers: Phase2Answers) => {
    setAnswers((prev) => ({ ...prev, phase2: phase2Answers }));
    setStep("result");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // ✅ 回答リセット機能（結果画面やメニューなどから呼べる）
  const resetAnswers = () => {
    localStorage.removeItem("diagnosisAnswers");
    setAnswers(INITIAL_ANSWERS);
    setStep("phase1");
  };

  return (
    <div className="min-h-screen bg-white text-black w-full">
      {/* ヘッダー常時表示 */}
      <Header />

      {/* メインコンテンツ */}
      <main className="w-full pt-16 space-y-8">
        <HeroMini />

        {/* フェーズ1 */}
        {step === "phase1" && (
          <Phase1 defaultValues={answers.phase1} onSubmit={handlePhase1Submit} />
        )}

        {/* フェーズ2 */}
        {step === "phase2" && (
          <Phase2
            defaultValues={answers.phase2}
            onSubmit={handlePhase2Submit}
            onBack={() => setStep("phase1")}
          />
        )}

        {/* 結果画面（リセットボタンを渡す例） */}
        {step === "result" && (
          <Result
            answers={answers}
            onRestart={resetAnswers} // ← 保存データも削除して最初から
          />
        )}

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
