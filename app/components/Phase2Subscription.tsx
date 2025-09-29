"use client";

import { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Subscription({ answers, onChange }: Props) {
  const [subs, setSubs] = useState<string[]>(answers.subscriptionServices || []);
  const [subsDiscountPreference, setSubsDiscountPreference] = useState<string | null>(answers.subscriptionMonthly || null);

  const services = [
    "Netflix",
    "Amazon Prime",
    "YouTube Premium",
    "Apple Music",
    "Disney+",
    "LINE MUSIC",
    "DAZN",
    "DMM TV / DMMプレミアム",
    "Spotify",
    "ABEMA プレミアム",
    "U-NEXT",
    "TELASA（テラサ）",
    "特になし",
  ];

  const toggleSub = (service: string) => {
    if (subs.includes(service)) {
      setSubs(subs.filter((s) => s !== service));
    } else {
      if (service === "特になし") setSubs(["特になし"]);
      else setSubs(subs.filter((s) => s !== "特になし").concat(service));
    }
  };

  // answers を親に同期
  useEffect(() => {
    onChange({
      subscriptionServices: subs,
      subscriptionMonthly: subsDiscountPreference,
    });
  }, [subs, subsDiscountPreference, onChange]);

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">⑤ サブスク利用状況</h2>
      <div>
        <p className="font-semibold mb-3">契約中または契約予定のサブスクサービスを選択（複数可）</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {services.map((service) => (
            <label
              key={service}
              className={`flex items-center space-x-2 border rounded-lg px-3 py-2 cursor-pointer ${
                subs.includes(service) ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={subs.includes(service)}
                onChange={() => toggleSub(service)}
                className="form-checkbox accent-blue-500"
              />
              <span>{service}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
