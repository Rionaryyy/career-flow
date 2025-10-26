/**
 * ===================================================
 * 💰 キャリア端末購入価格（返却なし・所有型）
 * ---------------------------------------------------
 * 分割払い／一括購入を対象。
 * ===================================================
 */
export interface DevicePriceBuy {
  model: string;
  storage: string;
  carrier: "docomo" | "au" | "softbank" | "rakuten";
  programName: string;
  monthlyPayment: number;
  paymentMonths: number;
  returnOption: false;
  ownershipType: "buy";
  paymentType: "installment" | "one_time";
}

// 💡 データ例
export const devicePricesBuy: DevicePriceBuy[] = [
  // === 🍎 iPhone 17 Pro（256GB） ===
  {
    model: "iPhone 17 Pro",
    storage: "256GB",
    carrier: "docomo",
    programName: "ドコモ端末購入プログラム（分割24回）",
    monthlyPayment: 7200,
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "installment",
  },
  {
    model: "iPhone 17 Pro",
    storage: "256GB",
    carrier: "au",
    programName: "au端末購入（分割24回）",
    monthlyPayment: 7150,
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "installment",
  },
  {
    model: "iPhone 17 Pro",
    storage: "256GB",
    carrier: "softbank",
    programName: "ソフトバンク端末購入（分割24回）",
    monthlyPayment: 7180,
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "installment",
  },
  {
    model: "iPhone 17 Pro",
    storage: "256GB",
    carrier: "docomo",
    programName: "ドコモ一括購入",
    monthlyPayment: Math.round(172800 / 24),
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "one_time",
  },
  {
    model: "Galaxy S25 Ultra",
    storage: "256GB",
    carrier: "softbank",
    programName: "ソフトバンク端末購入（分割24回）",
    monthlyPayment: 7300,
    paymentMonths: 24,
    returnOption: false,
    ownershipType: "buy",
    paymentType: "installment",
  },
];
