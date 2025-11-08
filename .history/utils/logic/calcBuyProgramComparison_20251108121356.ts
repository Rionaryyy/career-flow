import { devicePricesBuy, DevicePriceBuy } from "@/data/devicePricesBuy";

/**
 * 💰 キャリア端末購入比較ロジック（精密版）
 * ---------------------------------------------------
 * 指定された端末モデル・容量に一致する
 * 各キャリアの購入プラン（分割／一括）を抽出・比較。
 */
export interface BuyProgramResult {
  carrier: string;
  programName: string;
  monthlyCost: number;
  totalPaid: number;
  paymentType: "installment" | "one_time";
  remarks: string;
}

export function compareBuyPrograms(
  model: string,
  storage: string,
  deviceList: DevicePriceBuy[] = devicePricesBuy
): BuyProgramResult[] {
  const normalize = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .trim();

  const nModel = normalize(model);
  const nStorage = normalize(storage);

  // ✅ モデル＋ストレージ一致かつ購入型のみ抽出
  const targets = deviceList.filter((d) => {
    const m = normalize(d.model);
    const s = normalize(d.storage);
    return (
      m.includes(nModel) &&
      s.includes(nStorage) &&
      d.ownershipType === "buy" &&
      d.returnOption === false
    );
  });

  // ✅ 結果を構築
  return targets.map((d) => {
    const monthlyCost = Number(d.monthlyPayment ?? 0);
    const months = Number(d.paymentMonths ?? 1);
    const totalPaid = Math.round(monthlyCost * months);

    const remarks =
      d.paymentType === "installment"
        ? `分割支払い (${months}ヶ月 × ¥${Math.round(monthlyCost).toLocaleString()})`
        : `一括購入（総額 ¥${totalPaid.toLocaleString()}）`;

    return {
      carrier: d.carrier,
      programName: d.programName,
      monthlyCost,
      totalPaid,
      paymentType: d.paymentType,
      remarks,
    };
  });
}
