"use client";

import { DiagnosisAnswers } from "@/types/types";

interface ResultProps {
  answers: DiagnosisAnswers;
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: ResultProps) {
  return (
    <div>
      <h2>診断結果</h2>
      <pre>{JSON.stringify(answers, null, 2)}</pre>
      <button onClick={onRestart}>もう一度診断する</button>
    </div>
  );
}
