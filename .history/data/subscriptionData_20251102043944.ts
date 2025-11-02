// data/subscriptionData.ts

export interface SubscriptionData {
  name: string; // サブスク名（日本語）
  key: string; // 英語キー
  category: string; // 動画 / 音楽 / 書籍 / クラウド / 総合 etc.
  basePrice: number; // 本体価格（円）
  description?: string; // 備考
  discounts: {
    docomo?: number; // 円単位の割引額
    au?: number;
    softbank?: number;
    rakuten?: number;
  };
  rewards: {
    docomo?: number; // 小数で還元率（例: 0.1 = 10%）
    au?: number;
    softbank?: number;
    rakuten?: number;
  };
}

// ===================================================
// 📊 サブスクデータベース（仮データ）
// ===================================================

export const subscriptionData: SubscriptionData[] = [
  {
    name: "Netflix（セット割）",
    key: "netflix_set",
    category: "動画",
    basePrice: 1490,
    description:
      "各キャリアセット契約時に適用される定額割引・還元率を記入。複数条件がある場合は別列にメモ。",
    discounts: {
      docomo: 100,
      au: 100,
      softbank: 200,
      rakuten: 0,
    },
    rewards: {
      docomo: 0,
      au: 0,
      softbank: 0,
      rakuten: 0,
    },
  },
  {
    name: "Netflix（本体価格還元）",
    key: "netflix_reward",
    category: "動画",
    basePrice: 1490,
    description:
      "各キャリア支払い方法による還元率（dカード払い、PayPay、楽天カードなど）を記入。",
    discounts: {},
    rewards: {
      docomo: 0.1,
      au: 0.05,
      softbank: 0.2,
      rakuten: 0.2,
    },
  },
  {
    name: "Spotify（セット割）",
    key: "spotify_set",
    category: "音楽",
    basePrice: 980,
    description:
      "セット割・経済圏特典など、プラン契約条件に応じた値引き額を記載。",
    discounts: {
      docomo: 100,
      au: 50,
      softbank: 0,
      rakuten: 200,
    },
    rewards: {
      docomo: 0,
      au: 0,
      softbank: 0,
      rakuten: 0,
    },
  },
  {
    name: "Spotify（本体価格還元）",
    key: "spotify_reward",
    category: "音楽",
    basePrice: 980,
    description: "クレカやポイント支払い時の還元率を入力。",
    discounts: {},
    rewards: {
      docomo: 0.05,
      au: 0.03,
      softbank: 0.1,
      rakuten: 0.02,
    },
  },
  {
    name: "Disney+（セット割）",
    key: "disney_set",
    category: "動画",
    basePrice: 990,
    description:
      "キャリアとのセット契約（例：光回線・スマホ同時契約など）時の割引額。",
    discounts: {
      docomo: 990, // 実質無料
      au: 0,
      softbank: 0,
      rakuten: 0,
    },
    rewards: {},
  },
  {
    name: "Disney+（本体価格還元）",
    key: "disney_reward",
    category: "動画",
    basePrice: 990,
    description: "クレカ支払い・PayPay特典などによる還元率。",
    discounts: {},
    rewards: {
      docomo: 0.1,
      au: 0.05,
      softbank: 0.15,
      rakuten: 0.03,
    },
  },
  {
    name: "Amazon Prime（セット割）",
    key: "prime_set",
    category: "総合",
    basePrice: 600,
    description: "固定料金サービスなどは割引なし可。",
    discounts: {},
    rewards: {},
  },
  {
    name: "Amazon Prime（本体価格還元）",
    key: "prime_reward",
    category: "総合",
    basePrice: 600,
    description: "各キャリアのポイント還元施策を明示。",
    discounts: {},
    rewards: {
      docomo: 0.05,
      au: 0.03,
      softbank: 0.02,
      rakuten: 0.02,
    },
  },
  {
    name: "Apple Music（セット割）",
    key: "applemusic_set",
    category: "音楽",
    basePrice: 1080,
    description: "auユーザー特典などキャリア別優遇条件を記載。",
    discounts: {
      docomo: 0,
      au: 100,
      softbank: 0,
      rakuten: 0,
    },
    rewards: {},
  },
  {
    name: "Apple Music（本体価格還元）",
    key: "applemusic_reward",
    category: "音楽",
    basePrice: 1080,
    description: "クレカやポイント支払い時の還元率を入力。",
    discounts: {},
    rewards: {
      docomo: 0.03,
      au: 0.05,
      softbank: 0.1,
      rakuten: 0.01,
    },
  },
];
