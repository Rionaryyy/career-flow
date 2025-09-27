"use client";

import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Result from "./Result";
import Start from "./Start";
import { DiagnosisAnswers } from "@/types/types";

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"start" | "phase1" | "phase2" | "result">("start");

  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    phase1: {
      includeEconomy: "no",
      networkPriority: "medium",
      carrierType: "major",
      supportPriority: "medium",
      contractBinding: "no",
    },
    phase2: {
      monthlyData: 0,
      callFrequency: "medium",
      familyDiscount: "no",
      setDiscount: "no",
      useEcosystem: "no",
    },
  });

  const handlePhase1Submit = (phase1Answers: DiagnosisAnswers["phase1"]) => {
    setAnswers((prev) => ({ ...prev, phase1: phase1Answers }));
    setStep("phase2");
  };

  const handlePhase2Submit = (phase2Answers: DiagnosisAnswers["phase2"]) => {
    setAnswers((prev) => ({ ...prev, phase2: phase2Answers }));
    setStep("result");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {step === "start" && <Start onNext={() => setStep("phase1")} />}
      {step === "phase1" && <Phase1 onSubmit={handlePhase1Submit} />}
      {step === "phase2" && <Phase2 onSubmit={handlePhase2Submit} />}
      {step === "result" && <Result answers={answers} />}
    </div>
  );
}
