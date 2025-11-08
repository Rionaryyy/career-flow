import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

import { calcCallOptions } from "./callOptionsLogic";
import { calcDiscounts } from "./discountLogic";
import { calcDeviceCost } from "./deviceCostLogic";
import { calcSubscription } from "./subscriptionLogic";
import { calcPayments } from "./paymentLogic";
import { calcSetDiscounts } from "./setDiscountLogic";
import { calcCampaigns } from "./campaignLogic";

/**
 * 💰 calculatePlanCost
 * --------------------------------------------------------
 * 各ロジックを統合し、「実質料金」「参考料金」を算出する。
 * キャッシュバックは `effectiveMonthlyAdjustment`
 * （初期費用 − 還元）を通じて反映する。
 */
export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers) {
  const base = plan.baseMonthlyFee ?? 0;

  // 🧩 各ロジック呼び出し
  const call = calcCallOptions(plan, answers);
  const discount = calcDiscounts(plan, answers);
  const device = calcDeviceCost(plan, answers);
  const subscription = calcSubscription(plan, answers);
  const payment = calcPayments(plan, answers);
  const set = calcSetDiscounts(plan, answers);
  const campaign = calcCampaigns(plan, answers);

  // === 🪙 キャンペーン関係 ===
  const cashbackMonthly = campaign.cashbackMonthly ?? 0;
  const initialFeeMonthly = campaign.initialFeeMonthly ?? 0;
  const effectiveMonthlyAdjustment =
    typeof campaign.effectiveMonthlyAdjustment === "number"
      ? campaign.effectiveMonthlyAdjustment
      : (initialFeeMonthly ?? 0) - (cashbackMonthly ?? 0);

  // === 💡 実質料金算出 ===
  const total =
    base +
    (call.callOptionFee ?? 0) -
    (discount.familyDiscount ?? 0) -
    (discount.studentDiscount ?? 0) -
    (discount.ageDiscount ?? 0) -
    (set.fiberDiscount ?? 0) -
    (set.routerDiscount ?? 0) -
    (set.pocketWifiDiscount ?? 0) -
    (set.electricDiscount ?? 0) -
    (set.gasDiscount ?? 0) -
    (subscription.subscriptionDiscount ?? 0) -
    (payment.paymentDiscount ?? 0) -
    (payment.paymentReward ?? 0) -
    (payment.totalCarrierReward ?? 0) +
    (device.deviceLeaseMonthly ?? 0) +
    (device.deviceBuyMonthly ?? 0) +
    (call.voicemailFee ?? 0) +
    (call.internationalCallFee ?? 0) +
    (subscription.subscriptionBaseFee ?? 0) +
    (call.tetheringFee ?? 0) +
    effectiveMonthlyAdjustment; // ✅ 初期費用 − 還元を統合反映

  // === 💸 キャッシュバック後参考値 ===
  const totalWithCashback = Math.max(
    0,
    Math.round(total - (cashbackMonthly ?? 0))
  );

  return {
    baseFee: base,

    // === 💰 表示用 ===
    cashback: cashbackMonthly,
    cashbackTotal: campaign.cashbackTotal ?? 0,
    campaignCashback: campaign.campaignCashback ?? 0,
    initialFeeMonthly,
    initialCostTotal: campaign.initialCostTotal ?? 0,
    campaignMatched: campaign.campaignMatched ?? [],
    effectiveMonthlyAdjustment,

    ...call,
    ...discount,
    ...device,
    ...subscription,
    ...payment,
    ...set,

    shoppingReward: payment.carrierShoppingReward ?? 0,
    pointReward: payment.paymentReward ?? 0,
    effectiveReward:
      (payment.paymentReward ?? 0) + (payment.totalCarrierReward ?? 0),

    // === 💵 結果 ===
    total: Math.round(total),
    totalWithCashback,
    totalWithDevice: Math.round(
      total +
        (device.deviceBuyMonthly ?? 0) +
        (device.deviceLeaseMonthly ?? 0)
    ),
  };
}
