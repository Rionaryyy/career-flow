"use client";
import { useState } from "react";

type Answers = {
  eco: string;
  quality: string;
  carrier: string;
  data: string;
  call: string;
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    eco: "",
    quality: "",
    carrier: "",
    data: "",
    call: "",
  });

  const next = () => setStep((prev) => prev + 1);
  const reset = () => {
    setAnswers({ eco: "", quality: "", carrier: "", data: "", call: "" });
    setStep(0);
  };

  const diagnose = () => {
    // ここに診断ロジック（仮）
    return [
      { name: "ドコモ ahamo", reason: "通信品質と経済圏のバランスがよい" },
      { name: "楽天モバイル", reason: "経済圏重視でポイント還元が高い" },
    ];
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">キャリア診断</h1>

      {/* ステップ 0：経済圏 */}
      {step === 0 && (
        <section>
          <h2 className="font-semibold mb-3">ポイント還元や経済圏を料金に含めて考える？</h2>
          <div className="grid gap-2">
            {["yes", "no"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setAnswers({ ...answers, eco: v });
                  next();
                }}
                className={`p-3 rounded ${
                  answers.eco === v ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {v === "yes" ? "含めて考える" : "含めず料金だけで判断"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ステップ 1：通信品質 */}
      {step === 1 && (
        <section>
          <h2 className="font-semibold mb-3">通信品質の重視度</h2>
          <div className="grid gap-2">
            {["high", "middle", "low"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setAnswers({ ...answers, quality: v });
                  next();
                }}
                className={`p-3 rounded ${
                  answers.quality === v ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {v === "high" ? "かなり重視" : v === "middle" ? "ある程度重視" : "あまり気にしない"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ステップ 2：キャリア種類 */}
      {step === 2 && (
        <section>
          <h2 className="font-semibold mb-3">希望するキャリアの種類</h2>
          <div className="grid gap-2">
            {["major", "sub", "mvno"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setAnswers({ ...answers, carrier: v });
                  next();
                }}
                className={`p-3 rounded ${
                  answers.carrier === v ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {v === "major" ? "大手キャリア（ドコモなど）" : v === "sub" ? "サブブランド（ahamo等）" : "格安SIM（IIJmio等）"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ステップ 3：データ量 */}
      {step === 3 && (
        <section>
          <h2 className="font-semibold mb-3">月のデータ使用量</h2>
          <div className="grid gap-2">
            {["0-3", "3-10", "10-20", "20-50", "50+"].map((k) => (
              <button
                key={k}
                onClick={() => {
                  setAnswers({ ...answers, data: k }); // ✅ as any 削除
                  next();
                }}
                className={`p-3 rounded ${
                  answers.data === k ? "bg-blue-600 text-white" : "bg-gray-100"
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

      {/* ステップ 4：通話頻度 */}
      {step === 4 && (
        <section>
          <h2 className="font-semibold mb-3">通話頻度</h2>
          <div className="grid gap-2">
            {[
              { key: "none", label: "ほとんどしない" },
              { key: "short", label: "短時間が多い（1回5分以内）" },
              { key: "long", label: "長電話が多い（10分以上）" },
              { key: "daily", label: "毎日使う" },
            ].map((o) => (
              <button
                key={o.key}
                onClick={() => {
                  setAnswers({ ...answers, call: o.key }); // ✅ as any 削除
                  next();
                }}
                className={`p-3 rounded ${
                  answers.call === o.key ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ステップ 5：診断結果 */}
      {step === 5 && (
        <section>
          <h2 className="text-xl font-bold mb-4">診断結果</h2>
          <div className="space-y-3">
            {diagnose().map((r) => (
              <div key={r.name} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-bold text-lg">{r.name}</h3>
                <p className="text-sm text-gray-600">{r.reason}</p>
              </div>
            ))}
          </div>

          <button
            onClick={reset}
            className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            最初からやり直す
          </button>
        </section>
      )}
    </main>
  );
}
