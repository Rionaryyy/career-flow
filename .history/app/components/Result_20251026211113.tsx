"use client";

import { useMemo, useEffect, useState } from "react";
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { filterPlansByPhase2 } from "@/utils/filters/phase2FilterLogic";
import { allPlansWithDevices as allPlans } from "@/data/plans";
import { calculatePlanCost } from "../../utils/logic/calcEffectivePrice";

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
  };
  totalMonthly: number;
}

interface Props {
  answers: DiagnosisAnswers;
  filteredPlans: Plan[];
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: Props) {
  // ✅ Phase2回答の復元を待つ
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (answers?.phase2?.deviceModel || answers?.phase2?.buyingDevice) {
      console.log("✅ Phase2 answers confirmed:", answers.phase2);
      setIsReady(true);
    } else {
      console.warn("⏳ Phase2 answers not ready yet:", answers.phase2);
    }
  }, [answers.phase2]);

  const rankedResults: PlanWithCost[] = useMemo(() => {
    if (!isReady) return [];

    console.groupCollapsed("🧩 [Result Calculation Start]");
    console.log("🟦 Phase1 Answers:", answers.phase1);
    console.log("🟩 Phase2 Answers:", answers.phase2);

    let result: Plan[] = [...allPlans];

    if (answers.phase1 && Object.values(answers.phase1).some(v => v)) {
      result = filterPlansByPhase1(answers.phase1, result);
    }
    if (answers.phase2 && Object.values(answers.phase2).some(v => v)) {
      result = filterPlansByPhase2(answers.phase2, result);
    }

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
          paymentDiscount: cost.paymentDiscount ?? 0,
          paymentReward: cost.paymentReward ?? 0,
          shoppingReward: cost.shoppingReward ?? 0,
          pointReward: cost.pointReward ?? 0,
        },
        totalMonthly: cost.total ?? 0,
      };
    });

    console.groupEnd();
    return withCosts.sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [answers.phase1, answers.phase2, isReady]);

  // 🟢 デバッグログ
  console.log("📦 Phase2 Debug in Result:", answers.phase2);

  if (!isReady) {
    return (
      <div className="w-full py-10 px-6 max-w-4xl mx-auto text-center text-gray-500">
        回答データを復元中です...
      </div>
    );
  }

  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">
        診断結果
      </h1>

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

              <p className="text-2xl font-bold mt-2">
                ¥{plan.totalMonthly.toLocaleString()}
                <span className="text-sm text-gray-500 ml-1">
                  /月（税込・概算）
                </span>
              </p>

              <div className="mt-4 text-sm text-gray-700">
                <p>・基本料金: ¥{plan.breakdown.baseFee}</p>
                <p>・通話オプション: +¥{plan.breakdown.callOptionFee}</p>
                <p>・家族割引: -¥{plan.breakdown.familyDiscount}</p>
                <p>・学割: -¥{plan.breakdown.studentDiscount}</p>
                <p>・年齢割: -¥{plan.breakdown.ageDiscount}</p>
                <p>・キャッシュバック(換算): -¥{plan.breakdown.cashback}</p>
                <p>・初期費用(月換算): +¥{plan.breakdown.initialFeeMonthly}</p>

                {plan.breakdown.deviceLeaseMonthly && plan.breakdown.deviceLeaseMonthly > 0 && (
                  <p className="font-medium text-indigo-700">
                    ・返却プログラム（月額端末費）: +¥{plan.breakdown.deviceLeaseMonthly}
                  </p>
                )}
                {plan.breakdown.deviceBuyMonthly && plan.breakdown.deviceBuyMonthly > 0 && (
                  <p className="font-medium text-sky-700">
                    ・端末購入（月額端末費）: +¥{plan.breakdown.deviceBuyMonthly}
                  </p>
                )}

                <p className="mt-1 text-sky-700 font-medium">
                  ・テザリング料: +¥{plan.breakdown.tetheringFee}
                </p>

                {plan.breakdown.fiberDiscount !== 0 && <p>・光回線セット割: -¥{plan.breakdown.fiberDiscount}</p>}
                {plan.breakdown.routerDiscount !== 0 && <p>・ルーター割引: -¥{plan.breakdown.routerDiscount}</p>}
                {plan.breakdown.pocketWifiDiscount !== 0 && <p>・ポケットWi-Fi割: -¥{plan.breakdown.pocketWifiDiscount}</p>}
                {plan.breakdown.electricDiscount !== 0 && <p>・電気セット割: -¥{plan.breakdown.electricDiscount}</p>}
                {plan.breakdown.gasDiscount !== 0 && <p>・ガスセット割: -¥{plan.breakdown.gasDiscount}</p>}
                {plan.breakdown.subscriptionDiscount !== 0 && <p>・サブスク割: -¥{plan.breakdown.subscriptionDiscount}</p>}
                {plan.breakdown.paymentDiscount !== 0 && <p>・支払い方法割引: -¥{plan.breakdown.paymentDiscount}</p>}
                {plan.breakdown.paymentReward !== 0 && <p>・支払い還元（実質）: -¥{plan.breakdown.paymentReward}</p>}
                {plan.breakdown.shoppingReward !== 0 && <p>・ショッピング還元（実質）: -¥{plan.breakdown.shoppingReward}</p>}
                {plan.breakdown.pointReward !== 0 && <p>・ポイント還元（実質）: -¥{plan.breakdown.pointReward}</p>}
              </div>

              {(answers.phase2?.deviceModel || answers.phase2?.deviceStorage) && (
                <div className="mt-2 text-xs text-gray-600 border-t border-dashed border-gray-300 pt-1">
                  📱 {answers.phase2?.deviceModel ?? plan.deviceProgram?.model}
                  {answers.phase2?.deviceStorage && `（${answers.phase2.deviceStorage}）`} /{" "}
                  {answers.phase2?.buyingDevice?.includes("返却")
                    ? "返却プログラム"
                    : answers.phase2?.buyingDevice?.includes("キャリア")
                    ? "キャリア端末購入（所有）"
                    : answers.phase2?.buyingDevice?.includes("正規店")
                    ? "正規店購入（返却なし）"
                    : "端末購入"}
                  {plan.deviceProgram?.paymentMonths &&
                    `（${plan.deviceProgram.paymentMonths}ヶ月${
                      answers.phase2?.buyingDevice?.includes("返却") ? "返却前提" : "分割払い"
                    }）`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
