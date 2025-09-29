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

  // 選択が変わるたびに親に反映
  useEffect(() => {
    onChange({
      mainCard: paymentMethods.join(", "),
      paymentTiming,
    });
  }, [paymentMethods, paymentTiming, onChange]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">⑧ 支払い方法</h2>

      <div>
        <p className="font-semibold mb-3">1. 支払い方法（複数選択可）</p>
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
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg ${
                paymentMethods.includes(method)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={paymentMethods.includes(method)}
                onChange={() => toggleMethod(method)}
                className="accent-blue-500"
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
