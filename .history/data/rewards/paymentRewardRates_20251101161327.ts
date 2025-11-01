/**
 * ===================================================
 * 💳 支払い方法別 還元率データベース
 * ---------------------------------------------------
 * 各経済圏ごとの還元率をまとめた基礎データ。
 * 診断ロジック側で paymentReward や pointReward の算出に使用。
 * 単位は「割合（例：0.01 = 1%）」。
 * ===================================================
 */

export interface PaymentRewardRates {
  id: string;
  label: string;
  description: string;
  unit: "rate";
  values: {
    paypay: number;
    rakuten: number;
    dpoint: number;
    ponta: number;
  };
}

export const paymentRewardRates: PaymentRewardRates[] = [
  {
    id: "linked_bank_bonus",
    label: "引き落とし銀行連携特典",
    description: "楽天銀行・auじぶん銀行など、特定口座連携で還元上乗せ（例：+0.5〜1.0%）",
    unit: "rate",
    values: {
      paypay: 0.003,
      rakuten: 0.005,
      dpoint: 0.005,
      ponta: 0.01,
    },
  },
  {
    id: "qr_payment",
    label: "QR決済",
    description: "各経済圏のQR支払い時の還元率（例：楽天Pay、d払い、au PAY、PayPay）",
    unit: "rate",
    values: {
      paypay: 0.01,
      rakuten: 0.01,
      dpoint: 0.005,
      ponta: 0.005,
    },
  },
  {
    id: "credit_card",
    label: "クレジットカード",
    description: "経済圏内クレカの通常還元率（例：楽天カード1%、dカード1%、PayPayカード1%）",
    unit: "rate",
    values: {
      paypay: 0.01,
      rakuten: 0.01,
      dpoint: 0.01,
      ponta: 0.01,
    },
  },
  {
    id: "gold_card",
    label: "ゴールドカード",
    description: "上位カード特典（例：dカードGOLD 10%通信料還元、PayPayゴールド +1%）",
    unit: "rate",
    values: {
      paypay: 0.01,
      rakuten: 0.015,
      dpoint: 0.09,
      ponta: 0.015,
    },
  },
  {
    id: "membership_bonus",
    label: "会員ランク特典",
    description: "楽天ダイヤモンド会員、PayPayステップなどランク別上乗せ（例：+1〜2%）",
    unit: "rate",
    values: {
      paypay: 0.02,
      rakuten: 0.02,
      dpoint: 0.01,
      ponta: 0.01,
    },
  },
  {
    id: "campaign_bonus",
    label: "特定日・キャンペーン特典",
    description: "「5と0のつく日」「三太郎の日」「d曜日」など一時的上乗せ（例：+2〜5%）",
    unit: "rate",
    values: {
      paypay: 0.02,
      rakuten: 0.03,
      dpoint: 0.02,
      ponta: 0.02,
    },
  },
];

export default paymentRewardRates;
