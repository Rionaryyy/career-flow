// /utils/logic/calcBuyProgramComparison.ts
import { devicePricesBuy, DevicePriceBuy } from "@/data/devicePricesBuy";

/**
 * ===================================================
 * 💰 キャリア端末購入比較ロジック
 * ---------------------------------------------------
 * 指定された機種・容量における各キャリアの
 * 購入プラン（分割／一括）の月額・総額を比較。
 * 
 * ※ 新構造対応版（monthlyPayment / paymentMonthsベース）
 * ===================================================
 */

export interface BuyProgramResult {
  carrier: string;       // キャリア名
  programName: string;   // プログラム名
  monthlyCost: number;   // 実質月額（税込）
  totalPaid: number;     // 支払総額（税込）
  paymentType: "installment" | "one_time"; // 支払い種別
  remarks: string;       // 備考
}

export function compareBuyPrograms(
  model: string,
  storage: string,
  deviceList: DevicePriceBuy[] = devicePricesBuy
): BuyProgramResult[] {
  // 指定モデル＋容量に一致する購入プランを抽出
  const targets = deviceList.filter(
    (d) =>
      d.model === model &&
      d.storage === storage &&
      d.returnOption === false &&
      d.ownershipType === "buy"
  );

  // 整形して返却
  return targets.map((d) => {
    const monthlyCost = d.monthlyPayment;
    const totalPaid = monthlyCost * d.paymentMonths;

    const remarks =
      d.paymentType === "installment"
        ? `${d.paymentMonths}ヶ月分割払い`
        : `一括購入（目安: ¥${Math.round(totalPaid).toLocaleString()}）`;

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
