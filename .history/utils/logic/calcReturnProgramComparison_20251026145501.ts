// /utils/logic/calcReturnProgramComparison.ts
import { DevicePrice } from "@/data/devicePrices";

export interface ReturnProgramResult {
  carrier: string;       // キャリア名
  programName: string;   // プログラム名
  monthlyCost: number;   // 実質月額（税込）
  totalPaid: number;     // 支払総額（返却前提）
  remarks: string;       // 備考（例：24ヶ月返却）
}

/**
 * ===================================================
 * 📊 返却プログラム比較ロジック
 * ---------------------------------------------------
 * 指定された機種・容量における各キャリアの
 * 返却プログラム（リース型）の月額・総額を比較。
 * 
 * ※ 新構造対応版（monthlyPayment / paymentMonthsベース）
 * ===================================================
 */
export function compareReturnPrograms(
  model: string,
  storage: string,
  devicePrices: DevicePrice[]
): ReturnProgramResult[] {
  // 対象のリース型プログラムのみ抽出
  const targets = devicePrices.filter(
    (d) =>
      d.model === model &&
      d.storage === storage &&
      d.returnOption === true &&
      d.ownershipType === "lease"
  );

  // 各キャリアごとの支払情報を整形
  return targets.map((d) => {
    const monthlyCost = d.monthlyPayment;
    const totalPaid = monthlyCost * d.paymentMonths;

    const remarks = `${d.paymentMonths}ヶ月返却前提プログラム`;

    return {
      carrier: d.carrier,
      programName: d.programName,
      monthlyCost,
      totalPaid,
      remarks,
    };
  });
}
