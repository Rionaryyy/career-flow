"use client";

import React from "react";
import { DiagnosisAnswers } from "../types/types";

type Props = {
  answers: DiagnosisAnswers;
  restart: () => void;
};

export default function Result({ answers, restart }: Props) {
  const { phase1, phase2 } = answers;

  // シンプルなルールベースのダミー診断（MVP）
  const recommendations = (() => {
    const list: { name: string; reason: string }[] = [];

    // まず品質重視 → 大手
    if (phase1.networkQuality === "high") {
      list.push({ name: "大手キャリア（例：ドコモ）", reason: "通信品質が最優先のため、大手を推奨" });
    }

    // ポイント考慮かつ経済圏重め → 経済圏に強いキャリア
    if (phase1.considerPoints && phase2.ecosystemUsage === "heavy") {
      list.push({ name: "経済圏重視キャリア（例：楽天）", reason: "ポイント還元を重視しているため" });
    }

    // データ多めなら無制限や大容量プランを持つキャリア
    if ((phase2.monthlyData ?? 0) >= 20) {
      list.push({ name: "大容量プラン推奨（例：サブブランド含む）", reason: "大容量データが必要" });
    }

    // 通話多めならかけ放題推奨
    if (phase2.callFrequency === "often") {
      list.push({ name: "かけ放題重視キャリア", reason: "通話が多いため" });
    }

    // 家族割が使えるなら家族割を提供するキャリアを候補に（簡易）
    if (phase2.familyDiscount) {
      list.push({ name: "家族割が手厚いキャリア", reason: "家族割でお得になる可能性あり" });
    }

    // 足りない場合は、候補を埋める（デフォルト候補）
    if (list.length === 0) {
      list.push({ name: "コスト重視の格安SIM例", reason: "コスト重視の選択肢" });
      list.push({ name: "バランス型（サブブランド）", reason: "安定とコストのバランス" });
    }

    // 先頭3件を返す
    return list.slice(0, 3);
  })();

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">診断結果</h2>

      <div className="mb-4">
        <h3 className="font-semibold">あなたの回答（フェーズ①）</h3>
        <pre className="bg-slate-50 p-3 rounded mt-2">{JSON.stringify(phase1, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">あなたの回答（フェーズ②）</h3>
        <pre className="bg-slate-50 p-3 rounded mt-2">{JSON.stringify(phase2, null, 2)}</pre>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold">おすすめ候補（上位3）</h3>
        <ol className="mt-3 space-y-3">
          {recommendations.map((r, i) => (
            <li key={i} className="p-3 border rounded">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-slate-600">{r.reason}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-3">
        <button onClick={restart} className="px-4 py-2 bg-blue-600 text-white rounded">
          最初に戻る
        </button>
      </div>
    </div>
  );
}
