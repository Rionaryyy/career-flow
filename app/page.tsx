"use client";
import { useState } from "react";
import Phase1 from "./components/Phase1";
import Phase2 from "./components/Phase2";
import Phase3 from "./components/Phase3";
import { DiagnosisAnswers } from "./types/types";

export default function Home() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    includePoints: "",
    qualityPriority: "",
    carrierType: "",
    ecosystemUse: "",
    dataUsage: "",
    callFrequency: "",
    familyDiscount: "",
    bundleDiscount: "",
  });

  const nextPhase = () => setPhase((p) => (p < 3 ? (p + 1) as 1 | 2 | 3 : p));
  const prevPhase = () => setPhase((p) => (p > 1 ? (p - 1) as 1 | 2 | 3 : p));

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">キャリア診断</h1>

      {phase === 1 && (
        <Phase1 answers={answers} setAnswers={setAnswers} next={nextPhase} />
      )}
      {phase === 2 && (
        <Phase2
          answers={answers}
          setAnswers={setAnswers}
          next={nextPhase}
          back={prevPhase}
        />
      )}
      {phase === 3 && (
        <Phase3
          answers={answers}
          setAnswers={setAnswers}
          back={prevPhase}
        />
      )}
    </main>
  );
}
