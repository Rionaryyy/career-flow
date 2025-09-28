"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";
import { Button } from "@/components/ui/button";

interface Props {
  defaultValues: Phase2Answers;
  onNext: (data: Partial<Phase2Answers>) => void;
  onBack: () => void;
}

const specialUseOptions = [
  "副回線として安価なプランを探している（メインとは別）",
  "法人契約または業務用利用を検討している",
  "子ども・高齢者向けなど家族のサブ回線用途",
  "IoT機器・見守り用など特殊用途",
  "特になし",
];

export default function Phase2Overseas({ defaultValues, onNext, onBack }: Props) {
  const [overseasUse, setOverseasUse] = useState(defaultValues.overseasUse);
  const [overseasPreference, setOverseasPreference] = useState(defaultValues.overseasPreference);
  const [dualSim, setDualSim] = useState(defaultValues.dualSim);
  const [specialUses, setSpecialUses] = useState<string[]>(defaultValues.specialUses || []);

  const toggleSpecialUse = (option: string) => {
    if (specialUses.includes(option)) {
      setSpecialUses(specialUses.filter(o => o !== option));
    } else {
      if (option === "特になし") {
        setSpecialUses(["特になし"]);
      } else {
        setSpecialUses(specialUses.filter(o => o !== "特になし").concat(option));
      }
    }
  };

  const handleSubmit = () => {
    onNext({ overseasUse, overseasPreference, dualSim, specialUses });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">⑦ 海外利用・特殊ニーズ</h2>

      <div className="space-y-6">
        <div>
          <p className="font-semibold mb-2">1. 海外でスマホを利用する予定はありますか？</p>
          {["はい（短期旅行・年数回レベル）", "はい（長期滞在・留学・海外出張など）", "いいえ（国内利用のみ）"].map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="overseasUse"
                value={opt}
                checked={overseasUse === opt}
                onChange={(e) => setOverseasUse(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        {overseasUse && overseasUse !== "いいえ（国内利用のみ）" && (
          <div>
            <p className="font-semibold mb-2">2. 海外利用時の希望に近いものを選んでください</p>
            {[
              "海外でも日本と同じように通信したい（ローミング含め使い放題が希望）",
              "現地でSNSや地図だけ使えればOK（低速・少量でも可）",
              "必要に応じて現地SIMを使うので、特に希望はない",
            ].map(opt => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name="overseasPreference"
                  value={opt}
                  checked={overseasPreference === opt}
                  onChange={(e) => setOverseasPreference(e.target.value)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        <div>
          <p className="font-semibold mb-2">3. デュアルSIM（2回線利用）を検討していますか？</p>
          {["はい（メイン＋サブで使い分けたい）", "はい（海外用と国内用で使い分けたい）", "いいえ（1回線のみの予定）"].map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name="dualSim"
                value={opt}
                checked={dualSim === opt}
                onChange={(e) => setDualSim(e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <div>
          <p className="font-semibold mb-2">4. 特殊な利用目的がありますか？（複数選択可）</p>
          {specialUseOptions.map(opt => (
            <label key={opt} className="block">
              <input
                type="checkbox"
                value={opt}
                checked={specialUses.includes(opt)}
                onChange={() => toggleSpecialUse(opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={onBack}>戻る</Button>
        <Button onClick={handleSubmit}>次へ進む</Button>
      </div>
    </div>
  );
}
