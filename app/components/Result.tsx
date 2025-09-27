"use client";
import { DiagnosisAnswers } from "@/types/types";

type Props = {
  answers: DiagnosisAnswers;
  restart: () => void;
};

export default function Result({ answers, restart }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">診断結果</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(answers.phase1, null, 2)}
      </pre>
      <pre className="bg-gray-100 p-4 rounded mt-4">
        {JSON.stringify(answers.phase2, null, 2)}
      </pre>

      <button
        onClick={restart}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        最初からやり直す
      </button>
    </div>
  );
}
