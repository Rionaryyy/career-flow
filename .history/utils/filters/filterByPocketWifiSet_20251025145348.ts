import { SetDiscountPlan } from "@/types/planTypes";
import { Phase2Answers } from "@/types/types";

/**
 * ===================================================
 * 📡 ポケットWi-Fi セット割フィルター
 * ===================================================
 */
export function filterByPocketWifiSet(
  answers: Phase2Answers,
  allPocketPlans: SetDiscountPlan[]
): SetDiscountPlan[] {
  const { pocketWifiCapacity, pocketWifiSpeed } = answers;

  // 容量の優先順位を数値化（比較用）
  const capacityRank: Record<string, number> = {
    "〜20GB": 1,
    "〜30GB": 2,
    "〜50GB": 3,
    "〜100GB": 4,
    "無制限": 5,
  };

  // 速度の優先順位を数値化（比較用）
  const speedRank: Record<string, number> = {
    "100Mbps程度": 1,
    "300Mbps程度": 2,
    "500Mbps以上": 3,
    "最大612Mbps": 3,
    "最大1Gbps": 4,
    "最大1.2Gbps": 5,
  };

  const minCapacity = capacityRank[pocketWifiCapacity || "〜20GB"] || 1;
  const minSpeed = speedRank[pocketWifiSpeed || "100Mbps程度"] || 1;

  const matched = allPocketPlans.filter((p) => {
    const planCapacity = capacityRank[p.routerCapacity || "〜20GB"] || 0;
    const planSpeed = speedRank[p.routerSpeed || "100Mbps程度"] || 0;

    // ✅ 条件を緩和：「指定容量以上」かつ「指定速度以上」
    return planCapacity >= minCapacity && planSpeed >= minSpeed;
  });

  const cheapestByCarrier = Object.values(
    matched.reduce((acc, plan) => {
      if (
        !acc[plan.carrier] ||
        acc[plan.carrier].setBaseFee > plan.setBaseFee
      ) {
        acc[plan.carrier] = plan;
      }
      return acc;
    }, {} as Record<string, SetDiscountPlan>)
  );

  console.log("📡 ポケットWi-Fiフィルター適用結果:", {
    pocketWifiCapacity,
    pocketWifiSpeed,
    count: matched.length,
    matched: matched.map((m) => ({
      carrier: m.carrier,
      capacity: m.routerCapacity,
      speed: m.routerSpeed,
      "実質料金": m.setBaseFee - m.setDiscountAmount,
    })),
    "最安プラン": cheapestByCarrier.map((p) => ({
      carrier: p.carrier,
      planName: p.planName,
      "実質料金": p.setBaseFee - p.setDiscountAmount,
    })),
  });

  return cheapestByCarrier;
}
