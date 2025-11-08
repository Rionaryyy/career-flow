"use client";

import { DiagnosisAnswers } from "@/types/types";
import { 
  PriceBlock, 
  DiscountBlock, 
  CampaignBlock, 
  DeviceBlock 
} from "./blocks";  // ✅ ← 相対パスから絶対パスに修正

interface Props {
  plan: any;
  index: number;
  answers: DiagnosisAnswers;
}

export default function ResultCard({ plan, index, answers }: Props) {
  return (
    <div className="p-5 rounded-2xl border border-sky-200 bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-sky-800">
        {index + 1}. {plan.planName}
      </h2>
      <p className="text-gray-500 text-sm">{plan.carrier}</p>

      <PriceBlock plan={plan} answers={answers} />
      <DiscountBlock plan={plan} answers={answers} />
      <CampaignBlock plan={plan} answers={answers} />
      <DeviceBlock plan={plan} answers={answers} />
    </div>
  );
}
