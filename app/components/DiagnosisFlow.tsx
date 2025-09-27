"use client";

import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Result from "./Result";
import { Phase1Answers, Phase2Answers } from "@/types/types";

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"phase1" | "phase2" | "result">("phase1");
  const [phase1Answers, setPhase1Answers] = useState<Phase1Answers | null>(null);
  const [phase2Answers, setPhase2Answers] = useState<Phase2Answers | null>(null);

  const handlePhase1Submit = (answers: Phase1Answers) => {
    setPhase1Answers(answers);
    setStep("phase2");
  };

  const handlePhase2Submit = (answers: Phase2Answers) => {
    setPhase2Answers(answers);
    setStep("result");
  };

  const handleRestart = () => {
    setPhase1Answers(null);
    setPhase2Answers(null);
    setStep("phase1");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {step === "phase1" && <Phase1 onSubmit={handlePhase1Submit} />}
      {step === "phase2" && <Phase2 onSubmit={handlePhase2Submit} />}
      {step === "result" && phase1Answers && phase2Answers && (
        <Result
          phase1Answers={phase1Answers}
          phase2Answers={phase2Answers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
