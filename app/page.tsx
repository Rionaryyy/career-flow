"use client";

import { useState } from "react";

type Answers = {
  points: "yes" | "no" | null;
  quality: "high" | "middle" | "low" | null;
  type: "major" | "sub" | "cheap" | null;
  ecosystem: string[];
  usage: "low" | "middle" | "high" | "veryhigh" | null;
  data: "0-3" | "3-10" | "10-20" | "20-50" | "50+" | null;
  call: "none" | "short" | "long" | "daily" | null;
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    points: null,
    quality: null,
    type: null,
    ecosystem: [],
    usage: null,
    data: null,
    call: null,
  });

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  return (
    <main className="max-w-xl mx-auto p-6 text-gray-900 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">キャリア診断（簡易版）</h1>

      {/* Q1 */}
      {step === 0 && (
        <section>
          <h2 className="font-semibold mb-3 text-black text-lg">
            ポイント還元や経済圏特典も「実質料金」に含めて考えますか？
          </h2>
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

      {/* Q2 */}
      {step === 1 && (
        <section>
          <h2 className="font-semibold mb-3 text-black text-lg">通信品質の重視度は？</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "high", label: "かなり重視する（動画・通話・在宅ワークなど）" },
              { key: "middle", label: "そこそこ重視する（SNSや動画など）" },
              { key: "low", label: "あまり気にしない（メール・LINE中心）" },
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

      {/* Q3 */}
      {step === 2 && (
        <section>
          <h2 className="font-semibold mb-3 text-black text-lg">希望するキャリアの種類</h2>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "major", label: "大手キャリア（ドコモ・au・ソフトバンクなど）" },
              { key: "sub", label: "サブブランド（ahamo・povo・LINEMOなど）" },
              { key: "cheap", label: "格安SIM（IIJmio・mineoなど）" },
            ].map((o) => (
              <button
                key={o.key}
                onClick={() => {
                  setAnswers({ ...answers, type: o.key as Answers["type"] });
                  next();
                }}
                className={`p-3 rounded transition ${
                  answers.type === o.key
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

      {/* Q4 データ量 */}
      {step === 3 && (
        <section>
          <h2 className="font-semibold mb-3 text-black text-lg">1か月のデータ使用量</h2>
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
          <h2 className="font-semibold mb-3 text-black text-lg">通話頻度</h2>
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

      {/* 結果表示（例） */}
      {step === 5 && (
        <section className="text-center">
          <h2 className="text-xl font-bold mb-4 text-black">診断結果（仮）</h2>
          <p>あなたにおすすめのキャリアは「◯◯◯」です！</p>
        </section>
      )}

      {/* 戻るボタン */}
      {step > 0 && step < 5 && (
        <button onClick={prev} className="mt-6 text-blue-600 underline">
          ← 前の質問へ戻る
        </button>
      )}
    </main>
  );
}
