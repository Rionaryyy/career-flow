// utils/logic/calcRewardRates.ts
import { Phase2Answers } from "../../types/types";
import { paymentRewardRates } from "../../data/rewards/paymentRewardRates";

/**
 * 経済圏文字列をキーに変換する
 */
const detectEcosystemKey = (
  ecosystemString: string
): keyof typeof paymentRewardRates[0]["values"] | null => {
  if (ecosystemString.includes("楽天")) return "rakuten";
  if (ecosystemString.includes("dポイント")) return "dpoint";
  if (ecosystemString.includes("PayPay")) return "paypay";
  if (ecosystemString.includes("Ponta") || ecosystemString.includes("au")) return "ponta";
  return null;
};

/**
 * 還元率計算メイン
 * 支払いとショッピングを区別して算出
 */
export const calcRewardRates = (answers: Phase2Answers) => {
  let paymentRewardRate = 0;
  let shoppingRewardRate = 0;

  // === 経済圏検出 ===
  const ecoKey =
    (answers.paymentEcosystem &&
      Array.isArray(answers.paymentEcosystem) &&
      detectEcosystemKey(answers.paymentEcosystem.join(","))) ||
    null;

  if (!ecoKey) return { paymentRewardRate: 0, shoppingRewardRate: 0 };

  // === 💳 支払い関連 ===
  const appliedRates: string[] = [];

  // クレカを使っている場合
  if (
    answers.dDetails?.some((v) => v.includes("dカード")) ||
    answers.rakutenDetails?.some((v) => v.includes("楽天カード")) ||
    answers.paypayDetails?.some((v) => v.includes("PayPayカード")) ||
    answers.auDetails?.some((v) => v.includes("au PAYカード"))
  ) {
    paymentRewardRate +=
      paymentRewardRates.find((r) => r.id === "credit_card")?.values[ecoKey] ?? 0;
    appliedRates.push("credit_card");
  }

  // ゴールドカード特典
  if (
    answers.dDetails?.includes("dカード GOLD（上位カード）") ||
    answers.rakutenDetails?.includes("楽天ゴールドカード（上位カード）") ||
    answers.auDetails?.includes("au PAY ゴールドカード（上位カード）") ||
    answers.paypayDetails?.includes("PayPayゴールドカード（上位カード）")
  ) {
    // ゴールドカード特典は通信料10%など別枠扱いが望ましいが、
    // ここでは一律上乗せとして扱う
    paymentRewardRate +=
      paymentRewardRates.find((r) => r.id === "gold_card")?.values[ecoKey] ?? 0;
    appliedRates.push("gold_card");
  }

  // QR決済を利用
  if (
    answers.dDetails?.some((v) => v.includes("d払い")) ||
    answers.rakutenDetails?.some((v) => v.includes("楽天Pay")) ||
    answers.paypayDetails?.some((v) => v.includes("PayPay")) ||
    answers.auDetails?.some((v) => v.includes("au PAY"))
  ) {
    paymentRewardRate +=
      paymentRewardRates.find((r) => r.id === "qr_payment")?.values[ecoKey] ?? 0;
    appliedRates.push("qr_payment");
  }

  // 銀行連携
  if (Array.isArray(answers.linkedBank)) {
    answers.linkedBank.forEach((bank) => {
      if (bank.includes("楽天銀行"))
        paymentRewardRate += paymentRewardRates.find((r) => r.id === "linked_bank_bonus")?.values.rakuten ?? 0;
      if (bank.includes("auじぶん銀行"))
        paymentRewardRate += paymentRewardRates.find((r) => r.id === "linked_bank_bonus")?.values.ponta ?? 0;
      if (bank.includes("三井住友銀行"))
        paymentRewardRate += paymentRewardRates.find((r) => r.id === "linked_bank_bonus")?.values.dpoint ?? 0;
      if (bank.includes("PayPay銀行"))
        paymentRewardRate += paymentRewardRates.find((r) => r.id === "linked_bank_bonus")?.values.paypay ?? 0;
    });
    appliedRates.push("linked_bank_bonus");
  }

  // 会員特典（経済圏を利用している場合に上乗せ）
  if (answers.paymentEcosystem?.length) {
    paymentRewardRate +=
      paymentRewardRates.find((r) => r.id === "membership_bonus")?.values[ecoKey] ?? 0;
    appliedRates.push("membership_bonus");
  }

  // 一定確率でキャンペーン加算（仮想的平均値として1/3程度適用）
  paymentRewardRate +=
    (paymentRewardRates.find((r) => r.id === "campaign_bonus")?.values[ecoKey] ?? 0) * 0.33;
  appliedRates.push("campaign_bonus(33%)");

  // === 🛒 ショッピング還元 ===
  if (Array.isArray(answers.shoppingList)) {
    const shopEcoKey = detectEcosystemKey(answers.shoppingList.join(","));
    if (shopEcoKey) {
      // ショッピングでは、経済圏ごとの特典平均値（クレカ + ランク + キャンペーン）
      const base =
        (paymentRewardRates.find((r) => r.id === "credit_card")?.values[shopEcoKey] ?? 0) +
        (paymentRewardRates.find((r) => r.id === "membership_bonus")?.values[shopEcoKey] ?? 0) +
        (paymentRewardRates.find((r) => r.id === "campaign_bonus")?.values[shopEcoKey] ?? 0) * 0.5;
      shoppingRewardRate = base;
    }
  }

  // === 小数第3位で丸めて返す
  return {
    paymentRewardRate: Math.round(paymentRewardRate * 1000) / 1000,
    shoppingRewardRate: Math.round(shoppingRewardRate * 1000) / 1000,
    debug: { ecoKey, appliedRates },
  };
};
