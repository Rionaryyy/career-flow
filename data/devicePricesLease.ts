/**
 * ===================================================
 * 📱 端末価格一覧（キャリア返却プログラム）
 * ---------------------------------------------------
 * 各キャリアのリース・返却プログラムのみを保持。
 * ===================================================
 */

export interface DevicePriceLease {
  model: string;
  storage: string;
  carrier: "docomo" | "au" | "softbank" | "rakuten";
  programName: string;
  monthlyPayment: number;
  paymentMonths: number;
  returnOption: true; // ✅ 常に true
  ownershipType: "lease";
}

/**
 * ===================================================
 * 💡 各キャリア別リース型プログラム情報
 * ===================================================
 */
export const devicePricesLease: DevicePriceLease[] = [
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
];
