"use client";

import { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Call({ answers, onChange }: Props) {
  const [overseasUse, setOverseasUse] = useState<string | null>(answers.overseasUse || null);
  const [overseasPreference, setOverseasPreference] = useState<string | null>(answers.overseasPreference || null);
  const [dualSim, setDualSim] = useState<string | null>(answers.dualSim || null);
  const [specialUses, setSpecialUses] = useState<string[]>(answers.specialUses || []);

  useEffect(() => {
    onChange({ overseasUse, overseasPreference, dualSim, specialUses });
  }, [overseasUse, overseasPreference, dualSim, specialUses, onChange]);

  const toggleSpecialUse = (use: string) => {
    if (specialUses.includes(use)) {
      setSpecialUses(specialUses.filter((u) => u !== use));
    } else {
      setSpecialUses([...specialUses, use]);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 py-6 space-y-3">
      <h2 className="text-3xl font-bold text-center text-white mb-4">⑦ 海外利用・特殊ニーズ</h2>

      {/* Q12 海外利用予定 */}
      <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
        <p className="font-semibold text-white">1. 海外でスマホを利用する予定はありますか？</p>
        {[ "はい（短期旅行・年数回レベル）", "はい（長期滞在・留学・海外出張など）", "いいえ（国内利用のみ）" ].map((option) => (
          <label
            key={option}
            className={`flex items-center w-full cursor-pointer py-2 px-2 rounded-lg ${
              overseasUse === option ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
            }`}
          >
            <input
              type="radio"
              name="overseasUse"
              value={option}
              checked={overseasUse === option}
              onChange={(e) => setOverseasUse(e.target.value)}
              className="accent-blue-500 mr-2"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {/* Q12-2 海外利用希望 */}
      {overseasUse?.startsWith("はい") && (
        <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
          <p className="font-semibold text-white">2. 海外利用時の希望に近いものを選んでください</p>
          {[
            "海外でも日本と同じように通信したい（ローミング含め使い放題が希望）",
            "現地でSNSや地図だけ使えればOK（低速・少量でも可）",
            "必要に応じて現地SIMを使うので、特に希望はない",
          ].map((option) => (
            <label
              key={option}
              className={`flex items-center w-full cursor-pointer py-2 px-2 rounded-lg ${
                overseasPreference === option ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type="radio"
                name="overseasPreference"
                value={option}
                checked={overseasPreference === option}
                onChange={(e) => setOverseasPreference(e.target.value)}
                className="accent-blue-500 mr-2"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {/* Q13 デュアルSIM */}
      <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
        <p className="font-semibold text-white">3. デュアルSIM（2回線利用）を検討していますか？</p>
        {[
          "はい（メイン＋サブで使い分けたい）",
          "はい（海外用と国内用で使い分けたい）",
          "いいえ（1回線のみの予定）",
        ].map((option) => (
          <label
            key={option}
            className={`flex items-center w-full cursor-pointer py-2 px-2 rounded-lg ${
              dualSim === option ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
            }`}
          >
            <input
              type="radio"
              name="dualSim"
              value={option}
              checked={dualSim === option}
              onChange={(e) => setDualSim(e.target.value)}
              className="accent-blue-500 mr-2"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {/* Q14 特殊利用 */}
      <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
        <p className="font-semibold text-white">4. 特殊な利用目的がありますか？（複数選択可）</p>
        <div className="grid grid-cols-1 gap-1 w-full">
          {[
            "副回線として安価なプランを探している（メインとは別）",
            "法人契約または業務用利用を検討している",
            "子ども・高齢者向けなど家族のサブ回線用途",
            "IoT機器・見守り用など特殊用途",
            "特になし",
          ].map((use) => (
            <label
              key={use}
              className={`flex items-center w-full cursor-pointer py-2 px-2 rounded-lg ${
                specialUses.includes(use) ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={specialUses.includes(use)}
                onChange={() => toggleSpecialUse(use)}
                className="accent-blue-500 mr-2"
              />
              <span>{use}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
