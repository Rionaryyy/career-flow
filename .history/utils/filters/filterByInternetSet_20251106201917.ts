import { DiagnosisAnswers } from "@/types/types";
import { SetDiscountPlan } from "@/types/planTypes";

/**
 * ===================================================
 * 🌐 光回線セット割フィルター
 * ---------------------------------------------------
 * - ユーザー回答 (住宅タイプ・速度) に基づいて絞り込み
 * - applicablePlanIds に基づいてモバイルプラン対応も考慮
 * - 各キャリアで最安プランを1件だけ抽出
 * ===================================================
 */
export function filterByFiberSet(
  answers: DiagnosisAnswers,
  setPlans: SetDiscountPlan[],
  mobilePlanId?: string // ✅ 現在のモバイルプランID（紐付け判定用）
): SetDiscountPlan[] {
  const { fiberType, fiberSpeed } = answers;

  // 🌐 光回線カテゴリに限定
  let result = setPlans.filter((p) => p.setCategory === "光回線");

  // 💡 モバイルプランとの紐づけチェック（applicablePlanIds）
  if (mobilePlanId) {
    result = result.filter(
      (p) =>
        !p.applicablePlanIds || p.applicablePlanIds.includes(mobilePlanId)
    );
  }

  // 🏠 住宅タイプフィルタ
  if (fiberType && fiberType !== "指定なし") {
    result = result.filter((p) => !p.fiberType || p.fiberType === fiberType);
  }

  // ⚙️ 通信速度フィルタ（例: "1Gbps以上" → 1）
  if (fiberSpeed && fiberSpeed !== "特にこだわらない") {
    const required = parseInt(fiberSpeed.replace("Gbps以上", ""), 10) || 0;
    result = result.filter((p) => {
      const planSpeed =
        parseInt(String(p.fiberSpeed)?.replace("Gbps以上", ""), 10) || 0;
      return planSpeed >= required;
    });
  }

  // 🧮 キャリアごとに「実質料金（基本料金 - 割引額）」が最も安いプランを抽出
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

  // 🧾 ログ出力（開発用）
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
