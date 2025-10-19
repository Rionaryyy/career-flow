"use client";

import { useMemo } from "react";
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { filterPlansByPhase2 } from "@/utils/filters/phase2FilterLogic";
import { allPlans } from "@/data/plans";
import { calculatePlanCost } from "@/utils/logic/priceLogic"; // 🟩 追加

interface Props {
  answers: DiagnosisAnswers;
  filteredPlans: any[];
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: Props) {
  const all: Plan[] = allPlans;

  const rankedResults = useMemo(() => {
    // 🟦 フィルター処理（フェーズ①＆②）
    let result = filterPlansByPhase1(answers.phase1, all);
    result = filterPlansByPhase2(answers.phase2, result);

    // 🟦 各プランの実質月額を算出
    const withCosts = result.map(plan => {
      const cost = calculatePlanCost(plan, answers);
      return {
        ...plan,
        breakdown: cost,
        totalMonthly: cost.total,
      };
    });

    // 🟦 実質月額でソート
    return withCosts.sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [answers, all]);

  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">診断結果</h1>

      {/* 🧩 Debug: Phase2の回答確認 */}
      <pre className="text-xs bg-gray-100 text-gray-700 p-3 rounded mb-4 overflow-x-auto">
        {JSON.stringify(answers.phase2, null, 2)}
      </pre>

      {rankedResults.length === 0 ? (
        <p className="text-center text-gray-600">
          条件に一致するプランが見つかりませんでした。
        </p>
      ) : (
        <div className="space-y-6">
          {rankedResults.map((plan: any, index: number) => (
            <div
              key={plan.planId ?? index}
              className="p-5 rounded-2xl border border-sky-200 bg-white shadow-sm"
            >
              {/* 🟦 プラン情報 */}
              <h2 className="text-xl font-semibold text-sky-800">
                {index + 1}. {plan.planName}
              </h2>
              <p className="text-gray-500 text-sm">{plan.carrier}</p>

              {/* 🟦 実質月額 */}
              <p className="text-2xl font-bold mt-2">
                ¥{plan.totalMonthly.toLocaleString()}
                <span className="text-sm text-gray-500 ml-1">/月（税込・概算）</span>
              </p>

              {/* 🟦 内訳 */}
              <div className="mt-3 text-sm text-gray-700 space-y-0.5">
                <p>基本料金：¥{plan.breakdown.baseFee}</p>
                {plan.breakdown.familyDiscount > 0 && (
                  <p>家族割：−¥{plan.breakdown.familyDiscount}</p>
                )}
                {plan.breakdown.studentDiscount > 0 && (
                  <p>学割：−¥{plan.breakdown.studentDiscount}</p>
                )}
                {plan.breakdown.economyDiscount > 0 && (
                  <p>経済圏割：−¥{plan.breakdown.economyDiscount}</p>
                )}
                {plan.breakdown.deviceDiscount > 0 && (
                  <p>端末割引：−¥{Math.round(plan.breakdown.deviceDiscount)}</p>
                )}
                {plan.breakdown.cashback > 0 && (
                  <p>キャッシュバック換算：−¥{Math.round(plan.breakdown.cashback)}</p>
                )}
                {plan.breakdown.initialFeeMonthly > 0 && (
                  <p>初期費用（月平均）：＋¥{Math.round(plan.breakdown.initialFeeMonthly)}</p>
                )}
                {plan.breakdown.tetheringFee > 0 && (
                  <p>テザリング利用料：＋¥{plan.breakdown.tetheringFee}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 text-white font-semibold shadow-md hover:from-sky-300 hover:to-sky-400 transition-all"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
