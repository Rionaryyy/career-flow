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
const campaignCashback = campaign.campaignCashback ?? 0; // ✅ calcCampaignsから取得
const cashbackTotal = (plan.cashbackAmount ?? 0) + campaignCashback; // ✅ plan固有＋キャンペーン合算
const initialCostTotal = campaign.initialCostTotal ?? plan.initialCost ?? 0; // ✅ plan or campaignから取得

const compareAxis = answers.phase1?.compareAxis ?? "";
const comparePeriod = answers.phase1?.comparePeriod || "";

// 📅 比較期間（月数換算）
let months: number | null = null;
if (comparePeriod.includes("1年")) months = 12;
else if (comparePeriod.includes("2年")) months = 24;
else if (comparePeriod.includes("3年")) months = 36;

// 💸 キャッシュバック・初期費用の月割処理
let cashback = 0;
let initialFeeMonthly = 0;

// === 🔧 比較軸に応じて分岐 ===
if (compareAxis.includes("実際に支払う金額")) {
  cashback = months ? cashbackTotal / months : cashbackTotal; // ← 未選択なら全額
  initialFeeMonthly = months ? initialCostTotal / months : initialCostTotal;
} else if (compareAxis.includes("毎月の支払い額だけ")) {
  cashback = 0;
  initialFeeMonthly = 0;
} else {
  cashback = months ? cashbackTotal / months : cashbackTotal;
  initialFeeMonthly = months ? initialCostTotal / months : initialCostTotal;
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
