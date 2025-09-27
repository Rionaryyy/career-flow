// app/components/Result.tsx
"use client";

import React from "react";
import { DiagnosisAnswers } from "@/types/types";

type ResultProps = {
  answers: DiagnosisAnswers;
  onRestart?: () => void;
};

export default function Result({ answers, onRestart }: ResultProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">🔎 診断結果（暫定）</h2>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-lg font-semibold text-white mb-3">フェーズ①：前提条件</p>
        <ul className="text-gray-200 space-y-2">
          <li>ポイント還元含める？： {answers.phase1.includePoints ?? "未選択"}</li>
          <li>通信品質の重視度： {answers.phase1.networkQuality ?? "未選択"}</li>
          <li>キャリアの種類： {answers.phase1.carrierType ?? "未選択"}</li>
          <li>サポート： {answers.phase1.supportPreference ?? "未選択"}</li>
          <li>契約縛り： {answers.phase1.contractLockPreference ?? "未選択"}</li>
        </ul>
      </div>

      <div className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-lg font-semibold text-white mb-3">フェーズ②：利用シーン詳細</p>
        <ul className="text-gray-200 space-y-2">
          <li>月データ量： {answers.phase2.dataUsage ?? "未選択"}</li>
          <li>速度制限の重視： {answers.phase2.speedLimitImportance ?? "未選択"}</li>
          <li>テザリング： {answers.phase2.tetheringNeeded ?? "未選択"}</li>
          <li>テザリング使用量： {answers.phase2.tetheringUsage ?? "未選択"}</li>
          <li>通話頻度： {answers.phase2.callFrequency ?? "未選択"}</li>
          <li>通話優先度： {answers.phase2.callPriority ?? "未選択"}</li>
          <li>家族割回線数： {answers.phase2.familyLines ?? "未選択"}</li>
          <li>経済圏： {answers.phase2.ecosystem ?? "未選択"} / 月間利用： {answers.phase2.ecosystemMonthly ?? "未選択"}</li>
          <li>サブスク： {(answers.phase2.subs && answers.phase2.subs.length > 0) ? answers.phase2.subs.join(", ") : "未選択"}</li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-6 py-2 rounded-full bg-slate-600 hover:bg-slate-500 text-white"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
