"use client";
import React, { useState } from "react";
import Phase1 from "./components/Phase1";
import { DiagnosisAnswers } from "@/types/types";

export default function Home() {
  const [answers, setAnswers] = useState<DiagnosisAnswers>({});
  const [phase, setPhase] = useState(1);

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      {phase === 1 && (
        <Phase1
          answers={answers}
          setAnswers={setAnswers}
          onNext={() => setPhase(2)} // ✅ onNext でOK
        />
      )}

      {phase === 2 && (
        <div className="text-xl text-center">
          📊 結果画面（仮）
        </div>
      )}
    </main>
  );
}
