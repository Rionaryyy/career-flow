"use client";

import { useState } from "react";
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

  const handleNext = () => {
    onChange({
      devicePreference: buyingDevice,
      oldDevicePlan: devicePurchaseMethods.join(", "),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">⑥ 端末・購入形態</h2>

      <div>
        <p className="font-semibold mb-3">1. 新しい端末も一緒に購入する予定ですか？</p>
        {["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"].map((option) => (
          <label
            key={option}
            className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg ${
              buyingDevice === option ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
            }`}
          >
            <input
              type="radio"
              name="buyingDevice"
              value={option}
              checked={buyingDevice === option}
              onChange={(e) => setBuyingDevice(e.target.value)}
              className="accent-blue-500"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      {buyingDevice === "はい（端末も一緒に購入する）" && (
        <div>
          <p className="font-semibold mb-3">2. 端末の購入方法（複数選択可）</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Appleなど正規ストア・家電量販店で本体のみ購入したい",
              "キャリアで端末を購入したい（通常購入）",
              "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
              "どれが最もお得か分からないので、すべてのパターンを比較したい",
            ].map((method) => (
              <label
                key={method}
                className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg ${
                  devicePurchaseMethods.includes(method)
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={devicePurchaseMethods.includes(method)}
                  onChange={() => toggleMethod(method)}
                  className="accent-blue-500"
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!buyingDevice || (buyingDevice === "はい（端末も一緒に購入する）" && devicePurchaseMethods.length === 0)}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}
