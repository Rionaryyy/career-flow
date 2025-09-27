"use client";

import { useState } from "react";
import Phase1 from "./components/Phase1";
import Phase2 from "./components/Phase2";
import Result from "./components/Result";
import { DiagnosisAnswers, Phase1Answers, Phase2Answers } from "@/types/types";

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
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

  const handlePhase1Next = (data: Phase1Answers) => {
    setAnswers((prev) => ({ ...prev, phase1: data }));
    setStep(2);
  };

  const handlePhase2Next = (data: Phase2Answers) => {
    setAnswers((prev) => ({ ...prev, phase2: data }));
    setStep(3);
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
    setStep(1);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      {step === 1 && <Phase1 onNext={handlePhase1Next} />}
      {step === 2 && <Phase2 onNext={handlePhase2Next} />}
      {step === 3 && <Result answers={answers} restart={handleRestart} />}
    </main>
  );
}
