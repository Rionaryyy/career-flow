"use client";

import { DiagnosisAnswers } from "@/types/types";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

export default function PriceBlock({ plan, answers }: Props) {
  const breakdown = plan.breakdown;
  const initialFee = breakdown.initialFeeMonthly ?? 0;

  const comparePeriod =
    answers.comparePeriod ??
    answers.phase1?.comparePeriod ??
    answers.phase2?.comparePeriod ??
    "";

  let months = 12;
  if (comparePeriod.includes("24m") || comparePeriod.includes("2年")) months = 24;
  else if (comparePeriod.includes("36m") || comparePeriod.includes("3年")) months = 36;

  return (
    <div className="mt-1 ml-1 text-sm text-gray-600 space-y-1">
      <p className="text-gray-700">
        💰 実質料金（初期費用込み）:
        <span className="font-semibold text-gray-800 ml-1">
          ¥{Math.round(plan.totalMonthly + initialFee).toLocaleString()} /月
        </span>
      </p>

      <p className="text-xs text-gray-500 ml-5">
        ※ 初期費用（月換算 ¥{initialFee.toLocaleString()}）を加算して算出
      </p>

      <div className="ml-1">
        <p className="text-gray-700">
          💸 キャッシュバック込み参考料金:
          <span className="font-semibold text-gray-800 ml-1">
            ¥{Math.round(
              plan.totalMonthly + (plan.breakdown.effectiveMonthlyAdjustment ?? 0)
            ).toLocaleString()}{" "}
            /月
          </span>
        </p>
        <p className="text-xs text-gray-500 ml-5">
          ※ 初期費用とキャッシュバックを反映（初期費用 - 還元）後の参考値
        </p>
      </div>

      <p className="text-xs text-gray-400 ml-5">
        （{months}ヶ月（
        {months === 12 ? "1年" : months === 24 ? "2年" : months === 36 ? "3年" : "未指定"}）
        で換算しています）
      </p>
    </div>
  );
}
