import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

import { calcCallOptions } from "./callOptionsLogic";
import { calcDiscounts } from "./discountLogic";
import { calcDeviceCost } from "./deviceCostLogic";
import { calcSubscription } from "./subscriptionLogic";
import { calcPayments } from "./paymentLogic";
import { calcSetDiscounts } from "./setDiscountLogic";

export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers) {
  const base = plan.baseMonthlyFee ?? 0;

  // 各モジュール呼び出し
  const call = calcCallOptions(plan, answers);
  const discount = calcDiscounts(plan, answers);
  const device = calcDeviceCost(plan, answers);
  const subscription = calcSubscription(plan, answers);
  const payment = calcPayments(plan, answers);
  const set = calcSetDiscounts(plan, answers);

  // === 💰 最終合算 ===
  const total =
    base +
    call.callOptionFee -
    discount.familyDiscount -
    discount.studentDiscount -
    discount.ageDiscount -
    set.fiberDiscount -
    set.routerDiscount -
    set.pocketWifiDiscount -
    set.electricDiscount - // ← 修正ここ
    set.gasDiscount -       // ← 修正ここ
    subscription.subscriptionDiscount -
    payment.paymentDiscount -
    payment.paymentReward -
    payment.totalCarrierReward +
    device.deviceLeaseMonthly +
    device.deviceBuyMonthly +
    call.voicemailFee +
    call.internationalCallFee +
    subscription.subscriptionBaseFee;

  return {
    baseFee: base,
    ...call,
    ...discount,
    ...device,
    ...subscription,
    ...payment,
    ...set,
    total: Math.round(total),
    totalWithDevice: Math.round(total),
  };
}
