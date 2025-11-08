"use client";

import { DiagnosisAnswers } from "@/types/types";
import {
  PriceBlock,
  DiscountBlock,
  SubscriptionBlock,
  InitialFeeBlock,
  DeviceBlock,
   PointRewardBlock, 
} from "./blocks";

interface Props {
  plan: any;
  index: number;
  answers: DiagnosisAnswers;
}

export default function ResultCard({ plan, index, answers }: Props) {
  return (
    <div className="p-5 rounded-2xl border border-sky-200 bg-white shadow-sm">
      {/* 🧩 プランタイトル */}
      <h2 className="text-xl font-semibold text-sky-800">
        {index + 1}. {plan.planName}
      </h2>
      <p className="text-gray-500 text-sm">{plan.carrier}</p>

      {/* 💰 各情報ブロック */}
      <PriceBlock plan={plan} answers={answers} />
      <DiscountBlock plan={plan} answers={answers} />
      <SubscriptionBlock plan={plan} answers={answers} />
      <InitialFeeBlock plan={plan} answers={answers} />
      <DeviceBlock plan={plan} answers={answers} />
    </div>
  );
}
