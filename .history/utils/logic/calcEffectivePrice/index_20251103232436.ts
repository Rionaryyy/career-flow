import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

import { calcCallOptions } from "./callOptionsLogic";
import { calcDiscounts } from "./discountLogic";
import { calcDeviceCost } from "./deviceCostLogic";
import { calcSubscription } from "./subscriptionLogic";
import { calcPayments } from "./paymentLogic";
import { calcSetDiscounts } from "./setDiscountLogic";
import { calcCampaigns } from "./campaignLogic";

export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers) {
  const base = plan.baseMonthlyFee ?? 0;

  const call = calcCallOptions(plan, answers);
  const discount = calcDiscounts(plan, answers);
  const device = calcDeviceCost(plan, answers);
  const subscription = calcSubscription(plan, answers);
  const payment = calcPayments(plan, answers);
  const set = calcSetDiscounts(plan, answers);
  const campaign = calcCampaigns(plan, answers);

  // 月額に反映する分だけ取り出す
  const cashbackMonthly = campaign.cashbackMonthly ?? 0;
  const initialFeeMonthly = campaign.initialFeeMonthly ?? 0;

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
    (initialFeeMonthly ?? 0) - // ← 初期費用は足す
    (cashbackMonthly ?? 0);    // ← 還元は引く

  return {
    baseFee: base ?? 0,

    // 表示用
    cashback: cashbackMonthly,
    cashbackTotal: campaign.cashbackTotal ?? 0,
    campaignCashback: campaign.campaignCashback ?? 0,
    initialFeeMonthly,
    initialCostTotal: campaign.initialCostTotal ?? 0,
    campaignMatched: campaign.campaignMatched ?? [],
    periodMonths: campaign.periodMonths ?? 12,

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
