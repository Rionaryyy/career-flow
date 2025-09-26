"use client";
import { useState } from "react";
import Phase1 from "./components/Phase1";
import Phase2 from "./components/Phase2";
import Result from "./components/Result";
import { DiagnosisAnswers } from "./types/types"; // ← 型はここから読み込む

export default function Home() {
  const [phase, setPhase] = useState(1);
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    includePoints: "",
    qualityPriority: "",
    carrierType: "",
    supportPreference: "",          // ✅ 追加済み
    contractLockPreference: "",     // ✅ 追加済み
    ecosystemUse: "",
    dataUsage: "",
    callFrequency: "",
    familyDiscount: "",
    bundleDiscount: "",
  });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center">📶 キャリア診断</h1>

     {phase === 1 && (
  <Phase1
    answers={answers}
    setAnswers={setAnswers}
    onNext={() => setPhase(2)}  // ← ✅ ここを nextPhase ではなく onNext にする
  />
)}


        {phase === 2 && (
          <Phase2
            answers={answers}
            setAnswers={setAnswers}
            nextPhase={() => setPhase(3)}
            prevPhase={() => setPhase(1)}
          />
        )}

        {phase === 3 && (
          <Result
            answers={answers}
            restart={() => {
              setAnswers({
                includePoints: "",
                qualityPriority: "",
                carrierType: "",
                supportPreference: "",
                contractLockPreference: "",
                ecosystemUse: "",
                dataUsage: "",
                callFrequency: "",
                familyDiscount: "",
                bundleDiscount: "",
              });
              setPhase(1);
            }}
          />
        )}
      </div>
    </main>
  );
}
