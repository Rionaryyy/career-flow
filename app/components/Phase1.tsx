"use client";
import { DiagnosisAnswers } from "../types/types";

interface Phase1Props {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  nextPhase: () => void;
}

export default function Phase1({ answers, setAnswers, nextPhase }: Phase1Props) {
  return (
    <div className="space-y-8">
      {/* Q1 */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          ポイント還元を料金に含めて考えますか？
        </label>
        <select
          value={answers.includePoints || ""}
          onChange={(e) =>
            setAnswers({ ...answers, includePoints: e.target.value })
          }
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="yes">はい</option>
          <option value="no">いいえ</option>
        </select>
      </div>

      {/* Q2 */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          通信品質の重視度を選んでください
        </label>
        <select
          value={answers.qualityPriority || ""}
          onChange={(e) =>
            setAnswers({ ...answers, qualityPriority: e.target.value })
          }
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="high">高い</option>
          <option value="medium">普通</option>
          <option value="low">低い</option>
        </select>
      </div>

      {/* Q3 */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          希望するキャリアの種類を選んでください
        </label>
        <select
          value={answers.carrierType || ""}
          onChange={(e) =>
            setAnswers({ ...answers, carrierType: e.target.value })
          }
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="major">大手キャリア</option>
          <option value="sub">サブブランド</option>
          <option value="mvno">格安SIM</option>
        </select>
      </div>

      <div className="text-right">
        <button
          onClick={nextPhase}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
