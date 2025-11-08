import { DiagnosisAnswers } from "@/types/types";
import { SetDiscountPlan } from "@/types/planTypes";

/**
 * ===================================================
 * 🌐 光回線セット割フィルター（ID/value対応版）
 * ---------------------------------------------------
 * - fiberType: "home" | "apartment"
 * - fiberSpeed: "1gbps" | "10gbps" | "any"
 * ===================================================
 */
export function filterByFiberSet(
  answers: DiagnosisAnswers,
  setPlans: SetDiscountPlan[],
  mobilePlanId?: string
): SetDiscountPlan[] {
  const { fiberType, fiberSpeed } = answers;

  // 🌐 光回線カテゴリに限定
  let result = setPlans.filter((p) => p.setCategory === "光回線");

  // 💡 モバイルプランとの紐づけチェック
  if (mobilePlanId) {
    result = result.filter(
      (p) =>
        !p.applicablePlanIds || p.applicablePlanIds.includes(mobilePlanId)
    );
  }

  // 🏠 住宅タイプフィルタ
  // fiberType: "home" (戸建て) / "apartment" (集合住宅) / "any" (指定なし)
  if (fiberType && fiberType !== "any") {
    result = result.filter(
      (p) => !p.fiberType || p.fiberType === fiberType
    );
  }

  // ⚙️ 通信速度フィルタ
  // fiberSpeed: "1gbps" / "10gbps" / "any"
  if (fiberSpeed && fiberSpeed !== "any") {
    const required = fiberSpeed === "10gbps" ? 10 : 1;
    result = result.filter((p) => {
      const planSpeed =
        typeof p.fiberSpeed === "string"
          ? parseInt(p.fiberSpeed.replace(/Gbps以上?/i, ""), 10) || 0
          : Number(p.fiberSpeed ?? 0);
      return planSpeed >= required;
    });
  }

  // 🧮 キャリアごとに最安プラン抽出
  const bestByCarrier = Object.values(
    result.reduce((acc, plan) => {
      const actualCost = plan.setBaseFee - plan.setDiscountAmount;
      const carrier = plan.carrier;
      if (
        !acc[carrier] ||
        actualCost < acc[carrier].setBaseFee - acc[carrier].setDiscountAmount
      ) {
        acc[carrier] = plan;
      }
      return acc;
    }, {} as Record<string, SetDiscountPlan>)
  );

  // 🧾 デバッグ出力
  console.log("🌐 光回線フィルター適用結果:", {
    mobilePlanId,
    fiberType,
    fiberSpeed,
    count: result.length,
    matched: result.map((p) => ({
      carrier: p.carrier,
      planId: p.planId,
      fiberType: p.fiberType,
      speed: p.fiberSpeed,
      実質料金: p.setBaseFee - p.setDiscountAmount,
    })),
    最安プラン: bestByCarrier.map((p) => ({
      carrier: p.carrier,
      planName: p.planName,
      実質料金: p.setBaseFee - p.setDiscountAmount,
    })),
  });

  return bestByCarrier;
}
