"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2DeviceProps {
  onSubmit: (partial: Partial<Phase2Answers>) => void;
}

export default function Phase2Device({ onSubmit }: Phase2DeviceProps) {
  const [buyingDevice, setBuyingDevice] = useState<string | null>(null);
  const [devicePurchaseMethods, setDevicePurchaseMethods] = useState<string[]>([]);

  const handlePurchaseMethodsChange = (method: string) => {
    setDevicePurchaseMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      buyingDevice,
      devicePurchaseMethods,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">⑥ 端末・購入形態</h2>

      {/* Q9 */}
      <div>
        <p className="font-semibold">Q9. 新しい端末も一緒に購入する予定ですか？</p>
        <select
          value={buyingDevice ?? ""}
          onChange={(e) => setBuyingDevice(e.target.value)}
          className="w-full mt-2 border rounded p-2"
        >
          <option value="">選択してください</option>
          <option value="購入する">はい（端末も一緒に購入）</option>
          <option value="購入しない">いいえ（SIMのみ契約）</option>
        </select>
      </div>

      {/* Q9-2 */}
      {buyingDevice === "購入する" && (
        <div>
          <p className="font-semibold">Q9-2. 端末の購入方法として、近い考え方を選んでください（複数選択可）</p>
          <div className="space-y-2 mt-2">
            {[
              "正規ストア・家電量販店で本体のみ購入",
              "キャリアで通常購入",
              "キャリアで返却・交換プログラムを利用",
              "すべてのパターンを比較したい",
            ].map((method) => (
              <label key={method} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={devicePurchaseMethods.includes(method)}
                  onChange={() => handlePurchaseMethodsChange(method)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        次へ進む
      </button>
    </div>
  );
}
