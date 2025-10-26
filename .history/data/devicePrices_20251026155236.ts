/**
 * ===================================================
 * 📱 返却プログラム一覧（リース型端末・複数機種対応）
 * ---------------------------------------------------
 * 各キャリアが提供する返却前提プログラムを、
 * モデル・容量・キャリアごとに整理。
 * 
 * 💡 今後は installment / one_time / official などの
 *    購入方式も同じ構造で拡張可能。
 * ===================================================
 */

export interface DevicePrice {
  /** モデル名（例：iPhone 17 Pro / Pixel 9 / Galaxy S25） */
  model: string;

  /** ストレージ容量（例：128GB / 256GB / 512GB） */
  storage: string;

  /** 対応キャリア */
  carrier: "docomo" | "au" | "softbank" | "rakuten";

  /** プログラム名称（キャリアごとに異なる） */
  programName: string;

  /** 実質月額（返却前提での月平均支払額・税込） */
  monthlyPayment: number;

  /** 支払い回数（月数） */
  paymentMonths: number;

  /** 返却が前提のプログラムかどうか */
  returnOption: true;

  /** 所有形態：返却前提なので常に "lease" */
  ownershipType: "lease";
}

/**
 * ===================================================
 * 💡 各キャリア別・複数機種のリースプログラム情報
 * ---------------------------------------------------
 * 返却前提（24〜25ヶ月）での実質月額を定義。
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

];
