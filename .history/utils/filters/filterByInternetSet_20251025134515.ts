import { Phase2Answers } from "@/types/types";
import { SetDiscountPlan } from "@/types/planTypes";

export function filterByInternetSet(
  answers: Phase2Answers,
  setPlans: SetDiscountPlan[]
): SetDiscountPlan[] {
  const { fiberType, fiberSpeed } = answers;

  // 光回線カテゴリのみ抽出
  let result = setPlans.filter((p) => p.setCategory === "光回線");

  // 🏠 住宅タイプフィルタ
  if (fiberType) {
    result = result.filter((p) => !p.fiberType || p.fiberType === fiberType);
  }

  // ⚙️ 通信速度フィルタ
  if (fiberSpeed && fiberSpeed !== "特にこだわらない") {
    const required = parseInt(fiberSpeed.replace("Gbps以上", ""), 10) || 0;
    result = result.filter((p) => {
      const planSpeed =
        parseInt(String(p.fiberSpeed)?.replace("Gbps以上", ""), 10) || 0;
      return planSpeed >= required;
    });
  }

  // 🧮 キャリアごとに「実質料金（基本料金 - 割引額）」が最も安いプランを1つだけ抽出
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

  console.log("🌐 光回線フィルター適用結果:", {
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
