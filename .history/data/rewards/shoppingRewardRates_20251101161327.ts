/**
 * ===================================================
 * 🛍️ ショッピング利用時 還元率データベース
 * ---------------------------------------------------
 * 各経済圏ごとのショッピング関連還元率をまとめた基礎データ。
 * 診断ロジックで shoppingReward 計算に使用。
 * 単位は割合（例：0.01 = 1%）。
 * ===================================================
 */

export interface ShoppingRewardRates {
  id: string;
  label: string;
  description: string;
  unit: "rate";
  values: {
    rakuten: number;
    paypay: number;
    dpoint: number;
    ponta: number;
  };
}

export const shoppingRewardRates: ShoppingRewardRates[] = [
  {
    id: "qr_payment",
    label: "QR決済利用による加算",
    description: "各経済圏のQR支払いでの基本還元（例：楽天Pay支払い +0.5%）",
    unit: "rate",
    values: {
      rakuten: 0.005,
      paypay: 0.01,
      dpoint: 0.005,
      ponta: 0.005,
    },
  },
  {
    id: "credit_card",
    label: "クレジットカード利用による加算",
    description: "経済圏クレカ利用時の通常還元（例：+1.0%）",
    unit: "rate",
    values: {
      rakuten: 0.01,
      paypay: 0.01,
      dpoint: 0.01,
      ponta: 0.01,
    },
  },
  {
    id: "gold_card",
    label: "ゴールドカード利用による加算",
    description: "上位カード利用時の還元率（例：+3〜10%）",
    unit: "rate",
    values: {
      rakuten: 0.015,
      paypay: 0.01,
      dpoint: 0.09,
      ponta: 0.015,
    },
  },
  {
    id: "bank_debit",
    label: "銀行デビット利用による加算",
    description: "経済圏連携銀行（楽天銀行・じぶん銀行など）利用時の特典（例：+0.5%）",
    unit: "rate",
    values: {
      rakuten: 0.005,
      paypay: 0.003,
      dpoint: 0.005,
      ponta: 0.01,
    },
  },
  {
    id: "spu_bonus",
    label: "SPU・倍率特典",
    description: "各モール独自の倍率（例：SPU +1〜+5倍）",
    unit: "rate",
    values: {
      rakuten: 0.05,
      paypay: 0.02,
      dpoint: 0.02,
      ponta: 0.01,
    },
  },
  {
    id: "app_bonus",
    label: "アプリ経由特典",
    description: "アプリ利用やエントリー特典（例：アプリ経由 +0.5%）",
    unit: "rate",
    values: {
      rakuten: 0.005,
      paypay: 0.005,
      dpoint: 0.005,
      ponta: 0.005,
    },
  },
  {
    id: "campaign_bonus",
    label: "キャンペーン加算",
    description: "不定期イベント（例：「5と0のつく日」+2%、買いまわり+1%など）",
    unit: "rate",
    values: {
      rakuten: 0.03,
      paypay: 0.02,
      dpoint: 0.02,
      ponta: 0.02,
    },
  },
  {
    id: "carrier_payment",
    label: "通信料金支払い優遇",
    description: "キャリア契約者特典（例：ドコモユーザー +1%）",
    unit: "rate",
    values: {
      rakuten: 0.01,
      paypay: 0.01,
      dpoint: 0.01,
      ponta: 0.01,
    },
  },
  {
    id: "total_reward_estimate",
    label: "最大還元合計",
    description: "上記すべての条件を満たした場合の理論上最大還元率（計算用フィールド）",
    unit: "rate",
    values: {
      rakuten: 0.13,
      paypay: 0.10,
      dpoint: 0.17,
      ponta: 0.09,
    },
  },
];

export default shoppingRewardRates;
