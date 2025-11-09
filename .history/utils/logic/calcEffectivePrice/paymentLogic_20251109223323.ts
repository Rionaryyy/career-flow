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

  const selectedMain = (answers.mainCard ?? []) as string[];
  const mergedCardDetails = [
    ...(answers["cardDetail-credit"] ?? []),
    ...(answers["cardDetail-bank"] ?? []),
    ...(answers.cardDetail ?? []),
  ].filter(Boolean);

  const selectedBrands = Array.isArray(mergedCardDetails)
    ? (mergedCardDetails as string[])
    : [];

  // 🧩 英語ID → 日本語名マッピング（あなたのPhase2回答に対応）
  const brandMap: Record<string, string> = {
    rakuten_card: "楽天カード",
    paypay_card: "PayPayカード",
    d_card: "dカード",
    aupay_card: "au PAYカード",
    smbc_nl: "三井住友カード",
    mufg: "三菱UFJ銀行",
    mizuho: "みずほ銀行",
    smbc: "三井住友銀行",
    rakuten_bank: "楽天銀行",
    paypay_bank: "PayPay銀行",
  };

  const normalizedBrands = selectedBrands.map(
    (b) => brandMap[b.toLowerCase()] ?? b
  );

  // === 支払い割引・還元 ===
  if (plan.paymentBenefitRules?.length) {
    for (const rule of plan.paymentBenefitRules) {
      const matchesMethod = selectedMain.some((m) =>
        ["credit", "クレジット", "カード", "クレカ"].some((kw) =>
          rule.method.includes(kw)
        )
      );

      const matchesBrand = (rule.brands ?? []).some((b: string) =>
        normalizedBrands.some((sel) => {
          const normalize = (s: string) =>
            s.toLowerCase().replace(/\s/g, "").replace(/カード|card/g, "");
          return (
            normalize(sel).includes(normalize(b)) ||
            normalize(b).includes(normalize(sel))
          );
        })
      );

      if (matchesMethod && matchesBrand) {
        if (rule.discount) paymentDiscount += rule.discount;
        if (rule.rate && rule.rate > 0) {
          const base = plan.baseMonthlyFee ?? 0;
          const estimated = Math.round(base * rule.rate);
          paymentReward += estimated;
          
        }
      }
    }
  }

  // === バーコード決済 ===
  const barcodeMonthly =
    Number((answers.monthlyBarcodeSpend || "0").toString().replace(/\D/g, "")) || 0;
  if (plan.carrierPaymentRewardRate && plan.carrierPaymentRewardRate > 0) {
    const calcReward = Math.round(barcodeMonthly * plan.carrierPaymentRewardRate);
    carrierBarcodeReward = plan.carrierPaymentRewardLimit
      ? Math.min(calcReward, plan.carrierPaymentRewardLimit)
      : calcReward;
  }

  // === ショッピング還元 ===
  const shoppingMonthly =
    Number((answers.monthlyShoppingSpend || "0").toString().replace(/\D/g, "")) || 0;
  const shoppingList = (answers.shoppingEcosystem ?? []) as string[];

  let shopRate = 0;
  if (shoppingList.some((s) => /(yahoo|ヤフー)/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_Yahoo ?? 0;
  else if (shoppingList.some((s) => /lohaco/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_LOHACO ?? 0;
  else if (shoppingList.some((s) => /(楽天|rakuten)/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_Rakuten ?? 0;
  else if (shoppingList.some((s) => /(aupay|au pay)/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_AUPayMarket ?? 0;

  carrierShoppingReward = Math.round(shoppingMonthly * shopRate);
  const totalCarrierReward = carrierBarcodeReward + carrierShoppingReward;


  return {
    paymentDiscount,
    paymentReward,
    carrierBarcodeReward,
    carrierShoppingReward,
    totalCarrierReward,
  };
}
