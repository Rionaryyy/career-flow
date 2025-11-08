import { useState, useEffect } from "react";
import Header from "./layouts/Header";
import Phase2 from "./DiagnosisFlow/DiagnosisFlow";
import ResultContainer from "./Result/ResultContainer";
import FeatureHighlightsFlow from "./FeatureHighlightsFlow";
import HeroMini from "./HeroMini";
import { DiagnosisAnswers } from "@/types/types";

const INITIAL_ANSWERS: DiagnosisAnswers = {
  includePoints: null,
  networkQuality: null,
  carrierType: null,
  supportPreference: null,
  contractLockPreference: null,
  considerCardAndPayment: null,
  includeSubscription: undefined,
  // === Phase2相当 ===
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
  contractMethod: null, // ✅ デフォルトを「未選択」に変更
};

export default function DiagnosisFlowPage() {
  const [step, setStep] = useState<"phase2" | "result">("phase2");
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS);

  // ✅ 保存データ復元（"store" 選択をリセット）
  useEffect(() => {
    const saved = localStorage.getItem("diagnosisAnswers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DiagnosisAnswers;

        // 🚫 常に「店頭で申し込みたい」が選択されるのを防止
        if (parsed.contractMethod === "store") {
          parsed.contractMethod = null;
        }

        setAnswers(parsed);
        console.log("💾 保存された回答を復元しました");
      } catch (e) {
        console.error("保存データの読み込みに失敗しました", e);
      }
    }
  }, []);

  // ✅ 自動保存
  useEffect(() => {
    localStorage.setItem("diagnosisAnswers", JSON.stringify(answers));
  }, [answers]);

  // ✅ Phase2完了時（診断結果へ）
  const handlePhase2Submit = (updated: DiagnosisAnswers) => {
    console.log("📨 Phase2 Submit Data:", JSON.stringify(updated, null, 2));
    setAnswers(updated);
    setStep("result");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // ✅ リセット処理
  const resetAnswers = () => {
    // localStorageを削除してから状態を初期化
    localStorage.removeItem("diagnosisAnswers");
    setAnswers(INITIAL_ANSWERS);  // answersを初期化
    setStep("phase2");  // Phase2に戻す
  };

  return (
    <div className="min-h-screen bg-transparent text-black w-full">
      <Header />
      <main className="w-full pt-16 space-y-8">
        <HeroMini />

        {/* 🟦 Phase2（統合版） */}
        {step === "phase2" && (
          <Phase2
            defaultValues={answers}
            onSubmit={handlePhase2Submit}
            onBack={() => setStep("phase2")}
          />
        )}

        {/* 🟩 診断結果画面 */}
        {step === "result" && (
          <ResultContainer
            answers={answers}
            onRestart={resetAnswers}  // リセット処理をここで呼び出す
          />
        )}

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
