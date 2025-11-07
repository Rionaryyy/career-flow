import { SetDiscountPlan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

/**
 * ===================================================
 * 📡 ポケットWi-Fi セット割フィルター（拡張版）
 * ---------------------------------------------------
 * - 容量・速度で絞り込み
 * - applicablePlanIds（紐づけ）考慮
 * - 各キャリアごとに最安プランを抽出
 * ===================================================
 */
export function filterByPocketWifiSet(
  answers: DiagnosisAnswers,
  allPocketPlans: SetDiscountPlan[],
  mobilePlanId?: string // ✅ モバイルプランIDで紐づけ
): SetDiscountPlan[] {
  const { pocketWifiCapacity, pocketWifiSpeed } = answers;

  // 容量の優先順位を数値化
  const capacityRank: Record<string, number> = {
    "〜20GB": 1,
    "〜30GB": 2,
    "〜50GB": 3,
    "〜100GB": 4,
    "無制限": 5,
  };

  // 速度の優先順位を数値化
  const speedRank: Record<string, number> = {
    "100Mbps程度": 1,
    "150Mbps": 1,
    "300Mbps程度": 2,
    "440Mbps": 2,
    "500Mbps以上": 3,
    "612Mbps": 3,
    "最大1Gbps": 4,
    "最大2Gbps": 5,
    "最大4Gbps": 6,
    "最大10Gbps": 7,
  };

  const minCapacity = capacityRank[pocketWifiCapacity || "〜20GB"] || 1;
  const minSpeed = speedRank[pocketWifiSpeed || "100Mbps程度"] || 1;

  // 💡 紐づけされたプランのみ対象
  let result = allPocketPlans.filter(
    (p) =>
      (!p.applicablePlanIds || !mobilePlanId) ||
      p.applicablePlanIds.includes(mobilePlanId)
  );

  // ⚙️ 条件一致（容量・速度ともに下限以上）
  result = result.filter((p) => {
    const planCapacity = capacityRank[p.routerCapacity || "〜20GB"] || 0;
    const planSpeed = speedRank[p.routerSpeed || "100Mbps程度"] || 0;
    return planCapacity >= minCapacity && planSpeed >= minSpeed;
  });

  // 🧮 各キャリアごとに最安プランを抽出
  const cheapestByCarrier = Object.values(
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

  // 🧾 デバッグログ
  console.log("📡 ポケットWi-Fiフィルター適用結果:", {
    mobilePlanId,
    pocketWifiCapacity,
    pocketWifiSpeed,
    count: result.length,
    matched: result.map((m) => ({
      carrier: m.carrier,
      capacity: m.routerCapacity,
      speed: m.routerSpeed,
      実質料金: m.setBaseFee - m.setDiscountAmount,
    })),
    最安プラン: cheapestByCarrier.map((p) => ({
      carrier: p.carrier,
      planName: p.planName,
      実質料金: p.setBaseFee - p.setDiscountAmount,
    })),
  });

  return cheapestByCarrier;
}
