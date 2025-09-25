"use client";
import { DiagnosisAnswers } from "../types/types";

interface Props {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  next: () => void;
  back: () => void;
}

export default function Phase2({ answers, setAnswers, next, back }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">詳細条件</h2>

      <label>経済圏の利用</label>
      <select
        value={answers.ecosystemUse}
        onChange={(e) => setAnswers({ ...answers, ecosystemUse: e.target.value as DiagnosisAnswers["ecosystemUse"] })}
      >
        <option value="">選択してください</option>
        <option value="はい">はい</option>
        <option value="いいえ">いいえ</option>
        <option value="検討中">検討中</option>
      </select>

      <label>家族割の利用</label>
      <select
        value={answers.familyDiscount}
        onChange={(e) => setAnswers({ ...answers, familyDiscount: e.target.value as DiagnosisAnswers["familyDiscount"] })}
      >
        <option value="">選択してください</option>
        <option value="はい">はい</option>
        <option value="いいえ">いいえ</option>
        <option value="未定">未定</option>
      </select>

      <label>セット割（光回線など）の利用</label>
      <select
        value={answers.bundleDiscount}
        onChange={(e) => setAnswers({ ...answers, bundleDiscount: e.target.value as DiagnosisAnswers["bundleDiscount"] })}
      >
        <option value="">選択してください</option>
        <option value="はい">はい</option>
        <option value="いいえ">いいえ</option>
        <option value="未定">未定</option>
      </select>

      <div className="mt-4 flex gap-4">
        <button onClick={back} className="bg-gray-400 text-white px-4 py-2 rounded">戻る</button>
        <button onClick={next} className="bg-blue-500 text-white px-4 py-2 rounded">次へ</button>
      </div>
    </div>
  );
}

