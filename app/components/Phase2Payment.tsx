"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";
import { Button } from "@/components/ui/button";

interface Props {
  defaultValues: Phase2Answers;
  onNext: (data: Partial<Phase2Answers>) => void;
  onBack: () => void;
}

const paymentOptions = [
  "クレジットカード（楽天カード / dカード / au PAY カード / PayPayカード など）",
  "デビットカード",
  "銀行口座引き落とし",
  "プリペイドカード / チャージ式決済",
  "その他 / 特になし",
];

export default function Phase2Payment({ defaultValues, onNext, onBack }: Props) {
  const [paymentMethods, setPaymentMethods] = useState<string[]>(defaultValues.paymentMethods || []);

  const togglePayment = (option: string) => {
    if (paymentMethods.includes(option)) {
      setPaymentMethods(paymentMethods.filter(o => o !== option));
    } else {
      setPaymentMethods([...paymentMethods, option]);
    }
  };

  const handleSubmit = () => {
    onNext({ paymentMethods });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">⑧ 通信料金の支払い方法</h2>

      <div>
        <p className="font-semibold mb-2">1. 通信料金の支払いに利用予定の方法を選んでください（複数選択可）</p>
        {paymentOptions.map(opt => (
          <label key={opt} className="block">
            <input
              type="checkbox"
              value={opt}
              checked={paymentMethods.includes(opt)}
              onChange={() => togglePayment(opt)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={onBack}>戻る</Button>
        <Button onClick={handleSubmit}>診断結果を見る</Button>
      </div>
    </div>
  );
}
