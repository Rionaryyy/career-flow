// /data/devicePrices.ts
export interface DevicePrice {
  model: string;
  storage: string;
  carrier: "docomo" | "au" | "softbank" | "rakuten";
  programName: string;              // 返却プログラム名
  fullPrice: number;                // 総額（税込）
  months: number;                   // 分割月数
  returnAfterMonths: number;        // 返却タイミング
  returnOption: boolean;            // true = 返却必須
  ownershipType: "lease";           // 所有なし（リース）
}

export const devicePrices: DevicePrice[] = [
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "docomo",
    programName: "いつでもカエドキプログラム",
    fullPrice: 199800,
    months: 48,
    returnAfterMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "softbank",
    programName: "新トクするサポート",
    fullPrice: 198720,
    months: 48,
    returnAfterMonths: 24,
    returnOption: true,
    ownershipType: "lease",
  },
  {
    model: "iPhone 17 Pro",
    storage: "512GB",
    carrier: "au",
    programName: "スマホトクするプログラム",
    fullPrice: 199980,
    months: 49,
    returnAfterMonths: 25,
    returnOption: true,
    ownershipType: "lease",
  },
];
