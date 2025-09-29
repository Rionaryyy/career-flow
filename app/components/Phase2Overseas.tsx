"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}


export default function Phase2Call({ answers, onChange }: Props) {

  const [overseasUse, setOverseasUse] = useState<string | null>(null);
  const [overseasPreference, setOverseasPreference] = useState<string | null>(null);
  const [dualSim, setDualSim] = useState<string | null>(null);
  const [specialUses, setSpecialUses] = useState<string[]>([]);

  const toggleSpecialUse = (use: string) => {
    if (specialUses.includes(use)) {
      setSpecialUses(specialUses.filter((u) => u !== use));
    } else {
      setSpecialUses([...specialUses, use]);
    }
  };

  const handleNext = () => {
    onChange({
      overseasUse,
      overseasPreference,
      dualSim,
      specialUses,
    });
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">⑦ 海外利用・特殊ニーズ</h2>

      {/* Q12 海外利用予定 */}
      <div>
        <p className="font-semibold mb-3">1. 海外でスマホを利用する予定はありますか？</p>
        <div className="space-y-2">
          {[
            "はい（短期旅行・年数回レベル）",
            "はい（長期滞在・留学・海外出張など）",
            "いいえ（国内利用のみ）",
          ].map((option) => (
            <label
              key={option}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg ${
                overseasUse === option ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type="radio"
                name="overseasUse"
                value={option}
                checked={overseasUse === option}
                onChange={(e) => setOverseasUse(e.target.value)}
                className="accent-blue-500"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Q12-2 海外利用時の希望 */}
      {overseasUse?.startsWith("はい") && (
        <div>
          <p className="font-semibold mb-3">2. 海外利用時の希望に近いものを選んでください</p>
          <div className="space-y-2">
            {[
              "海外でも日本と同じように通信したい（ローミング含め使い放題が希望）",
              "現地でSNSや地図だけ使えればOK（低速・少量でも可）",
              "必要に応じて現地SIMを使うので、特に希望はない",
            ].map((option) => (
              <label
                key={option}
                className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg ${
                  overseasPreference === option
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="overseasPreference"
                  value={option}
                  checked={overseasPreference === option}
                  onChange={(e) => setOverseasPreference(e.target.value)}
                  className="accent-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Q13 デュアルSIM */}
      <div>
        <p className="font-semibold mb-3">3. デュアルSIM（2回線利用）を検討していますか？</p>
        <div className="space-y-2">
          {[
            "はい（メイン＋サブで使い分けたい）",
            "はい（海外用と国内用で使い分けたい）",
            "いいえ（1回線のみの予定）",
          ].map((option) => (
            <label
              key={option}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg ${
                dualSim === option ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type="radio"
                name="dualSim"
                value={option}
                checked={dualSim === option}
                onChange={(e) => setDualSim(e.target.value)}
                className="accent-blue-500"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Q14 特殊な利用目的（複数選択） */}
      <div>
        <p className="font-semibold mb-3">4. 特殊な利用目的がありますか？（複数選択可）</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "副回線として安価なプランを探している（メインとは別）",
            "法人契約または業務用利用を検討している",
            "子ども・高齢者向けなど家族のサブ回線用途",
            "IoT機器・見守り用など特殊用途",
            "特になし",
          ].map((use) => (
            <label
              key={use}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg ${
                specialUses.includes(use) ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={specialUses.includes(use)}
                onChange={() => toggleSpecialUse(use)}
                className="accent-blue-500"
              />
              <span>{use}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!overseasUse || !dualSim}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}
