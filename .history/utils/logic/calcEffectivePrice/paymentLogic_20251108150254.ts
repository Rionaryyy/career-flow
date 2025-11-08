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
      // 🧩 methodの柔軟一致（例：クレジット／カード／銀行／引き落とし）
      const matchesMethod = selectedMain.some((m) => {
        const normalize = (s: string) =>
          s.toLowerCase().replace(/\s/g, "").replace(/カード|クレカ|口座|引き落とし/g, "");
        return (
          normalize(m).includes(normalize(rule.method)) ||
          normalize(rule.method).includes(normalize(m))
        );
      });

      // 🧩 brandの柔軟一致（日本語・英語・半角全角・card/pay/bank除去）
      const matchesBrand = (rule.brands ?? []).some((b: string) => {
        return selectedBrands.some((sel) => {
          const normalize = (s: string) =>
            s
              .toLowerCase()
              .replace(/\s/g, "")
              .replace(/_/g, "")
              .replace(/カード|クレカ|card|pay|ポイント|銀行|bank/g, "");
          return (
            normalize(sel).includes(normalize(b)) ||
            normalize(b).includes(normalize(sel))
          );
        });
      });

      if (matchesMethod && matchesBrand) {
        if (rule.discount) paymentDiscount += rule.discount;
        if (rule.rate && rule.rate > 0) {
          const base = plan.baseMonthlyFee ?? 0;
          const estimated = Math.round(base * rule.rate);
          paymentReward += estimated;
          console.log(
            `💳 ${plan.carrier}: ${rule.method} + ${rule.brands?.join(",")} → ${rule.rate * 100}% = ¥${estimated}`
          );
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
  if ((shoppingList ?? []).some((s: string) => /(yahoo|ヤフー|ショッピング)/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_Yahoo ?? 0;
  else if ((shoppingList ?? []).some((s: string) => /lohaco/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_LOHACO ?? 0;
  else if ((shoppingList ?? []).some((s: string) => /(楽天|rakuten)/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_Rakuten ?? 0;
  else if ((shoppingList ?? []).some((s: string) => /(au\s?pay|aupay)/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_AUPayMarket ?? 0;
  else if ((shoppingList ?? []).some((s: string) => /(paypay|ペイペイ)/i.test(s)))
    shopRate = plan.carrierShoppingRewardRate_PayPayMall ?? 0;

  carrierShoppingReward = Math.round(shoppingMonthly * shopRate);
  const totalCarrierReward = carrierBarcodeReward + carrierShoppingReward;

  // === 🧾 デバッグ出力 ===
  console.log("💳 Payment Debug:", {
    carrier: plan.carrier,
    paymentDiscount,
    paymentReward,
    carrierBarcodeReward,
    carrierShoppingReward,
    totalCarrierReward,
    selectedMain,
    selectedBrands,
    barcodeMonthly,
    shoppingMonthly,
    planPaymentRules: plan.paymentBenefitRules,
  });

  return {
    paymentDiscount,
    paymentReward,
    carrierBarcodeReward,
    carrierShoppingReward,
    totalCarrierReward,
  };
}
