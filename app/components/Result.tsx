"use client";

import { DiagnosisAnswers } from "@types/types";

type ResultProps = {
  answers: DiagnosisAnswers;
};

export default function Result({ answers }: ResultProps) {
  return (
    <div className="w-full max-w-4xl mx-auto text-white text-center space-y-6">
      <h2 className="text-3xl font-bold mb-6">📊 診断結果</h2>
      <p className="text-lg opacity-80">※ 現時点ではモック結果です（ロジックは今後実装予定）</p>
      <pre className="bg-slate-800/70 p-6 rounded-xl text-left whitespace-pre-wrap shadow-lg shadow-slate-900/40">
        {JSON.stringify(answers, null, 2)}
      </pre>
    </div>
  );
}
