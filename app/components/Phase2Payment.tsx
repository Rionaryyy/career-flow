"use client";

import { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Payment({ answers, onChange }: Props) {
  const [paymentMethods, setPaymentMethods] = useState<string[]>(answers.mainCard ? [answers.mainCard] : []);
  const [paymentTiming, setPaymentTiming] = useState<string | null>(answers.paymentTiming || null);

  const toggleMethod = (method: string) => {
    if (paymentMethods.includes(method)) {
      setPaymentMethods(paymentMethods.filter((m) => m !== method));
    } else {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  useEffect(() => {
    onChange({ mainCard: paymentMethods.join(", "), paymentTiming });
  }, [paymentMethods, paymentTiming, onChange]);

  return (
    <div className="w-full px-2 sm:px-4 py-6 space-y-4">
      <h2 className="text-3xl font-bold text-center text-white mb-4">⑧ 支払い方法</h2>

      {/* 支払い方法 */}
      <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
        <p className="text-xl font-semibold text-white text-center mb-2">1. 支払い方法（複数選択可）</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "クレジットカード",
            "デビットカード",
            "口座振替",
            "キャリア決済",
            "プリペイド・バンドルカード",
            "ポイント残高支払い",
            "その他（店舗支払いなど）",
          ].map((method) => (
            <label
              key={method}
              className={`flex items-center w-full cursor-pointer py-2 px-3 rounded-lg ${
                paymentMethods.includes(method) ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={paymentMethods.includes(method)}
                onChange={() => toggleMethod(method)}
                className="accent-blue-500 mr-2"
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
