/**
 * ===================================================
 * 📱 端末価格一覧（リース型＋正規店購入）
 * ---------------------------------------------------
 * キャリア返却プログラム + 正規店購入を統合。
 * ===================================================
 */

export interface DevicePrice {
  model: string;
  storage: string;
  carrier: "docomo" | "au" | "softbank" | "rakuten" | "apple" | "google";
  programName: string;
  monthlyPayment: number;
  paymentMonths: number;
  returnOption: boolean; // ✅ 常に true or false
  ownershipType: "lease" | "buy";
  paymentType?: "installment" | "one_time";
}

/**
 * ===================================================
 * 💡 各キャリア別および正規店のプログラム情報
 * ===================================================
 */
export const devicePrices: DevicePrice[] = [
  // === 🍎 iPhone 17 Pro（512GB） ===
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "docomo",
    programName: "いつでもカエドキプログラム",
    monthlyPayment: 4163,
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "softbank",
    programName: "新トクするサポート",
    monthlyPayment: 4140,
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "au",
    programName: "スマホトクするプログラム",
    monthlyPayment: 4251,
    paymentMonths: 25,
    returnOption: true,
    ownershipType: "lease",
  },

  // === 📸 Galaxy S25 Ultra（256GB） ===
  {
    model: "Galaxy S25 Ultra",
    storage: "256GB",
    carrier: "docomo",
    programName: "いつでもカエドキプログラム",
    monthlyPayment: 4520,
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "Galaxy S25 Ultra",
    storage: "256GB",
    carrier: "au",
    programName: "スマホトクするプログラム",
    monthlyPayment: 4680,
    paymentMonths: 25,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "Galaxy S25 Ultra",
    storage: "256GB",
    carrier: "softbank",
    programName: "新トクするサポート",
    monthlyPayment: 4490,
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },

  // === 📱 Pixel 9（128GB） ===
  {
    model: "Pixel 9",
    storage: "128GB",
    carrier: "softbank",
    programName: "新トクするサポート",
    monthlyPayment: 3570,
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "Pixel 9",
    storage: "128GB",
    carrier: "au",
    programName: "スマホトクするプログラム",
    monthlyPayment: 3640,
    paymentMonths: 25,
    returnOption: true,
    ownershipType: "lease",
  },

  // === 🍎 iPhone 17 Pro（256GB） ===
  {
    model: "iPhone 17 Pro",
    storage: "256GB",
    carrier: "docomo",
    programName: "いつでもカエドキプログラム",
    monthlyPayment: 3960,
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "iPhone 17 Pro",
    storage: "256GB",
    carrier: "softbank",
    programName: "新トクするサポート",
    monthlyPayment: 3980,
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "iPhone 17 Pro",
    storage: "256GB",
    carrier: "au",
    programName: "スマホトクするプログラム",
    monthlyPayment: 4070,
    paymentMonths: 25,
    returnOption: true,
    ownershipType: "lease",
  },

  /* ===================================================
   * 🏬 正規店購入（Apple / Google公式）
   * =================================================== */

  // --- 🍎 Apple Store ---
  {
    model: "iPhone 17 Pro",
    storage: "256GB",
    carrier: "apple",
    programName: "Apple Store 分割24回（所有型）",
    monthlyPayment: 7200,
    paymentMonths: 24,
    returnOption: false, // ✅ 正規店は返却なし
    ownershipType: "buy",
    paymentType: "installment",
  },
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "apple",
    programName: "Apple Store 分割24回（所有型）",
    monthlyPayment: 8500,
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "installment",
  },
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "apple",
    programName: "Apple Store 一括購入（所有型）",
    monthlyPayment: Math.round(204000 / 24), // 実質換算
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "one_time",
  },

  // --- 📱 Google Store ---
  {
    model: "Pixel 9",
    storage: "128GB",
    carrier: "google",
    programName: "Google Store 分割24回（所有型）",
    monthlyPayment: 4200,
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "installment",
  },
  {
    model: "Pixel 9",
    storage: "128GB",
    carrier: "google",
    programName: "Google Store 一括購入（所有型）",
    monthlyPayment: Math.round(96000 / 24),
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "one_time",
  },
];
