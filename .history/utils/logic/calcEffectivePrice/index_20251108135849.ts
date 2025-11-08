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

  // 🧩 各ロジック呼び出し
  const call = calcCallOptions(plan, answers);
  const discount = calcDiscounts(plan, answers);
  const device = calcDeviceCost(plan, answers);
  const subscription = calcSubscription(plan, answers);
  const payment = calcPayments(plan, answers);
  const set = calcSetDiscounts(plan, answers);
  const campaign = calcCampaigns(plan, answers);

  // 💰 キャンペーン関連
  const cashbackMonthly = campaign.cashbackMonthly ?? 0;
  const initialFeeMonthly = campaign.initialFeeMonthly ?? 0;

  // 💵 トータル計算
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
    initialFeeMonthly -
    cashbackMonthly;

  // 🧩 デバッグ確認用
  console.log("🏠 セット割詳細:", {
    carrier: plan.carrier,
    fiber: set.fiberDiscount,
    router: set.routerDiscount,
    pocket: set.pocketWifiDiscount,
    electric: set.electricDiscount,
    gas: set.gasDiscount,
  });

  // === 📦 breakdown構造（Resultカードで使う） ===
  const breakdown = {
    ...call,
    ...discount,
    ...device,
    ...subscription,
    ...payment,
    ...set,

    // ⬇️ 光・ルータ・ポケットWi-Fiの基礎費用も含める
    fiberDiscount: set.fiberDiscount ?? 0,
    routerDiscount: set.routerDiscount ?? 0,
    pocketWifiDiscount: set.pocketWifiDiscount ?? 0,
    electricDiscount: set.electricDiscount ?? 0,
    gasDiscount: set.gasDiscount ?? 0,

    fiberBaseFee: set.fiberBaseFee ?? 0,
    routerBaseFee: set.routerBaseFee ?? 0,
    pocketWifiBaseFee: set.pocketWifiBaseFee ?? 0,
  };

  // === 💰 最終出力 ===
  return {
    baseFee: base,
    total: Math.round(total),
    totalWithDevice: Math.round(
      total +
        (device.deviceBuyMonthly ?? 0) +
        (device.deviceLeaseMonthly ?? 0)
    ),

    // === 💰 キャンペーン・還元関連 ===
    cashback: cashbackMonthly,
    cashbackTotal: campaign.cashbackTotal ?? 0,
    campaignCashback: campaign.campaignCashback ?? 0,
    initialFeeMonthly,
    initialCostTotal: campaign.initialCostTotal ?? 0,
    campaignMatched: campaign.campaignMatched ?? [],
    effectiveMonthlyAdjustment: campaign.effectiveMonthlyAdjustment ?? 0,

    // === 💳 支払い還元 ===
    shoppingReward: payment.carrierShoppingReward ?? 0,
    pointReward: payment.paymentReward ?? 0,
    effectiveReward:
      (payment.paymentReward ?? 0) + (payment.totalCarrierReward ?? 0),

    // === 📦 breakdownを統合 ===
    breakdown,
  };
}
