export interface DevicePrice {
  model: string;
  storage: string;
  carrier: "docomo" | "au" | "softbank" | "rakuten";
  programName: string;              // 返却プログラム名
  monthlyPayment: number;           // 返却前提の月額支払額（税込）
  paymentMonths: number;            // 支払回数（例：24, 25など）
  returnOption: boolean;            // true = 返却必須
  ownershipType: "lease";           // 所有なし（リース）
}

export const devicePrices: DevicePrice[] = [
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "docomo",
    programName: "いつでもカエドキプログラム",
    monthlyPayment: 4163,   // 実質月額（24ヶ月返却時）
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "softbank",
    programName: "新トクするサポート",
    monthlyPayment: 4140,   // 実質月額（24ヶ月返却時）
    paymentMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "au",
    programName: "スマホトクするプログラム",
    monthlyPayment: 4251,   // 実質月額（25ヶ月返却時）
    paymentMonths: 25,
    returnOption: true,
    ownershipType: "lease",
  },
];
