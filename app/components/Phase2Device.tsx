"use client";
import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2DeviceProps {
  defaultValues?: Partial<Phase2Answers>;
  onAnswer: (answers: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Phase2Device({ defaultValues, onAnswer, onNext, onBack }: Phase2DeviceProps) {
  const [buyingDevice, setBuyingDevice] = useState<string | null>(defaultValues?.buyingDevice || null);
  const [devicePurchaseMethods, setDevicePurchaseMethods] = useState<string[]>(defaultValues?.devicePurchaseMethods || []);

  const handleNext = () => {
    onAnswer({
      buyingDevice,
      devicePurchaseMethods,
    });
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">⑥ 端末・購入形態</h2>
      {/* UIはここに追加 */}
      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">戻る</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">次へ</button>
      </div>
    </div>
  );
}
