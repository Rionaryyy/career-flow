"use client";

import { useState, useEffect } from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Device({ answers, onChange }: Props) {
  const [buyingDevice, setBuyingDevice] = useState<string | null>(answers.devicePreference || null);
  const [devicePurchaseMethods, setDevicePurchaseMethods] = useState<string[]>(answers.oldDevicePlan ? [answers.oldDevicePlan] : []);

  const toggleMethod = (method: string) => {
    if (devicePurchaseMethods.includes(method)) {
      setDevicePurchaseMethods(devicePurchaseMethods.filter((m) => m !== method));
    } else {
      setDevicePurchaseMethods([...devicePurchaseMethods, method]);
    }
  };

  useEffect(() => {
    onChange({
      devicePreference: buyingDevice,
      oldDevicePlan: devicePurchaseMethods.join(", "),
    });
  }, [buyingDevice, devicePurchaseMethods, onChange]);

  return (
    <div className="w-full px-2 sm:px-4 py-6 space-y-4">
      <h2 className="text-3xl font-bold text-center text-white mb-4">⑥ 端末・購入形態</h2>

      {/* 新端末購入 */}
      <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
        <p className="text-xl font-semibold text-white text-center mb-2">1. 新しい端末も一緒に購入する予定ですか？</p>
        {["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"].map((option) => (
          <label
            key={option}
            className={`flex items-center w-full cursor-pointer py-2 px-3 rounded-lg ${
              buyingDevice === option ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
            }`}
          >
            <input
              type="radio"
              name="buyingDevice"
              value={option}
              checked={buyingDevice === option}
              onChange={(e) => setBuyingDevice(e.target.value)}
              className="accent-blue-500 mr-2"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {/* 端末購入方法 */}
      {buyingDevice === "はい（端末も一緒に購入する）" && (
        <div className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
          <p className="text-xl font-semibold text-white text-center mb-2">2. 端末の購入方法（複数選択可）</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Appleなど正規ストア・家電量販店で本体のみ購入したい",
              "キャリアで端末を購入したい（通常購入）",
              "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
              "どれが最もお得か分からないので、すべてのパターンを比較したい",
            ].map((method) => (
              <label
                key={method}
                className={`flex items-center w-full cursor-pointer py-2 px-3 rounded-lg ${
                  devicePurchaseMethods.includes(method) ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={devicePurchaseMethods.includes(method)}
                  onChange={() => toggleMethod(method)}
                  className="accent-blue-500 mr-2"
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
