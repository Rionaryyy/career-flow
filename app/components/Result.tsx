"use client";

import { useMemo } from "react";
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { filterPlansByPhase2 } from "@/utils/filters/phase2FilterLogic";
import { allPlans } from "@/data/plans";
import { calculatePlanCost } from "../../utils/logic/calcEffectivePrice";

console.log("📦 [client] allPlans count:", allPlans?.length);
console.log("🪪 [client] first plan:", allPlans?.[0]?.planName);

interface PlanWithCost extends Plan {
  breakdown: {
    baseFee: number;
    callOptionFee: number;
    familyDiscount: number;
    studentDiscount: number;
    ageDiscount: number;
    economyDiscount: number;
    deviceDiscount: number;
    cashback: number;
    initialFeeMonthly: number;
    tetheringFee: number;
  };
  totalMonthly: number;
}

interface Props {
  answers: DiagnosisAnswers;
  filteredPlans: Plan[];
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: Props) {
  const rankedResults: PlanWithCost[] = useMemo(() => {
    console.groupCollapsed("🧩 [Result Calculation Start]");
    console.log("🟦 Phase1 Answers:", answers.phase1);
    console.log("🟩 Phase2 Answers:", answers.phase2);

    // ✅ 1. Phase1・Phase2の条件が空なら全プラン通過
    let result: Plan[] = [...allPlans];

    if (answers.phase1 && Object.values(answers.phase1).some(v => v)) {
      result = filterPlansByPhase1(answers.phase1, result);
    }
    if (answers.phase2 && Object.values(answers.phase2).some(v => v)) {
      result = filterPlansByPhase2(answers.phase2, result);
    }

    console.log("✅ After Filtering:", result.map(p => p.planName));

    // ✅ 2. 各プランの料金計算
    const withCosts: PlanWithCost[] = result.map(plan => {
      const cost = calculatePlanCost(plan, answers);
      return {
        ...plan,
        breakdown: {
          baseFee: cost.baseFee ?? 0,
          callOptionFee: cost.callOptionFee ?? 0,
          familyDiscount: cost.familyDiscount ?? 0,
          studentDiscount: cost.studentDiscount ?? 0,
          ageDiscount: cost.ageDiscount ?? 0,
          economyDiscount: cost.economyDiscount ?? 0,
          deviceDiscount: cost.deviceDiscount ?? 0,
          cashback: cost.cashback ?? 0,
          initialFeeMonthly: cost.initialFeeMonthly ?? 0,
          tetheringFee: cost.tetheringFee ?? 0,
        },
        totalMonthly: cost.total ?? 0,
      };
    });

    console.log("📊 Final Results Count:", withCosts.length);
    console.groupEnd();

    return withCosts.sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [answers.phase1, answers.phase2]);

  // === 以下はUI部分は変更不要 ===
  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">
        診断結果
      </h1>

      <pre className="text-xs bg-gray-100 text-gray-700 p-3 rounded mb-4 overflow-x-auto">
        {JSON.stringify(answers.phase1 ?? {}, null, 2)}
      </pre>
      <pre className="text-xs bg-gray-50 text-gray-700 p-3 rounded mb-4 overflow-x-auto">
        {JSON.stringify(answers.phase2 ?? {}, null, 2)}
      </pre>

      {rankedResults.length === 0 ? (
        <>
          <p className="text-center text-gray-600">
            条件に一致するプランが見つかりませんでした。
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            ※ 条件が厳しすぎるか、回答データが未反映の可能性があります。
          </p>
        </>
      ) : (
        <div className="space-y-6">
          {rankedResults.map((plan, index) => (
            <div
              key={plan.planId ?? index}
              className="p-5 rounded-2xl border border-sky-200 bg-white shadow-sm"
            >
              <h2 className="text-xl font-semibold text-sky-800">
                {index + 1}. {plan.planName}
              </h2>
              <p className="text-gray-500 text-sm">{plan.carrier}</p>
              <p className="text-2xl font-bold mt-2">
                ¥{plan.totalMonthly.toLocaleString()}
                <span className="text-sm text-gray-500 ml-1">
                  /月（税込・概算）
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
