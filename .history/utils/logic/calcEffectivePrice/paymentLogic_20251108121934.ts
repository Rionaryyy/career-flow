import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface PaymentResult {
  paymentDiscount: number;
  paymentReward: number;
  carrierBarcodeReward: number;
  carrierShoppingReward: number;
  totalCarrierReward: number;
}

export function calcPayments(plan: Plan, answers: DiagnosisAnswers): PaymentResult {
  let paymentDiscount = 0;
  let paymentReward = 0;
  let carrierBarcodeReward = 0;
  let carrierShoppingReward = 0;

  // === 💳 メインカード／ブランド統合処理 ===
  const selectedMain = (answers.mainCard ?? []) as string[];

  // ✅ Phase2構造の対応（cardDetail-credit / cardDetail-bank 統合）
  const mergedCardDetails = [
    ...(answers["cardDetail-credit"] ?? []),
    ...(answers["cardDetail-bank"] ?? []),
    ...(answers.cardDetail ?? []),
  ].filter(Boolean);

  const selectedBrands = Array.isArray(mergedCardDetails)
    ? (mergedCardDetails as string[])
    : [];

  // === キャリアの支払い割引・ポイント還元 ===
  if (plan.paymentBenefitRules?.length) {
    for (const rule of plan.paymentBenefitRules) {
      const matchesMethod = selectedMain.includes(rule.method);
      const matchesBrand = (rule.brands ?? []).some((b: string) =>
        selectedBrands.includes(b)
      );

      if (matchesMethod && matchesBrand) {
        if (rule.discount) paymentDiscount += rule.discount;
        if (rule.rate && rule.rate > 0) {
          const base = plan.baseMonthlyFee ?? 0;
          const estimated = Math.round(base * rule.rate);
          paymentReward += estimated;
          console.log(`💳 ${plan.carrier}: ${rule.method} → ${rule.rate * 100}% = ¥${estimated}`);
        }
      }
    }
  }

  // === バーコード決済（キャリアPay） ===
  const barcodeMonthly =
    Number((answers.monthlyBarcodeSpend || "0").toString().replace(/\D/g, "")) || 0;

  if (plan.carrierPaymentRewardRate && plan.carrierPaymentRewardRate > 0) {
    const calcReward = Math.round(barcodeMonthly * plan.carrierPaymentRewardRate);
    carrierBarcodeReward = plan.carrierPaymentRewardLimit
      ? Math.min(calcReward, plan.carrierPaymentRewardLimit)
      : calcReward;
  }

  // === ショッピング利用還元 ===
  const shoppingMonthly =
    Number((answers.monthlyShoppingSpend || "0").toString().replace(/\D/g, "")) || 0;
  const shoppingList = (answers.shoppingEcosystem ?? []) as string[];

  let shopRate = 0;
  if ((shoppingList ?? []).some((s: string) => s.includes("Yahoo!ショッピング")))
    shopRate = plan.carrierShoppingRewardRate_Yahoo ?? 0;
  else if ((shoppingList ?? []).some((s: string) => s.includes("LOHACO")))
    shopRate = plan.carrierShoppingRewardRate_LOHACO ?? 0;
  else if ((shoppingList ?? []).some((s: string) => s.includes("楽天市場")))
    shopRate = plan.carrierShoppingRewardRate_Rakuten ?? 0;
  else if ((shoppingList ?? []).some((s: string) => s.includes("au PAYマーケット")))
    shopRate = plan.carrierShoppingRewardRate_AUPayMarket ?? 0;

  carrierShoppingReward = Math.round(shoppingMonthly * shopRate);
  const totalCarrierReward = carrierBarcodeReward + carrierShoppingReward;

  console.log(
    `💰 ${plan.carrier} 支払い割: ${paymentDiscount}, 還元: ${paymentReward}, トータル: ${totalCarrierReward}`
  );

  return {
    paymentDiscount,
    paymentReward,
    carrierBarcodeReward,
    carrierShoppingReward,
    totalCarrierReward,
  };
}
