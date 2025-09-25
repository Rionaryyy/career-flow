"use client";
import { DiagnosisAnswers } from "../types/types";

interface Phase2Props {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  nextPhase: () => void;
  prevPhase: () => void;
}

export default function Phase2({ answers, setAnswers, nextPhase, prevPhase }: Phase2Props) {
  return (
    <div className="space-y-8">
      {/* 経済圏の利用 */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          経済圏のサービスを利用していますか？
        </label>
        <select
          value={answers.ecosystemUse || ""}
          onChange={(e) =>
            setAnswers({ ...answers, ecosystemUse: e.target.value })
          }
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="yes">はい</option>
          <option value="no">いいえ</option>
        </select>
      </div>

      {/* データ使用量 */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          1ヶ月のデータ使用量はどのくらいですか？
        </label>
        <select
          value={answers.dataUsage || ""}
          onChange={(e) =>
            setAnswers({ ...answers, dataUsage: e.target.value })
          }
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="small">〜5GB</option>
          <option value="medium">5〜20GB</option>
          <option value="large">20GB以上</option>
        </select>
      </div>

      {/* 通話頻度 */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          通話の頻度を教えてください
        </label>
        <select
          value={answers.callFrequency || ""}
          onChange={(e) =>
            setAnswers({ ...answers, callFrequency: e.target.value })
          }
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="high">多い</option>
          <option value="medium">普通</option>
          <option value="low">ほとんどしない</option>
        </select>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevPhase}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          戻る
        </button>
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


