import { devicePricesLease, DevicePriceLease } from "@/data/devicePricesLease";

/**
 * 📊 返却（リース）プログラム比較ロジック
 * ---------------------------------------------------
 * 指定モデル・容量に一致するリース型端末プログラムを抽出。
 * 各キャリアの実質月額と総支払額（返却前提）を比較。
 */
export interface ReturnProgramResult {
  carrier: string;
  programName: string;
  monthlyCost: number;
  totalPaid: number;
  remarks: string;
}

export function compareReturnPrograms(
  model: string,
  storage: string,
  deviceList: DevicePriceLease[] = devicePricesLease
): ReturnProgramResult[] {
  const normalize = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .trim();

  const nModel = normalize(model);
  const nStorage = normalize(storage);

  // 対象のリース型プログラムを抽出（部分一致対応）
  const targets = deviceList.filter((d) => {
    const m = normalize(d.model);
    const s = normalize(d.storage);
    return (
      m.includes(nModel) &&
      s.includes(nStorage) &&
      d.returnOption === true &&
      d.ownershipType === "lease"
    );
  });

  // 各キャリアごとの支払情報を整形
  return targets.map((d) => {
    const monthlyCost = Number(d.monthlyPayment ?? 0);
    const months = Number(d.paymentMonths ?? 1);
    const totalPaid = Math.round(monthlyCost * months);
    const remarks = `返却前提 (${months}ヶ月利用)`;

    return {
      carrier: d.carrier,
      programName: d.programName,
      monthlyCost,
      totalPaid,
      remarks,
    };
  });
}
