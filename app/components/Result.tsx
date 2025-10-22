"use client";

import { useMemo } from "react";
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { filterPlansByPhase2 } from "@/utils/filters/phase2FilterLogic";
import { allPlans } from "@/data/plans";
import { calculatePlanCost } from "../../utils/logic/calcEffectivePrice";

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
    console.log("📞 選択された通話プランタイプ:", answers.phase2?.callPlanType);
    console.log("📞 時間制限:", answers.phase2?.timeLimitPreference);
    console.log("📞 月間制限:", answers.phase2?.monthlyLimitPreference);
    console.log("📞 ハイブリッド:", answers.phase2?.hybridCallPreference);

    // ⚠️ answers未定義対策
    if (!answers?.phase2 || !answers.phase2.callPlanType) {
      console.warn("🚫 phase2またはcallPlanTypeが未定義 → フィルターをスキップします");
      console.groupEnd();
      return [];
    }

    // 🔹 1. Phase1でフィルター
    let afterPhase1 = filterPlansByPhase1(answers.phase1, allPlans);
    console.log("✅ After Phase1:", afterPhase1.map((p) => p.carrier));

    // 🔹 2. Phase2でフィルター
    let afterPhase2 = filterPlansByPhase2(answers.phase2, afterPhase1);
    console.log("✅ After Phase2:", afterPhase2.map((p) => p.carrier));

    // 🔹 3. 各プランの料金計算
    const withCosts: PlanWithCost[] = afterPhase2.map((plan) => {
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

    console.log(
      "📊 Final Results Count:",
      withCosts.length,
      withCosts.map((p) => `${p.carrier} (${p.callType})`)
    );
    console.groupEnd();

    // 💰 安い順に並べ替え
    return withCosts.sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [answers.phase1, answers.phase2]); // ←依存配列修正済み

  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">
        診断結果
      </h1>

      {/* 🧩 デバッグ用に回答内容出力 */}
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
            ブラウザのコンソールに「Phase2 Answers」をご確認ください。
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

              <div className="mt-3 text-sm text-gray-700 space-y-0.5">
                <p>基本料金：¥{plan.breakdown.baseFee}</p>
                {plan.breakdown.callOptionFee > 0 && (
                  <p>通話オプション：＋¥{plan.breakdown.callOptionFee}</p>
                )}
                {plan.breakdown.familyDiscount > 0 && (
                  <p>家族割：−¥{plan.breakdown.familyDiscount}</p>
                )}
                {plan.breakdown.studentDiscount > 0 && (
                  <p>学割：−¥{plan.breakdown.studentDiscount}</p>
                )}
                {plan.breakdown.ageDiscount > 0 && (
                  <p>年齢割：−¥{plan.breakdown.ageDiscount}</p>
                )}
                {plan.breakdown.economyDiscount > 0 && (
                  <p>経済圏割：−¥{plan.breakdown.economyDiscount}</p>
                )}
                {plan.breakdown.deviceDiscount > 0 && (
                  <p>端末割引：−¥{Math.round(plan.breakdown.deviceDiscount)}</p>
                )}
                {plan.breakdown.cashback > 0 && (
                  <p>
                    キャッシュバック換算：−¥
                    {Math.round(plan.breakdown.cashback)}
                  </p>
                )}
                {plan.breakdown.initialFeeMonthly > 0 && (
                  <p>
                    初期費用（月平均）：＋¥
                    {Math.round(plan.breakdown.initialFeeMonthly)}
                  </p>
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
