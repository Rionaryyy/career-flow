import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

import { calcCallOptions } from "./callOptionsLogic";
import { calcDiscounts } from "./discountLogic";
import { calcDeviceCost } from "./deviceCostLogic";
import { calcSubscription } from "./subscriptionLogic";
import { calcPayments } from "./paymentLogic";
import { calcSetDiscounts } from "./setDiscountLogic";
import { calcCampaigns } from "./campaignLogic"; // ← キャンペーン判定＋還元ロジック

export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers) {
  const base = plan.baseMonthlyFee ?? 0;

  // === 各モジュール呼び出し ===
  const call = calcCallOptions(plan, answers);
  const discount = calcDiscounts(plan, answers);
  const device = calcDeviceCost(plan, answers);
  const subscription = calcSubscription(plan, answers);
  const payment = calcPayments(plan, answers);
  const set = calcSetDiscounts(plan, answers);
  const campaign = calcCampaigns(plan, answers); // ← キャンペーン情報も取得

  // === 💰 キャンペーン・初期費用関連 ===
  const cashback = campaign.cashback ?? 0;
  const cashbackTotal = campaign.cashbackTotal ?? 0;
  const campaignCashback = campaign.campaignCashback ?? 0;
  const initialFeeMonthly = campaign.initialFeeMonthly ?? 0;
  const initialCostTotal = campaign.initialCostTotal ?? 0;

  // === 💵 最終合算（安全キャスト付き） ===
  const total =
    (base ?? 0) +
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
    (initialFeeMonthly ?? 0) -
    (cashback ?? 0);

  // === 💾 戻り値 ===
  return {
    baseFee: base ?? 0,
    cashback,
    cashbackTotal,
    campaignCashback,
    campaignMatched: campaign.campaignMatched ?? [],
    initialFeeMonthly,
    initialCostTotal,
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
    total: Math.round(total ?? 0),
    totalWithDevice: Math.round(total ?? 0),
  };
}
