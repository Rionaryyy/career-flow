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

  // === 💰 キャッシュバック・初期費用（月換算 or 無視） ===
  const campaignCashback = campaign.campaignCashback ?? 0;
  const cashbackTotal = (plan.cashbackAmount ?? 0) + campaignCashback;
  const initialCostTotal = plan.initialCost ?? 0;

  const compareAxis = answers.phase1?.compareAxis ?? "";
  const comparePeriod = answers.phase1?.comparePeriod || "";

  let months = 12;
  if (comparePeriod.includes("2年")) months = 24;
  if (comparePeriod.includes("3年")) months = 36;

  let cashback = 0;
  let initialFeeMonthly = 0;

  if (compareAxis.includes("キャッシュバック込みで考えたい")) {
    // 💡 キャッシュバック込みで考える → 月割り算出
    cashback = cashbackTotal / months;
    initialFeeMonthly = initialCostTotal / months;
  } else if (compareAxis.includes("実際に支払う金額")) {
    // 💡 実際に支払う金額 → 初期費用・キャッシュバックを考慮しない
    cashback = 0;
    initialFeeMonthly = 0;
  } else {
    // 💡 未設定 or その他 → デフォルトで月割り
    cashback = cashbackTotal / months;
    initialFeeMonthly = initialCostTotal / months;
  }

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

  // === 💾 戻り値 ===
 return {
  baseFee: base,
  cashback,
  cashbackTotal,
  campaignCashback,
  campaignMatched: campaign.campaignMatched,
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
