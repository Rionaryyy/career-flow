import { DiagnosisAnswers } from "@/types/types";
import { SetDiscountPlan } from "@/types/planTypes";

/**
 * ===================================================
 * 📶 ルーターセット割フィルター（拡張版）
 * ---------------------------------------------------
 * - 容量・速度で絞り込み
 * - applicablePlanIds によるモバイルプラン紐づけに対応
 * - 各キャリアごとに最安プランを抽出
 * ===================================================
 */
export function filterByRouterSet(
  answers: DiagnosisAnswers,
  setPlans: SetDiscountPlan[],
  mobilePlanId?: string // ✅ 紐づけ対象のモバイルプランID
): SetDiscountPlan[] {
  const { routerCapacity, routerSpeed } = answers;

  // 📶 ルーターカテゴリに限定
  let result = setPlans.filter((p) => p.setCategory === "ルーター");

  // 💡 モバイルプランとの紐づけ（applicablePlanIds）
  if (mobilePlanId) {
    result = result.filter(
      (p) =>
        !p.applicablePlanIds || p.applicablePlanIds.includes(mobilePlanId)
    );
  }

  // 💾 データ容量フィルタ（指定容量以上）
  if (routerCapacity && routerCapacity !== "特にこだわらない") {
    const requiredGB =
      parseInt(routerCapacity.replace(/[^\d]/g, ""), 10) || 0;

    result = result.filter((p) => {
      const planGB =
        parseInt(String(p.routerCapacity)?.replace(/[^\d]/g, ""), 10) || 0;
      return planGB >= requiredGB; // ✅ 上位互換OK
    });
  }

  // ⚙️ 通信速度フィルタ（指定速度以上）
  if (routerSpeed && routerSpeed !== "特にこだわらない") {
    const requiredSpeed =
      parseInt(routerSpeed.replace(/[^\d]/g, ""), 10) || 0;

    result = result.filter((p) => {
      const planSpeed =
        parseInt(String(p.routerSpeed)?.replace(/[^\d]/g, ""), 10) || 0;
      return planSpeed >= requiredSpeed; // ✅ より高速なものも通過
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

  // 🧾 ログ出力（開発確認用）
  console.log("📶 ルーターフィルター適用結果:", {
    mobilePlanId,
    routerCapacity,
    routerSpeed,
    count: result.length,
    matched: result.map((p) => ({
      carrier: p.carrier,
      capacity: p.routerCapacity,
      speed: p.routerSpeed,
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
