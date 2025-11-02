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

  // === 💰 キャッシュバック・初期費用（月割り） ===
  const cashbackTotal = plan.cashbackAmount ?? 0;
  const initialCostTotal = plan.initialCost ?? 0;

  let cashback = 0;
  let initialFeeMonthly = 0;

  const comparePeriod = answers.phase1?.comparePeriod || "";
  let months = 12;
  if (comparePeriod.includes("2年")) months = 24;
  if (comparePeriod.includes("3年")) months = 36;

  cashback = cashbackTotal / months;
  initialFeeMonthly = initialCostTotal / months;

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
    shoppingReward: payment.carrierShoppingReward ?? 0,
    pointReward: payment.paymentReward ?? 0,
    effectiveReward:
      (payment.paymentReward ?? 0) + (payment.totalCarrierReward ?? 0),
    total: Math.round(total),
    totalWithDevice: Math.round(total),
  };
}
