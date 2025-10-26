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

    // 🏠 セット割追加項目
    fiberDiscount?: number;
    routerDiscount?: number;
    pocketWifiDiscount?: number;
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
          economyDiscount: cost.economyDiscount ?? 0,
          deviceDiscount: cost.deviceDiscount ?? 0,
          cashback: cost.cashback ?? 0,
          initialFeeMonthly: cost.initialFeeMonthly ?? 0,
          tetheringFee: cost.tetheringFee ?? 0,

          // 🏠 セット割を追加
          fiberDiscount: cost.fiberDiscount ?? 0,
          routerDiscount: cost.routerDiscount ?? 0,
          pocketWifiDiscount: cost.pocketWifiDiscount ?? 0,
        },
        totalMonthly: cost.total ?? 0,
      };
    });

    console.groupEnd();
    return withCosts.sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [answers.phase1, answers.phase2]);

  // === UI部分 ===
  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">
        診断結果
      </h1>

      {/* === Phase1 / Phase2 データ === */}
      <pre className="text-xs bg-gray-100 text-gray-700 p-3 rounded mb-4 overflow-x-auto">
        {JSON.stringify(answers.phase1 ?? {}, null, 2)}
      </pre>
      <pre className="text-xs bg-gray-50 text-gray-700 p-3 rounded mb-4 overflow-x-auto">
        {JSON.stringify(answers.phase2 ?? {}, null, 2)}
      </pre>

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
              {/* === プラン情報 === */}
              <h2 className="text-xl font-semibold text-sky-800">
                {index + 1}. {plan.planName}
              </h2>
              <p className="text-gray-500 text-sm">{plan.carrier}</p>

              {/* 💰 総額 */}
              <p className="text-2xl font-bold mt-2">
                ¥{plan.totalMonthly.toLocaleString()}
                <span className="text-sm text-gray-500 ml-1">
                  /月（税込・概算）
                </span>
              </p>

              {/* 📊 料金内訳 */}
              <div className="mt-4 text-sm text-gray-700">
                <p>・基本料金: ¥{plan.breakdown.baseFee}</p>
                <p>・通話オプション: +¥{plan.breakdown.callOptionFee}</p>
                <p>・家族割引: -¥{plan.breakdown.familyDiscount}</p>
                <p>・学割: -¥{plan.breakdown.studentDiscount}</p>
                <p>・年齢割: -¥{plan.breakdown.ageDiscount}</p>
                <p>・経済圏割: -¥{plan.breakdown.economyDiscount}</p>
                <p>・端末割引: -¥{plan.breakdown.deviceDiscount}</p>
                <p>・キャッシュバック(換算): -¥{plan.breakdown.cashback}</p>
                <p>・初期費用(月換算): +¥{plan.breakdown.initialFeeMonthly}</p>
                <p className="mt-1 text-sky-700 font-medium">
                  ・テザリング料: +¥{plan.breakdown.tetheringFee}
                </p>

               {/* 🏠 セット割追加（ここだけ差し替え） */}
{(plan.breakdown as any)['fiberDiscount'] !== 0 && (
  <p>・光回線セット割: -¥{(plan.breakdown as any)['fiberDiscount']}</p>
)}
{(plan.breakdown as any)['routerDiscount'] !== 0 && (
  <p>・ルーター割引: -¥{(plan.breakdown as any)['routerDiscount']}</p>
)}
{(plan.breakdown as any)['pocketWifiDiscount'] !== 0 && (
  <p>・ポケットWi-Fi割: -¥{(plan.breakdown as any)['pocketWifiDiscount']}</p>
)}

              </div>

              {/* 🧠 デバッグ情報 */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 border-t border-dashed border-gray-300 pt-2 text-xs text-gray-500">
                  <p>🧩 planId: {plan.planId}</p>
                  <p>📞 callType: {plan.callType ?? "なし"}</p>
                  <p>📶 networkQuality: {plan.networkQuality}</p>
                  <p>🌐 tetheringUsage: {plan.tetheringUsage ?? "未設定"}GB</p>
                  <p>💸 tetheringFee: {plan.tetheringFee ?? 0}円</p>
                  {plan.supportsFamilyDiscount && <p>👪 家族割対応: ✅</p>}
                  {plan.supportsStudentDiscount && <p>🎓 学割対応: ✅</p>}
                  {plan.supportsRakutenEconomy && <p>🛒 楽天経済圏対応: ✅</p>}
                  {plan.supportsDualSim && <p>📱 デュアルSIM対応: ✅</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
