"use client";
import { DiagnosisAnswers } from "../types/types";

type Props = {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  nextPhase: () => void;
};

export default function Phase1({ answers, setAnswers, nextPhase }: Props) {
  // 汎用のボタンコンポーネント
  const OptionButton = ({
    label,
    value,
    selected,
    onClick,
  }: {
    label: string;
    value: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-3 px-4 text-sm sm:text-base font-medium rounded-xl border transition 
        ${
          selected
            ? "bg-purple-600 text-white border-purple-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* 見出し */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400">
          📍 フェーズ①：前提条件
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">
          まずは基本的な条件を教えてください
        </p>
      </div>

      {/* Q1: ポイント還元 */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Q1. ポイント還元や経済圏特典を料金に含めて考えますか？
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <OptionButton
            label="はい、含めて考える"
            value="yes"
            selected={answers.includePoints === "yes"}
            onClick={() => setAnswers({ ...answers, includePoints: "yes" })}
          />
          <OptionButton
            label="いいえ、料金だけで比較したい"
            value="no"
            selected={answers.includePoints === "no"}
            onClick={() => setAnswers({ ...answers, includePoints: "no" })}
          />
        </div>
      </div>

      {/* Q2: 通信品質 */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Q2. 通信品質の重視度はどのくらいですか？
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <OptionButton
            label="とても重視する（速度・安定性優先）"
            value="high"
            selected={answers.qualityPriority === "high"}
            onClick={() => setAnswers({ ...answers, qualityPriority: "high" })}
          />
          <OptionButton
            label="ある程度重視する（コスパとのバランス）"
            value="medium"
            selected={answers.qualityPriority === "medium"}
            onClick={() =>
              setAnswers({ ...answers, qualityPriority: "medium" })
            }
          />
          <OptionButton
            label="あまり重視しない（安さ優先）"
            value="low"
            selected={answers.qualityPriority === "low"}
            onClick={() => setAnswers({ ...answers, qualityPriority: "low" })}
          />
        </div>
      </div>

      {/* Q3: キャリア種類 */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Q3. 希望するキャリアの種類は？
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <OptionButton
            label="大手キャリア（docomo / au / SoftBank など）"
            value="major"
            selected={answers.carrierType === "major"}
            onClick={() => setAnswers({ ...answers, carrierType: "major" })}
          />
          <OptionButton
            label="サブブランド（ahamo / povo / LINEMO など）"
            value="subbrand"
            selected={answers.carrierType === "subbrand"}
            onClick={() =>
              setAnswers({ ...answers, carrierType: "subbrand" })
            }
          />
          <OptionButton
            label="格安SIM（IIJmio / mineo など）"
            value="mvno"
            selected={answers.carrierType === "mvno"}
            onClick={() => setAnswers({ ...answers, carrierType: "mvno" })}
          />
        </div>
      </div>

      {/* Q4: サポート */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Q4. 店舗サポートや手厚いサポートは必要ですか？
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <OptionButton
            label="はい、手厚いサポートがある方がいい"
            value="yes"
            selected={answers.supportPreference === "yes"}
            onClick={() =>
              setAnswers({ ...answers, supportPreference: "yes" })
            }
          />
          <OptionButton
            label="いいえ、基本的に自分で対応する"
            value="no"
            selected={answers.supportPreference === "no"}
            onClick={() =>
              setAnswers({ ...answers, supportPreference: "no" })
            }
          />
        </div>
      </div>

      {/* Q5: 契約縛り */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white">
          Q5. 契約期間の縛りや解約金について重視しますか？
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <OptionButton
            label="はい、縛りがない方がいい"
            value="free"
            selected={answers.contractLockPreference === "free"}
            onClick={() =>
              setAnswers({ ...answers, contractLockPreference: "free" })
            }
          />
          <OptionButton
            label="いいえ、縛りがあっても問題ない"
            value="contract"
            selected={answers.contractLockPreference === "contract"}
            onClick={() =>
              setAnswers({ ...answers, contractLockPreference: "contract" })
            }
          />
        </div>
      </div>

      {/* 次へボタン */}
      <div className="pt-4">
        <button
          onClick={nextPhase}
          className="w-full py-4 text-lg font-semibold rounded-2xl bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
