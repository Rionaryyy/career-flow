"use client";

import { useMemo } from "react";
import Image from "next/image";
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

    if (answers.phase1 && Object.values(answers.phase1).some((v) => v)) {
      result = filterPlansByPhase1(answers.phase1, result);
    }

    if (answers.phase2) {
      result = filterPlansByPhase2(answers.phase2, result);
    }

    console.log("✅ Filtered result count:", result.length);

    const withCosts: PlanWithCost[] = result.map((plan) => {
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
      <div className="flex items-center justify-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-sky-900">診断結果</h1>
        <Image
          src="/images/mascot-cat-hold-phone.png?v=1"
          alt=""
          width={56}
          height={56}
          priority
          aria-hidden
          className="h-10 w-10 md:h-14 md:w-14 select-none pointer-events-none"
        />
      </div>

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
                <span className="text-sm text-gray-500 ml-1">/月（税込・概算）</span>
              </p>

              <div className="mt-4 text-sm text-gray-700">
                <p>・基本料金: ¥{plan.breakdown.baseFee}</p>
                <p>・通話オプション: +¥{plan.breakdown.callOptionFee}</p>
                <p>・家族割引: -¥{plan.breakdown.familyDiscount}</p>
                <p>・学割: -¥{plan.breakdown.studentDiscount}</p>
                <p>・年齢割: -¥{plan.breakdown.ageDiscount}</p>
                <p>・テザリング料: +¥{plan.breakdown.tetheringFee}</p>

                {plan.breakdown.internationalCallFee !== 0 && (
                  <p>・国際通話オプション: +¥{plan.breakdown.internationalCallFee}</p>
                )}
                {plan.breakdown.voicemailFee !== 0 && (
                  <p>・留守番電話オプション: +¥{plan.breakdown.voicemailFee}</p>
                )}

                {(plan.breakdown.fiberDiscount ?? 0) !== 0 && (
                  <>
                    <p>・光回線セット割: -¥{plan.breakdown.fiberDiscount}</p>
                    {(plan.breakdown.fiberBaseFee ?? 0) > 0 && (
                      <p className="ml-3 text-gray-600">
                        ↳ 光回線参考月額: ¥{plan.breakdown.fiberBaseFee ?? 0}/月
                      </p>
                    )}
                  </>
                )}

                {(plan.breakdown.routerDiscount ?? 0) !== 0 && (
                  <>
                    <p>・ルーター割引: -¥{plan.breakdown.routerDiscount}</p>
                    {(plan.breakdown.routerBaseFee ?? 0) > 0 && (
                      <p className="ml-3 text-gray-600">
                        ↳ ルーター参考月額: ¥{plan.breakdown.routerBaseFee ?? 0}/月
                      </p>
                    )}
                  </>
                )}

                {(plan.breakdown.pocketWifiDiscount ?? 0) !== 0 && (
                  <>
                    <p>・ポケットWi-Fi割: -¥{plan.breakdown.pocketWifiDiscount}</p>
                    {(plan.breakdown.pocketWifiBaseFee ?? 0) > 0 && (
                      <p className="ml-3 text-gray-600">
                        ↳ ポケットWi-Fi参考月額: ¥{plan.breakdown.pocketWifiBaseFee ?? 0}/月
                      </p>
                    )}
                  </>
                )}

                {plan.breakdown.electricDiscount !== 0 && (
                  <p>・電気セット割: -¥{plan.breakdown.electricDiscount}</p>
                )}
                {plan.breakdown.gasDiscount !== 0 && (
                  <p>・ガスセット割: -¥{plan.breakdown.gasDiscount}</p>
                )}

                {/* 🎬 サブスク内訳（料金・割引詳細） */}
                {(plan.breakdown.subscriptionDetails?.length ?? 0) > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-gray-800 mb-1">
                      🎬 サブスク内訳（料金・割引詳細）
                    </p>

                    {(() => {
                      // 🧩 同一サブスク（セット割・還元）を統合
                      const mergedSubs = Object.values(
                        (plan.breakdown.subscriptionDetails ?? []).reduce(
                          (acc, s) => {
                            const key = s.name.replace(/（.*?）/g, "").trim();
                            if (!acc[key]) {
                              acc[key] = { ...s };
                            } else {
                              const newDiscount = Math.max(
                                acc[key].discount ?? 0,
                                s.discount ?? 0
                              );
                              const newReward =
                                (acc[key].reward ?? 0) + (s.reward ?? 0);
                              acc[key].discount = newDiscount;
                              acc[key].reward = newReward;
                            }
                            return acc;
                          },
                          {} as Record<string, any>
                        )
                      );

                      return (
                        <ul className="ml-2 space-y-1 text-gray-700 text-sm">
                          {mergedSubs.map(
                            (
                              s: {
                                name: string;
                                basePrice: number;
                                discount?: number;
                                reward?: number;
                              },
                              i: number
                            ) => (
                              <li key={i} className="pl-1">
                                ・{s.name.replace(/（.*?）/g, "")}
                                <span className="ml-2 text-gray-600">
                                  ¥{s.basePrice.toLocaleString()}/月
                                </span>

                                {(s.discount ?? 0) > 0 && (
                                  <span className="ml-2 text-green-600">
                                    （割引 -¥{s.discount!.toLocaleString()}）
                                  </span>
                                )}

                                {(s.reward ?? 0) > 0 && (
                                  <span className="ml-2 text-green-600">
                                    （還元 -¥{s.reward!.toLocaleString()}）
                                  </span>
                                )}

                                {(s.discount ?? 0) === 0 &&
                                  (s.reward ?? 0) === 0 && (
                                    <span className="ml-2 text-gray-400">
                                      (特典なし)
                                    </span>
                                  )}
                              </li>
                            )
                          )}
                        </ul>
                      );
                    })()}
                  </div>
                )}

                {/* 🎬 サブスク特典ブロック */}
                {(plan.breakdown.subscriptionBaseFee ?? 0) !== 0 ||
                (plan.breakdown.subscriptionDiscount ?? 0) !== 0 ||
                (plan.breakdown.subscriptionReward ?? 0) !== 0 ? (
                  <div className="mt-2 border-t border-dashed border-gray-300 pt-2">
                    <p className="font-semibold text-gray-800 mb-1">🎬 サブスク関連</p>

                    {plan.breakdown.subscriptionBaseFee !== 0 && (
                      <p className="ml-2 text-gray-700">
                        ・サブスク利用料金: +
                        ¥{plan.breakdown.subscriptionBaseFee?.toLocaleString()}
                      </p>
                    )}

                    {plan.breakdown.subscriptionDiscount !== 0 && (
                      <p className="ml-2 text-gray-700">
                        ・サブスクセット割: -
                        ¥{plan.breakdown.subscriptionDiscount?.toLocaleString()}
                      </p>
                    )}

                    {plan.breakdown.subscriptionReward !== 0 && (
                      <p className="ml-2 text-gray-700">
                        ・サブスク還元: -
                        ¥{plan.breakdown.subscriptionReward?.toLocaleString()}
                      </p>
                    )}

                    <div className="ml-2 font-medium text-sky-700 mt-1">
                      💡 サブスク合計影響額:
                      {(() => {
                        const total =
                          (plan.breakdown.subscriptionBaseFee ?? 0) -
                          (plan.breakdown.subscriptionDiscount ?? 0) -
                          (plan.breakdown.subscriptionReward ?? 0);
                        const sign = total >= 0 ? "+" : "-";
                        return ` ${sign}¥${Math.abs(total).toLocaleString()}/月`;
                      })()}
                    </div>
                  </div>
                ) : null}

                {plan.breakdown.paymentDiscount !== 0 && (
                  <p>・支払い方法割引: -¥{plan.breakdown.paymentDiscount}</p>
                )}

                {answers.phase1?.compareAxis?.includes("実際に支払う金額") && (
                  <div className="mt-3 border-t border-dashed border-gray-300 pt-2">
                    <p className="font-semibold text-gray-800 mb-1">
                      💰 初期費用・特典内訳
                    </p>

                    <p className="ml-2 text-gray-700">
                      ・キャッシュバック総額: -
                      {(plan.breakdown.cashbackTotal ?? 0).toLocaleString()}
                    </p>
                    <p className="ml-2 text-gray-700">
                      ・契約・初期費用総額: +
                      {(plan.breakdown.initialCostTotal ?? 0).toLocaleString()}
                    </p>

                    {(() => {
                      const cashbackTotal = plan.breakdown.cashbackTotal ?? 0;
                      const initialCostTotal =
                        plan.breakdown.initialCostTotal ?? 0;
                      const netInitialCost = initialCostTotal - cashbackTotal;
                      const comparePeriod =
                        answers.phase1?.comparePeriod ?? "";
                      let months = 12;
                      if (comparePeriod.includes("2年")) months = 24;
                      else if (comparePeriod.includes("3年")) months = 36;

                      const netMonthly = Math.round(netInitialCost / months);

                      return (
                        <div className="ml-2 mt-2">
                          <p className="text-gray-800 font-medium">
                            📦 実質初期費用(月換算):{" "}
                            {netMonthly >= 0 ? "+" : "-"}¥
                            {Math.abs(netMonthly).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 ml-4">
                            ↳ 総額: {netInitialCost >= 0 ? "+" : "-"}¥
                            {Math.abs(netInitialCost).toLocaleString()} /{" "}
                            {months}ヶ月平均
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 💴 還元額詳細ブロック */}
                {((plan.breakdown?.paymentReward ?? 0) > 0 ||
                  (plan.breakdown?.carrierBarcodeReward ?? 0) > 0 ||
                  (plan.breakdown?.carrierShoppingReward ?? 0) > 0) && (
                  <div className="mt-2 text-sm text-gray-700 border-t pt-2">
                    <p className="font-semibold">💴 【還元額詳細】</p>

                    {(plan.breakdown?.paymentReward ?? 0) > 0 && (
                      <p>
                        💳 携帯料金支払い還元: ¥
                        {(plan.breakdown?.paymentReward ?? 0).toLocaleString()}
                      </p>
                    )}

                    {(plan.breakdown?.carrierBarcodeReward ?? 0) > 0 && (
                      <p>
                        📱 バーコード決済還元: ¥
                        {(plan.breakdown?.carrierBarcodeReward ?? 0).toLocaleString()}
                      </p>
                    )}

                    {(plan.breakdown?.carrierShoppingReward ?? 0) > 0 && (
                      <p>
                        🛍 ショッピング還元: ¥
                        {(plan.breakdown?.carrierShoppingReward ?? 0).toLocaleString()}
                      </p>
                    )}

                    <p className="mt-1 font-medium text-green-700 dark:text-green-400">
                      🎁 実質合算還元: ¥
                      {(plan.breakdown?.effectiveReward ?? 0).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* 💻 端末関連（返却プログラム／購入は排他表示） */}
              {plan.breakdown.deviceLeaseMonthly &&
              plan.breakdown.deviceLeaseMonthly > 0 ? (
                <div className="mt-1">
                  <p className="font-medium text-indigo-700">
                    ・返却プログラム（月額端末費）: +
                    ¥{plan.breakdown.deviceLeaseMonthly}
                  </p>
                  <p className="text-xs text-gray-500 ml-3">
                    ↳ 総額（目安）:
                    ¥{(plan.breakdown.deviceTotal ?? 0).toLocaleString()}
                  </p>
                </div>
              ) : plan.breakdown.deviceBuyMonthly &&
                plan.breakdown.deviceBuyMonthly > 0 ? (
                <div className="mt-1">
                  <p className="font-medium text-sky-700">
                    ・端末購入（月額端末費）: +
                    ¥{plan.breakdown.deviceBuyMonthly}
                  </p>
                  <p className="text-xs text-gray-500 ml-3">
                    ↳ 総額（目安）:
                    ¥{(plan.breakdown.deviceTotal ?? 0).toLocaleString()}
                  </p>
                </div>
              ) : null}

              {(answers.phase2?.deviceModel || answers.phase2?.deviceStorage) && (
                <div className="mt-2 text-xs text-gray-600 border-t border-dashed border-gray-300 pt-1">
                  📱 {answers.phase2?.deviceModel ?? plan.deviceProgram?.model}
                  {answers.phase2?.deviceStorage &&
                    `（${answers.phase2.deviceStorage}）`}{" "}
                  /{" "}
                  {answers.phase2?.buyingDevice?.includes("返却")
                    ? "返却プログラム"
                    : answers.phase2?.buyingDevice?.includes("キャリア")
                    ? "キャリア端末購入（所有）"
                    : answers.phase2?.buyingDevice?.includes("正規店")
                    ? "正規店購入（返却なし）"
                    : "端末購入"}
                  {plan.deviceProgram?.paymentMonths &&
                    `（${plan.deviceProgram.paymentMonths}ヶ月${
                      answers.phase2?.buyingDevice?.includes("返却")
                        ? "返却前提"
                        : "分割払い"
                    }）`}
                </div>
              )}
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
