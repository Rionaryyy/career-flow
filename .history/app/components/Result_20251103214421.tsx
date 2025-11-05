"use client";

import { useMemo } from "react";
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { filterPlansByPhase2 } from "@/utils/filters/phase2FilterLogic";
import { allPlansWithDevices as allPlans } from "@/data/plans";
import { calculatePlanCost } from "@/utils/logic/calcEffectivePrice";

console.log("📦 Using calculatePlanCost from:", calculatePlanCost.toString().slice(0, 200));
console.log("🧩 Using calculatePlanCost from:", calculatePlanCost);

// 👇この行のすぐ下に1行だけ追加して確認
console.log("🧩 Using calculatePlanCost imported from:", calculatePlanCost.toString());

interface PlanWithCost extends Plan {
  breakdown: {
    baseFee: number;
    callOptionFee: number;
    familyDiscount: number;
    studentDiscount: number;
    ageDiscount: number;
    cashback: number;
    initialFeeMonthly: number;
    tetheringFee: number;
    deviceLeaseMonthly?: number;
    deviceBuyMonthly?: number;
    fiberDiscount?: number;
    routerDiscount?: number;
    pocketWifiDiscount?: number;
    electricDiscount?: number;
    gasDiscount?: number;
    subscriptionDiscount?: number;
    paymentDiscount?: number;
    paymentReward?: number;
    shoppingReward?: number;
    pointReward?: number;
    cashbackTotal?: number;
    initialCostTotal?: number;
    deviceTotal?: number;
    internationalCallFee?: number; // 🆕 国際通話オプション追加
    voicemailFee?: number; // 🆕 留守番電話オプション追加
    fiberBaseFee?: number; // 🆕 光回線参考月額
    routerBaseFee?: number; // 🆕 ルーター参考月額
    pocketWifiBaseFee?: number; // 🆕 ポケットWi-Fi参考月額
    carrierBarcodeReward?: number;
    carrierShoppingReward?: number;
    totalCarrierReward?: number;
    effectiveReward?: number;
    subscriptionReward?: number; // 🆕 サブスク還元
    subscriptionBaseFee?: number;
    subscriptionDetails?: {
      name: string;
      basePrice: number;
      discount?: number;
      reward?: number;
    }[];
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

    let result: Plan[] = [...allPlans];

    if (answers.phase1 && Object.values(answers.phase1).some(v => v)) {
      result = filterPlansByPhase1(answers.phase1, result);
    }

    if (answers.phase2) {
      result = filterPlansByPhase2(answers.phase2, result);
    }

    console.log("✅ Filtered result count:", result.length);

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
          cashback: cost.cashback ?? 0,
          initialFeeMonthly: cost.initialFeeMonthly ?? 0,
          tetheringFee: cost.tetheringFee ?? 0,
          deviceLeaseMonthly: cost.deviceLeaseMonthly ?? 0,
          deviceBuyMonthly: cost.deviceBuyMonthly ?? 0,
          fiberDiscount: cost.fiberDiscount ?? 0,
          routerDiscount: cost.routerDiscount ?? 0,
          pocketWifiDiscount: cost.pocketWifiDiscount ?? 0,
          electricDiscount: cost.electricDiscount ?? 0,
          gasDiscount: cost.gasDiscount ?? 0,
          subscriptionDiscount: cost.subscriptionDiscount ?? 0,
          subscriptionReward: cost.subscriptionReward ?? 0,
          subscriptionDetails: cost.subscriptionDetails ?? [],
          subscriptionBaseFee: cost.subscriptionBaseFee ?? 0,
          paymentDiscount: cost.paymentDiscount ?? 0,
          paymentReward: cost.paymentReward ?? 0,
          shoppingReward: cost.shoppingReward ?? 0,
          pointReward: cost.pointReward ?? 0,
          cashbackTotal: cost.cashbackTotal ?? plan.cashbackAmount ?? 0,
          initialCostTotal: cost.initialCostTotal ?? plan.initialCost ?? 0,
          deviceTotal:
            ((cost.deviceBuyMonthly ?? 0) * 24) ||
            ((cost.deviceLeaseMonthly ?? 0) * 24) ||
            (plan.deviceProgram?.totalPayment ?? 0),
          internationalCallFee: cost.internationalCallFee ?? 0,
          voicemailFee: cost.voicemailFee ?? 0,
          fiberBaseFee: cost.fiberBaseFee ?? 0,
          routerBaseFee: cost.routerBaseFee ?? 0,
          pocketWifiBaseFee: cost.pocketWifiBaseFee ?? 0,
          carrierBarcodeReward: cost.carrierBarcodeReward ?? 0,
          carrierShoppingReward: cost.carrierShoppingReward ?? 0,
          totalCarrierReward: cost.totalCarrierReward ?? 0,
          effectiveReward: cost.effectiveReward ?? 0,
        },
        totalMonthly: cost.total ?? 0,
      };
    });

    console.groupEnd();
    return withCosts.sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [answers.phase1, answers.phase2]);

  const handleRestart = () => {
    localStorage.removeItem("careerFlowAnswers");
    console.log("🧹 診断データをリセットしました");
    onRestart();
  };

  console.log("📦 Phase2 Debug in Result:", JSON.stringify(answers.phase2, null, 2));

  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">診断結果</h1>

      {rankedResults.length === 0 ? (
        <p className="text-center text-gray-600">
          条件に一致するプランが見つかりませんでした。
        </p>
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

              {/* 💰 メイン価格 */}
              <p className="text-2xl font-bold mt-2">
                ¥{plan.totalMonthly.toLocaleString()}
                <span className="text-sm text-gray-500 ml-1">/月（税込・概算）</span>
              </p>

              {/* 💰 実質料金＋参考料金表示ブロック */}
              {(() => {
                const breakdown = plan.breakdown;
                const initialFee = breakdown.initialFeeMonthly ?? 0;
                const cashback = breakdown.cashback ?? 0;
                const totalWithInitial = plan.totalMonthly + initialFee;
                const totalWithCashback = plan.totalMonthly - cashback;

                return (
                  <div className="mt-1 ml-1 text-sm text-gray-600">
                    <p className="text-gray-700">
                      💰 実質料金（初期費用込み）:
                      <span className="font-semibold text-gray-800 ml-1">
                        ¥{Math.round(totalWithInitial).toLocaleString()} /月
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 ml-5">
                      ※ 初期費用（月換算 ¥{initialFee.toLocaleString()}）を加算して算出
                    </p>

                    {cashback > 0 && (
                      <div className="mt-1">
                        <p className="text-gray-600">
                          💸 キャッシュバック込み参考料金:
                          <span className="font-semibold text-gray-700 ml-1">
                            ¥{Math.round(totalWithCashback).toLocaleString()} /月
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 ml-5">
                          ※ キャッシュバック（月換算 -¥{cashback.toLocaleString()}）を反映した参考値
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ===== 既存の内訳はここから変更なし ===== */}
              <div className="mt-4 text-sm text-gray-700">
                <p>・基本料金: ¥{plan.breakdown.baseFee}</p>
                <p>・通話オプション: +¥{plan.breakdown.callOptionFee}</p>
                <p>・家族割引: -¥{plan.breakdown.familyDiscount}</p>
                <p>・学割: -¥{plan.breakdown.studentDiscount}</p>
                <p>・年齢割: -¥{plan.breakdown.ageDiscount}</p>
                <p>・テザリング料: +¥{plan.breakdown.tetheringFee}</p>
                {/* 以下略（既存ロジック変更なし） */}
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-10">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-lg font-semibold shadow-md transition-all duration-200"
            >
              🔄 もう一度診断する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
