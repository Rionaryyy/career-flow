"use client";
import { DiagnosisAnswers } from "../types/types";

interface Props {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  back: () => void;
}

export default function Phase3({ answers, back }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">診断結果</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(answers, null, 2)}
      </pre>

      <button onClick={back} className="mt-4 bg-gray-400 text-white px-4 py-2 rounded">
        戻る
      </button>
    </div>
  );
}
