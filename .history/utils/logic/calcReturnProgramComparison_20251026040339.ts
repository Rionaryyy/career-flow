// /utils/logic/calcReturnProgramComparison.ts
import { devicePrices } from "@/data/devicePrices";

/**
 * 指定された端末モデルとストレージに対して、
 * 各キャリアの返却プログラムを比較する関数。
 */
export function calcReturnProgramComparison(model: string, storage: string) {
  return devicePrices
    .filter(
      (d) =>
        d.model === model &&
        d.storage === storage &&
        d.ownershipType === "lease"
    )
    .map((d) => ({
      carrier: d.carrier,
      programName: d.programName,
      monthlyCost: Math.round(d.fullPrice / d.months),
      returnAfter: d.returnAfterMonths,
    }));
}
