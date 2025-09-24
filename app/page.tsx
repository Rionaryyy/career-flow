"use client";
import { useState } from "react";

// ✅ 回答オブジェクトの型を定義
type Answers = {
  points?: "yes" | "no";
  quality?: "high" | "middle" | "low";
  carrierType?: "major" | "sub" | "cheap";
  data?: "0-3" | "3-10" | "10-20" | "20-50" | "50+";
  call?: "none" | "short" | "long" | "daily";
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({}); // ← ✅ 型を指定！

  const next = () => setStep((s) => s + 1);

  return (
    <main className="max-w-xl mx-auto p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center">📶 キャリア診断（簡易版）</h1>

      {/* Q1 ポイント還元 */}
      {step === 0 && (
        <section>
          <h2 className="font-semibold mb-3">ポイント還元や経済圏特典も「実質料金」に含めて考えますか？</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "yes", label: "はい（ポイントも含めて最安を知りたい）" },
              { key: "no", label: "いいえ（現金支出だけで比べたい）" },
            ].map((o) => (
              <button
                key={o.key}
                onClick={() => {
                  setAnswers({ ...answers, points: o.key as Answers["points"] });
                  next();
                }}
                className={`p-3 rounded transition ${
                  answers.points === o.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Q2 通信品質 */}
      {step === 1 && (
        <section>
          <h2 className="font-semibold mb-3">通信品質（速度・安定性）はどの程度重視しますか？</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "high", label: "とても重視する（大手キャリア水準が望ましい）" },
              { key: "middle", label: "ある程度重視する（格安でも安定していればOK）" },
              { key: "low", label: "こだわらない（コスト最優先）" },
            ].map((o) => (
              <button
                key={o.key}
                onClick={() => {
                  setAnswers({ ...answers, quality: o.key as Answers["quality"] });
                  next();
                }}
                className={`p-3 rounded transition ${
                  answers.quality === o.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Q3 キャリア種別 */}
      {step === 2 && (
        <section>
          <h2 className="font-semibold mb-3">キャリアの種類に希望はありますか？</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "major", label: "大手キャリア（ドコモ / au / ソフトバンク / 楽天）" },
              { key: "sub", label: "サブブランド（ahamo / povo / LINEMO / UQなど）もOK" },
              { key: "cheap", label: "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい" },
            ].map((o) => (
              <button
                key={o.key}
                onClick={() => {
                  setAnswers({ ...answers, carrierType: o.key as Answers["carrierType"] });
                  next();
                }}
                className={`p-3 rounded transition ${
                  answers.carrierType === o.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Q4 データ容量 */}
      {step === 3 && (
        <section>
          <h2 className="font-semibold mb-3">月のデータ使用量はどのくらいですか？</h2>
          <div className="grid grid-cols-1 gap-2">
            {["0-3", "3-10", "10-20", "20-50", "50+"].map((k) => (
              <button
                key={k}
                onClick={() => {
                  setAnswers({ ...answers, data: k as Answers["data"] });
                  next();
                }}
                className={`p-3 rounded transition ${
                  answers.data === k
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {k === "0-3"
                  ? "〜3GB（メール中心）"
                  : k === "3-10"
                  ? "3〜10GB（SNS中心）"
                  : k === "10-20"
                  ? "10〜20GB（動画多め）"
                  : k === "20-50"
                  ? "20〜50GB（動画・テザリング）"
                  : "50GB以上 / 無制限"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Q5 通話頻度 */}
      {step === 4 && (
        <section>
          <h2 className="font-semibold mb-3">通話頻度</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "none", label: "ほとんどしない" },
              { key: "short", label: "短時間が多い（1回5分以内）" },
              { key: "long", label: "長電話が多い（10分以上）" },
              { key: "daily", label: "毎日使う" },
            ].map((o) => (
              <button
                key={o.key}
                onClick={() => {
                  setAnswers({ ...answers, call: o.key as Answers["call"] });
                  next();
                }}
                className={`p-3 rounded transition ${
                  answers.call === o.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ✅ 診断結果 */}
      {step === 5 && (
        <section className="text-center">
          <h2 className="text-xl font-semibold mb-4">📊 診断結果</h2>
          <p className="mb-6">あなたにおすすめのキャリア・プランは以下です：</p>
          <div className="bg-gray-50 border rounded p-4 text-left space-y-2">
            <p>📶 キャリアタイプ: {answers.carrierType}</p>
            <p>💡 データ使用量: {answers.data}</p>
            <p>📞 通話頻度: {answers.call}</p>
            <p>📈 ポイント還元を考慮: {answers.points}</p>
            <p>📡 通信品質: {answers.quality}</p>
          </div>
        </section>
      )}
    </main>
  );
}
