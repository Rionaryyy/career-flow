"use client";
import React, { useState } from "react";

type Phase1 = {
  includePoints: boolean; // 前提: ポイントを考慮するか
  qualityPriority: "high" | "medium" | "low"; // 通信品質重視度
  carrierScope: "big" | "subs" | "all"; // 大手／サブ／全部
};

type Answers = {
  data?: "0-3" | "3-10" | "10-20" | "20-50" | "50+";
  call?: "none" | "short" | "long" | "daily";
  family?: boolean;
  set?: boolean;
  econ?: string[]; // 経済圏
  econSpend?: number; // 月利用額（代表値）
  buyDevice?: boolean;
};

type Plan = {
  id: string;
  carrier: string;
  plan: string;
  price: number; // 月額の代表値（税抜 or 税込の統一）
  quality: number; // 0-100
  pointsRate: number; // 0-1 (例: 0.03 = 3%)
  supportsFamily?: boolean;
  supportsSet?: boolean;
  supportsRoaming?: boolean;
  unlimited?: boolean;
};

const PLANS: Plan[] = [
  { id: "ahamo-20", carrier: "ドコモ (ahamo)", plan: "ahamo 20GB", price: 2970, quality: 90, pointsRate: 0.02, supportsFamily: false, supportsSet: false, supportsRoaming: true },
  { id: "linemo-20", carrier: "ソフトバンク (LINEMO)", plan: "LINEMO スマホプラン 20GB", price: 2728, quality: 80, pointsRate: 0.015, supportsFamily: false, supportsSet: false, supportsRoaming: false },
  { id: "rakuten-unlimited", carrier: "楽天モバイル", plan: "Rakuten UN-LIMIT 無制限", price: 3278, quality: 75, pointsRate: 0.04, supportsFamily: true, supportsSet: false, supportsRoaming: true, unlimited: true },
  { id: "uq-15", carrier: "UQモバイル", plan: "くりこしプランM 15GB", price: 2728, quality: 82, pointsRate: 0.02, supportsFamily: true, supportsSet: true, supportsRoaming: false },
  { id: "iij-10", carrier: "IIJmio (格安)", plan: "ギガプラン 10GB", price: 1500, quality: 60, pointsRate: 0.0, supportsFamily: false, supportsSet: false, supportsRoaming: false },
  { id: "mineo-5", carrier: "mineo (格安)", plan: "ライト 5GB", price: 1100, quality: 55, pointsRate: 0.0, supportsFamily: false, supportsSet: false, supportsRoaming: false },
];

export default function CareerDiagnosis() {
  const [step, setStep] = useState(0);
  const [phase1, setPhase1] = useState<Phase1>({ includePoints: true, qualityPriority: "medium", carrierScope: "all" });
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Plan[] | null>(null);

  // 質問一覧（簡易版）
  const steps = [
    "前提：診断方針",
    "データ通信量",
    "通話頻度",
    "家族割・セット割",
    "経済圏（ポイント）",
    "結果を表示",
  ];

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function computeResults() {
    // フィルタ（前提）: carrierScope
    let candidates = PLANS.filter((p) => {
      if (phase1.carrierScope === "big") {
        return /ドコモ|ソフトバンク|楽天|au/.test(p.carrier);
      }
      if (phase1.carrierScope === "subs") {
        return /ahamo|povo|LINEMO|UQ|UQモバイル/.test(p.plan) || /サブ/.test(p.carrier);
      }
      return true;
    });

    // フィルタ: family / set
    if (answers.family) {
      candidates = candidates.filter((p) => p.supportsFamily);
    }
    if (answers.set) {
      candidates = candidates.filter((p) => p.supportsSet);
    }

    // スコア計算
    // 重みは前提のqualityPriorityとポイント利用を反映
    const weightQuality = phase1.qualityPriority === "high" ? 0.6 : phase1.qualityPriority === "medium" ? 0.4 : 0.2;
    const weightPrice = 1 - weightQuality - 0.1; // price weight
    const weightPoints = phase1.includePoints ? 0.1 : 0; // points weight

    // データ使用に応じて価格系の評価を変える（容量が大きいと高品質プラン価値が上がる）
    const dataImportance = answers.data === "50+" || answers.data === "20-50" ? 1.1 : answers.data === "10-20" ? 1.0 : 0.9;

    // normalize price: lower price -> higher score
    const maxPrice = Math.max(...candidates.map((c) => c.price));
    const minPrice = Math.min(...candidates.map((c) => c.price));

    const scored = candidates.map((p) => {
      const priceScore = 1 - (p.price - minPrice) / Math.max(1, maxPrice - minPrice); // 0-1
      const qualityScore = p.quality / 100; // 0-1
      const pointBenefit = phase1.includePoints && answers.econ && answers.econ.length > 0 && answers.econSpend
        ? Math.min(1, p.pointsRate * answers.econSpend / 100) // rough normalized
        : 0;

      // bonus for unlimited if user needs high data
      const unlimitedBonus = (answers.data === "50+" && p.unlimited) ? 0.15 : 0;

      const total = priceScore * weightPrice * dataImportance + qualityScore * weightQuality + pointBenefit * weightPoints + unlimitedBonus;

      return { plan: p, score: total };
    });

    scored.sort((a, b) => b.score - a.score);

    setResults(scored.slice(0, 3).map((s) => s.plan));
    setStep(steps.length - 1);
  }

  // UI for each step
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl p-6 shadow">
          <h1 className="text-xl font-bold mb-4">簡易キャリア診断（キャリア＋プラン表示）</h1>

          {/* progress */}
          <div className="mb-4">
            <div className="text-sm text-gray-600">{step + 1} / {steps.length}</div>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="bg-blue-600 h-2 rounded" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
            </div>
          </div>

          <div className="min-h-[240px]">
            {step === 0 && (
              <section>
                <h2 className="font-semibold mb-3">前提条件（診断の軸）</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={phase1.includePoints} onChange={(e) => setPhase1({ ...phase1, includePoints: e.target.checked })} />
                    <span>ポイント還元を実質料金に含める</span>
                  </label>

                  <div>
                    <div className="mb-2">通信品質（速度・安定性）の重視度</div>
                    <div className="flex space-x-2">
                      <button className={`px-3 py-1 rounded ${phase1.qualityPriority === "high" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setPhase1({ ...phase1, qualityPriority: "high" })}>とても重視</button>
                      <button className={`px-3 py-1 rounded ${phase1.qualityPriority === "medium" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setPhase1({ ...phase1, qualityPriority: "medium" })}>ある程度</button>
                      <button className={`px-3 py-1 rounded ${phase1.qualityPriority === "low" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setPhase1({ ...phase1, qualityPriority: "low" })}>コスト最優先</button>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">比較対象に含めたいキャリア範囲</div>
                    <div className="flex space-x-2">
                      <button className={`px-3 py-1 rounded ${phase1.carrierScope === "big" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setPhase1({ ...phase1, carrierScope: "big" })}>大手のみ</button>
                      <button className={`px-3 py-1 rounded ${phase1.carrierScope === "subs" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setPhase1({ ...phase1, carrierScope: "subs" })}>サブブランド中心</button>
                      <button className={`px-3 py-1 rounded ${phase1.carrierScope === "all" ? "bg-blue-600 text-white" : "bg-gray-100"}`} onClick={() => setPhase1({ ...phase1, carrierScope: "all" })}>すべて</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {step === 1 && (
              <section>
                <h2 className="font-semibold mb-3">データ通信量</h2>
                <div className="grid grid-cols-1 gap-2">
                  {["0-3", "3-10", "10-20", "20-50", "50+"].map((k) => (
                    <button key={k} onClick={() => { setAnswers({ ...answers, data: k as any }); next(); }} className={`p-3 rounded ${answers.data === k ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{k === "0-3" ? "〜3GB（メール中心）" : k === "3-10" ? "3〜10GB（SNS中心）" : k === "10-20" ? "10〜20GB（動画多め）" : k === "20-50" ? "20〜50GB（動画・テザリング）" : "50GB以上 / 無制限"}</button>
                  ))}
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <h2 className="font-semibold mb-3">通話頻度</h2>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: "none", label: "ほとんどしない" },
                    { key: "short", label: "短時間が多い（1回5分以内）" },
                    { key: "long", label: "長電話が多い（10分以上）" },
                    { key: "daily", label: "毎日使う" },
                  ].map((o) => (
                    <button key={o.key} onClick={() => { setAnswers({ ...answers, call: o.key as any }); next(); }} className={`p-3 rounded ${answers.call === o.key ? "bg-blue-600 text-white" : "bg-gray-100"}`}>{o.label}</button>
                  ))}
                </div>
              </section>
            )}

            {step === 3 && (
              <section>
                <h2 className="font-semibold mb-3">家族割 / セット割</h2>
                <div className="grid grid-cols-1 gap-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={!!answers.family} onChange={(e) => setAnswers({ ...answers, family: e.target.checked })} />
                    <span>複数回線割引（家族割など）を利用する予定がある</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={!!answers.set} onChange={(e) => setAnswers({ ...answers, set: e.target.checked })} />
                    <span>光回線や電気など、スマホとセットで割引になる契約がある</span>
                  </label>
                  <div className="flex space-x-2">
                    <button onClick={prev} className="px-4 py-2 bg-gray-200 rounded">戻る</button>
                    <button onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded">次へ</button>
                  </div>
                </div>
              </section>
            )}

            {step === 4 && (
              <section>
                <h2 className="font-semibold mb-3">経済圏（ポイント）</h2>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: "rakuten", label: "楽天経済圏" },
                    { key: "d", label: "dポイント経済圏" },
                    { key: "au", label: "au PAY / Ponta" },
                    { key: "paypay", label: "PayPay経済圏" },
                    { key: "none", label: "特になし" },
                  ].map((o) => (
                    <label key={o.key} className="flex items-center space-x-2">
                      <input type="checkbox" checked={answers.econ?.includes(o.key) || false} onChange={(e) => {
                        const prev = answers.econ || [];
                        if (e.target.checked) setAnswers({ ...answers, econ: [...prev, o.key] });
                        else setAnswers({ ...answers, econ: prev.filter(x => x !== o.key) });
                      }} />
                      <span>{o.label}</span>
                    </label>
                  ))}

                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-2">選択した経済圏での月あたりの利用額（代表値）</div>
                    <select value={answers.econSpend || ""} onChange={(e) => setAnswers({ ...answers, econSpend: Number(e.target.value) })} className="p-2 border rounded w-full">
                      <option value="">-- 選択 --</option>
                      <option value={3000}>〜3,000円</option>
                      <option value={5000}>3,000〜5,000円</option>
                      <option value={10000}>5,000〜10,000円</option>
                      <option value={20000}>10,000〜30,000円</option>
                      <option value={30000}>30,000円以上</option>
                    </select>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button onClick={prev} className="px-4 py-2 bg-gray-200 rounded">戻る</button>
                    <button onClick={() => computeResults()} className="px-4 py-2 bg-green-600 text-white rounded">診断する</button>
                  </div>
                </div>
              </section>
            )}

            {step === 5 && results && (
              <section>
                <h2 className="font-semibold mb-3">診断結果（上位3プラン）</h2>
                <div className="grid gap-4">
                  {results.map((r) => (
                    <div key={r.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">{r.carrier}</div>
                          <div className="text-lg font-bold">{r.plan}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-semibold">¥{r.price}</div>
                          <div className="text-sm text-gray-600">品質スコア: {r.quality}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">推定ポイント還元率: {(r.pointsRate * 100).toFixed(2)}%</div>
                      <div className="mt-2 text-sm text-gray-600">選ばれた理由: {explainChoice(r, phase1, answers)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex space-x-2">
                  <button onClick={() => { setResults(null); setStep(0); }} className="px-4 py-2 bg-gray-200 rounded">もう一度</button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function explainChoice(p: Plan, phase1: Phase1, answers: Answers) {
  const reasons: string[] = [];
  if (phase1.qualityPriority === "high" && p.quality >= 80) reasons.push("通信品質が高く、品質重視の条件に合います");
  if (answers.data && answers.data === "50+" && p.unlimited) reasons.push("大容量・無制限が必要な方に適しています");
  if (answers.family && p.supportsFamily) reasons.push("家族割が利用できるプランです");
  if (answers.set && p.supportsSet) reasons.push("光回線などのセット割が適用できます");
  if (phase1.includePoints && p.pointsRate > 0 && answers.econ && answers.econ.length) reasons.push("ポイント還元が多く、実質費用で有利になる可能性があります");
  if (reasons.length === 0) return "基本条件にマッチしたため候補に入りました";
  return reasons.join("。 ");
}
