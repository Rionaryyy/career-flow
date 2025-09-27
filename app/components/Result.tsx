"use client";

import { DiagnosisAnswers } from "@/types/types"; // ← これが正しい！

type ResultProps = {
  answers: DiagnosisAnswers;
};

export default function Result({ answers }: ResultProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">診断結果</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(answers, null, 2)}</pre>
    </div>
  );
}
