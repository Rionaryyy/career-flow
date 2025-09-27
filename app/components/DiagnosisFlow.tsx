"use client";

import { useState } from "react";
import Start from "./Start";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Result from "./Result";
import { DiagnosisAnswers, Phase1Answers, Phase2Answers } from "@/types/types";

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"start" | "phase1" | "phase2" | "result">("start");
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    phase1: {
      includePoints: null,
      networkQuality: null,
      carrierType: null,
      supportLevel: null,
      contractFlexibility: null,
    },
    phase2: {
      ecosystemUsage: null,
      monthlyData: null,
    },
  });

  const handlePhase1Submit = (phase1Answers: Phase1Answers) => {
    setAnswers(prev => ({ ...prev, phase1: phase1Answers }));
    setStep("phase2");
  };

  const handlePhase2Submit = (phase2Answers: Phase2Answers) => {
    setAnswers(prev => ({ ...prev, phase2: phase2Answers }));
    setStep("result");
  };

  const restart = () => {
    setAnswers({
      phase1: {
        includePoints: null,
        networkQuality: null,
        carrierType: null,
        supportLevel: null,
        contractFlexibility: null,
      },
      phase2: {
        ecosystemUsage: null,
        monthlyData: null,
      },
    });
    setStep("start");
  };

  return (
    <>
      {step === "start" && <Start onStart={() => setStep("phase1")} />}
      {step === "phase1" && <Phase1 onSubmit={handlePhase1Submit} />}
      {step === "phase2" && <Phase2 onSubmit={handlePhase2Submit} />}
      {step === "result" && <Result answers={answers} onRestart={restart} />}
    </>
  );
}
