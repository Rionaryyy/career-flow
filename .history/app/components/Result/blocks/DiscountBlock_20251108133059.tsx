"use client";

import { DiagnosisAnswers } from "@/types/types";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

export default function DiscountBlock({ plan }: Props) {
  const b = plan.breakdown;

  return (
    <div className="mt-4 text-sm text-gray-700">
      <p>・基本料金: ¥{b.baseFee}</p>
      <p>・通話オプション: +¥{b.callOptionFee}</p>
      <p>・家族割引: -¥{b.familyDiscount}</p>
      <p>・学割: -¥{b.studentDiscount}</p>
      <p>・年齢割: -¥{b.ageDiscount}</p>
      <p>・テザリング料: +¥{b.tetheringFee}</p>
    </div>
  );
}
