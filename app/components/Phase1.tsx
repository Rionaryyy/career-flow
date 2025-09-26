"use client";
import { DiagnosisAnswers } from "../types/types";

interface Phase1Props {
  answers: DiagnosisAnswers;
  setAnswers: (answers: DiagnosisAnswers) => void;
  nextPhase: () => void;
}

export default function Phase1({ answers, setAnswers, nextPhase }: Phase1Props) {
  const allAnswered =
    answers.includePoints &&
    answers.qualityPriority &&
    answers.carrierType &&
    answers.supportPreference &&
    answers.contractLockPreference;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-white">
        📍 フェーズ①：前提条件
      </h2>

      {/* ① ポイント還元・経済圏 */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-center text-white">
          ポイント還元や経済圏特典も“実質料金”に含めて考えますか？
        </h3>
        <div className="flex flex-col space-y-3">
          <button
            className={`p-3 rounded-xl font-medium transition ${
              answers.includePoints === "yes"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-blue-500 text-white"
            }`}
            onClick={() => setAnswers({ ...answers, includePoints: "yes" })}
          >
            はい（ポイントも含めて最安を知りたい）
          </button>
          <button
            className={`p-3 rounded-xl font-medium transition ${
              answers.includePoints === "no"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-blue-500 text-white"
            }`}
            onClick={() => setAnswers({ ...answers, includePoints: "no" })}
          >
            いいえ（現金支出だけで比べたい）
          </button>
        </div>
      </div>

      {/* ② 通信品質 */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-center text-white">
          通信品質（速度・安定性）はどの程度重視しますか？
        </h3>
        <div className="flex flex-col space-y-3">
          {[
            { key: "high", label: "とても重視する（大手キャリア水準が望ましい）" },
            { key: "mid", label: "ある程度重視する（格安でも安定していればOK）" },
            { key: "low", label: "こだわらない（コスト最優先）" },
          ].map((opt) => (
            <button
              key={opt.key}
              className={`p-3 rounded-xl font-medium transition ${
                answers.qualityPriority === opt.key
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 hover:bg-green-500 text-white"
              }`}
              onClick={() => setAnswers({ ...answers, qualityPriority: opt.key })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ③ キャリア種別 */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-center text-white">
          キャリアの種類に希望はありますか？
        </h3>
        <div className="flex flex-col space-y-3">
          {[
            { key: "major", label: "大手キャリア（ドコモ / au / ソフトバンク / 楽天）" },
            { key: "sub", label: "サブブランド（ahamo / povo / LINEMO / UQなど）もOK" },
            { key: "mvno", label: "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい" },
          ].map((opt) => (
            <button
              key={opt.key}
              className={`p-3 rounded-xl font-medium transition ${
                answers.carrierType === opt.key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 hover:bg-purple-500 text-white"
              }`}
              onClick={() => setAnswers({ ...answers, carrierType: opt.key })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ④ サポート体制 */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-center text-white">
          契約・サポートはオンライン完結で問題ありませんか？
        </h3>
        <div className="flex flex-col space-y-3">
          <button
            className={`p-3 rounded-xl font-medium transition ${
              answers.supportPreference === "online"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 hover:bg-indigo-500 text-white"
            }`}
            onClick={() => setAnswers({ ...answers, supportPreference: "online" })}
          >
            はい（店舗サポートは不要）
          </button>
          <button
            className={`p-3 rounded-xl font-medium transition ${
              answers.supportPreference === "instore"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 hover:bg-indigo-500 text-white"
            }`}
            onClick={() => setAnswers({ ...answers, supportPreference: "instore" })}
          >
            いいえ（店頭での手続きや相談が必要）
          </button>
        </div>
      </div>

      {/* ⑤ 契約期間・縛り */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-center text-white">
          契約期間の縛りや解約金について、どの程度気にしますか？
        </h3>
        <div className="flex flex-col space-y-3">
          {[
            { key: "no_lock", label: "絶対に嫌（縛りなしが前提）" },
            { key: "avoid_if_possible", label: "できれば避けたいが内容次第" },
            { key: "ok", label: "気にしない（条件次第でOK）" },
          ].map((opt) => (
            <button
              key={opt.key}
              className={`p-3 rounded-xl font-medium transition ${
                answers.contractLockPreference === opt.key
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 hover:bg-pink-500 text-white"
              }`}
              onClick={() =>
                setAnswers({ ...answers, contractLockPreference: opt.key })
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 次へボタン */}
      <div className="text-center pt-4">
        <button
          onClick={nextPhase}
          disabled={!allAnswered}
          className={`px-8 py-3 rounded-full text-lg font-semibold transition ${
            allAnswered
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
