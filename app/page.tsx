"use client";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6 text-gray-900">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">📱 キャリア診断</h1>

        {/* --- フェーズ①（前提条件） --- */}
        {step === 0 && (
          <section>
            <h2 className="font-semibold mb-4">
              ポイント還元や経済圏特典も「実質料金」に含めて考えますか？
            </h2>
            <div className="grid gap-3">
              <button
                onClick={() => {
                  setAnswers({ ...answers, points: "include" });
                  next();
                }}
                className={`p-3 rounded border ${
                  answers.points === "include"
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-blue-50"
                }`}
              >
                はい（ポイントも含めて最安を知りたい）
              </button>
              <button
                onClick={() => {
                  setAnswers({ ...answers, points: "exclude" });
                  next();
                }}
                className={`p-3 rounded border ${
                  answers.points === "exclude"
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-blue-50"
                }`}
              >
                いいえ（現金支出だけで比べたい）
              </button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <h2 className="font-semibold mb-4">通信品質（速度・安定性）はどの程度重視しますか？</h2>
            <div className="grid gap-3">
              {[
                { key: "high", label: "とても重視する（大手キャリア水準が望ましい）" },
                { key: "mid", label: "ある程度重視する（格安でも安定していればOK）" },
                { key: "low", label: "こだわらない（コスト最優先）" },
              ].map((o) => (
                <button
                  key={o.key}
                  onClick={() => {
                    setAnswers({ ...answers, quality: o.key });
                    next();
                  }}
                  className={`p-3 rounded border ${
                    answers.quality === o.key
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-blue-50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <button onClick={back} className="mt-4 text-blue-600 underline">
              ← 戻る
            </button>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="font-semibold mb-4">キャリアの種類に希望はありますか？</h2>
            <div className="grid gap-3">
              {[
                { key: "major", label: "大手キャリア（ドコモ / au / ソフトバンク / 楽天）" },
                { key: "sub", label: "サブブランド（ahamo / povo / LINEMO / UQなど）もOK" },
                { key: "mvno", label: "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい" },
              ].map((o) => (
                <button
                  key={o.key}
                  onClick={() => {
                    setAnswers({ ...answers, carrierType: o.key });
                    next();
                  }}
                  className={`p-3 rounded border ${
                    answers.carrierType === o.key
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-blue-50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <button onClick={back} className="mt-4 text-blue-600 underline">
              ← 戻る
            </button>
          </section>
        )}

        {/* --- フェーズ②（詳細条件・ひな型） --- */}
        {step === 3 && (
          <section>
            <h2 className="font-bold text-xl mb-4">📊 経済圏・ポイント利用状況</h2>

            <h3 className="font-semibold mb-2">よく利用している経済圏を教えてください（複数選択可）</h3>
            <div className="grid gap-2 mb-6">
              {["楽天", "dポイント", "au PAY / Ponta", "PayPay", "特になし"].map((e) => (
                <label key={e} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={(ev) => {
                      const current = answers.economy || [];
                      setAnswers({
                        ...answers,
                        economy: ev.target.checked
                          ? [...current, e]
                          : current.filter((x: string) => x !== e),
                      });
                    }}
                  />
                  <span>{e}</span>
                </label>
              ))}
            </div>

            <h3 className="font-semibold mb-2">月あたりどのくらい利用していますか？</h3>
            <div className="grid gap-3">
              {[
                "〜3,000円（ほとんど使わない）",
                "3,000〜5,000円（たまに使う）",
                "5,000〜10,000円（よく使う）",
                "10,000〜30,000円（メインとして使っている）",
                "30,000円以上（生活の中心として利用している）",
              ].map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    setAnswers({ ...answers, usage: label });
                    next();
                  }}
                  className={`p-3 rounded border ${
                    answers.usage === label
                      ? "bg-blue-600 text-white"
                      : "bg-white hover:bg-blue-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button onClick={back} className="mt-4 text-blue-600 underline">
              ← 戻る
            </button>
          </section>
        )}

        {/* --- 仮の診断結果出力（次のフェーズで拡張予定） --- */}
        {step === 4 && (
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4">📊 診断結果（仮）</h2>
            <p className="mb-2">ポイント考慮：{answers.points === "include" ? "する" : "しない"}</p>
            <p className="mb-2">通信品質重視度：{answers.quality}</p>
            <p className="mb-2">希望キャリア：{answers.carrierType}</p>
            <p className="mb-2">経済圏：{answers.economy?.join(" / ") || "未選択"}</p>
            <p className="mb-2">月額利用額：{answers.usage}</p>

            <button onClick={() => setStep(0)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">
              🔄 もう一度診断する
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
