"use client";
import { DiagnosisAnswers } from "../types/types";

interface Props {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  next: () => void;
}

export default function Phase1({ answers, setAnswers, next }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">基本条件</h2>

      <label>ポイント還元を考慮しますか？</label>
      <select
        value={answers.includePoints}
        onChange={(e) => setAnswers({ ...answers, includePoints: e.target.value as DiagnosisAnswers["includePoints"] })}
      >
        <option value="">選択してください</option>
        <option value="はい">はい</option>
        <option value="いいえ">いいえ</option>
      </select>

      <label>通信品質の重視度</label>
      <select
        value={answers.qualityPriority}
        onChange={(e) => setAnswers({ ...answers, qualityPriority: e.target.value as DiagnosisAnswers["qualityPriority"] })}
      >
        <option value="">選択してください</option>
        <option value="とても重視する">とても重視する</option>
        <option value="ある程度重視する">ある程度重視する</option>
        <option value="こだわらない">こだわらない</option>
      </select>

      <label>希望するキャリアの種類</label>
      <select
        value={answers.carrierType}
        onChange={(e) => setAnswers({ ...answers, carrierType: e.target.value as DiagnosisAnswers["carrierType"] })}
      >
        <option value="">選択してください</option>
        <option value="大手キャリア（ドコモ / au / ソフトバンク / 楽天）">大手キャリア</option>
        <option value="サブブランド（ahamo / povo / LINEMO / UQなど）もOK">サブブランドもOK</option>
        <option value="格安SIM（IIJ / mineo / NUROなど）も含めて検討したい">格安SIMも含める</option>
      </select>

      <button onClick={next} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        次へ
      </button>
    </div>
  );
}
