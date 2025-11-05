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
  const campaign = calcCampaigns(plan, answers); // ← ここでキャンペーン情報も取得
  const cashback = campaign.cashback;
  const initialFeeMonthly = campaign.initialFeeMonthly;



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
    initialFeeMonthly +
    device.deviceBuyMonthly +
    call.voicemailFee +
    call.internationalCallFee +
    subscription.subscriptionBaseFee +
    cashback +
    initialFeeMonthly +
    (call.tetheringFee ?? 0);

  // === 💾 戻り値 ===
 return {
  baseFee: base,
  cashback: campaign.cashback,
  cashbackTotal: campaign.cashbackTotal,
  campaignCashback: campaign.campaignCashback,
  campaignMatched: campaign.campaignMatched,
  initialFeeMonthly: campaign.initialFeeMonthly,
  initialCostTotal: campaign.initialCostTotal,
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
  total: Math.round(total),
  totalWithDevice: Math.round(total),
};


}
