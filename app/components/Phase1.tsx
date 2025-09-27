"use client";

import { useState } from "react";
import Phase1 from "./components/Phase1";
import Phase2 from "./components/Phase2";
import Result from "./components/Result";
import { DiagnosisAnswers, Phase1Answers, Phase2Answers } from "@/types/types";

export default function Home() {
  const [step, setStep] = useState<"phase1" | "phase2" | "result">("phase1");

  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    phase1: {
      considerPoints: null,
      networkQuality: null,
      carrierType: null,
      supportPriority: null,
      contractFreedom: null,
    },
    phase2: {
      ecosystemUsage: null,
      monthlyData: null,
      callFrequency: null,
      familyDiscount: null,
    },
  });

  const handlePhase1Complete = (data: Phase1Answers) => {
    setAnswers((prev) => ({ ...prev, phase1: data }));
    setStep("phase2");
  };

  const handlePhase2Complete = (data: Phase2Answers) => {
    setAnswers((prev) => ({ ...prev, phase2: data }));
    setStep("result");
  };

  const handleRestart = () => {
    setAnswers({
      phase1: {
        considerPoints: null,
        networkQuality: null,
        carrierType: null,
        supportPriority: null,
        contractFreedom: null,
      },
      phase2: {
        ecosystemUsage: null,
        monthlyData: null,
        callFrequency: null,
        familyDiscount: null,
      },
    });
    setStep("phase1");
  };

  return (
    <main className="p-6">
      {step === "phase1" && <Phase1 onComplete={handlePhase1Complete} />}
      {step === "phase2" && <Phase2 onComplete={handlePhase2Complete} />}
      {step === "result" && (
        <Result answers={answers} restart={handleRestart} />
      )}
    </main>
  );
}
