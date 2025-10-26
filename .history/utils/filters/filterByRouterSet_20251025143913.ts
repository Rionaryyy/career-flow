import { Phase2Answers } from "@/types/types";
import { SetDiscountPlan } from "@/types/planTypes";

export function filterByRouterSet(
  answers: Phase2Answers,
  setPlans: SetDiscountPlan[]
): SetDiscountPlan[] {
  const { routerCapacity, routerSpeed } = answers;

  // 📶 ルーターカテゴリのみ抽出
  let result = setPlans.filter((p) => p.setCategory === "ルーター");

  // 💾 データ容量フィルタ（下限以上を許容）
  if (routerCapacity && routerCapacity !== "特にこだわらない") {
    const requiredGB =
      parseInt(routerCapacity.replace(/[^\d]/g, ""), 10) || 0;

    result = result.filter((p) => {
      const planGB =
        parseInt(String(p.routerCapacity)?.replace(/[^\d]/g, ""), 10) || Infinity;
      return planGB >= requiredGB; // ✅ 上位互換（より多い容量）も通過
    });
  }

  // ⚙️ 通信速度フィルタ（下限以上を許容）
  if (routerSpeed && routerSpeed !== "特にこだわらない") {
    const requiredSpeed =
      parseInt(routerSpeed.replace(/[^\d]/g, ""), 10) || 0;

    result = result.filter((p) => {
      const planSpeed =
        parseInt(String(p.routerSpeed)?.replace(/[^\d]/g, ""), 10) || Infinity;
      return planSpeed >= requiredSpeed; // ✅ 上位互換（より高速）も通過
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

  console.log("📶 ルーターフィルター適用結果:", {
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
