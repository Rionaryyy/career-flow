import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

import { calcCallOptions } from "./callOptionsLogic";
import { calcDiscounts } from "./discountLogic";
import { calcDeviceCost } from "./deviceCostLogic";
import { calcSubscription } from "./subscriptionLogic";
import { calcPayments } from "./paymentLogic";
import { calcSetDiscounts } from "./setDiscountLogic";
import { calcCampaigns } from "./campaignLogic"; // ← 新規追加

export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers) {
  const base = plan.baseMonthlyFee ?? 0;

  // === 各モジュール呼び出し ===
  const call = calcCallOptions(plan, answers);
  const discount = calcDiscounts(plan, answers);
  const device = calcDeviceCost(plan, answers);
  const subscription = calcSubscription(plan, answers);
  const payment = calcPayments(plan, answers);
  const set = calcSetDiscounts(plan, answers);
  const campaign = calcCampaigns(plan, answers); // ← 追加ポイント

  // === 💰 キャッシュバック・初期費用（月割り） ===
  const campaignCashback = campaign.campaignCashback ?? 0; // ← 新規
  const cashbackTotal = (plan.cashbackAmount ?? 0) + campaignCashback;
  const initialCostTotal = plan.initialCost ?? 0;

  const comparePeriod = answers.phase1?.comparePeriod || "";
  let months = 12;
  if (comparePeriod.includes("2年")) months = 24;
  if (comparePeriod.includes("3年")) months = 36;

  const cashback = cashbackTotal / months;
  const initialFeeMonthly = initialCostTotal / months;

  // === 💵 最終合算 ===
  const total =
    base +
    call.callOptionFee -
    discount.familyDiscount -
    discount.studentDiscount -
    discount.ageDiscount -
    set.fiberDiscount -
    set.routerDiscount -
    set.pocketWifiDiscount -
    set.electricDiscount -
    set.gasDiscount -
    subscription.subscriptionDiscount -
    payment.paymentDiscount -
    payment.paymentReward -
    payment.totalCarrierReward +
    device.deviceLeaseMonthly +
    device.deviceBuyMonthly +
    call.voicemailFee +
    call.internationalCallFee +
    subscription.subscriptionBaseFee +
    cashback +
    initialFeeMonthly +
    (call.tetheringFee ?? 0);

  return {
    baseFee: base,
    cashback,
    cashbackTotal,
    initialFeeMonthly,
    initialCostTotal,
    ...call,
    ...discount,
    ...device,
    ...subscription,
    ...payment,
    ...set,
    ...campaign, // ← campaignMatched一覧なども返す
    shoppingReward: payment.carrierShoppingReward ?? 0,
    pointReward: payment.paymentReward ?? 0,
    effectiveReward:
      (payment.paymentReward ?? 0) + (payment.totalCarrierReward ?? 0),
    total: Math.round(total),
    totalWithDevice: Math.round(total),
  };
}
