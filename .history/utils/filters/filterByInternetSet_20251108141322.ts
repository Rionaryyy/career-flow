// ✅ 必要な型を追加
import { DiagnosisAnswers } from "@/types/types";
import { SetDiscountPlan } from "@/types/planTypes";

export function filterByFiberSet(
  answers: DiagnosisAnswers,
  setPlans: SetDiscountPlan[],
  mobilePlanId?: string
): SetDiscountPlan[] {
  // 🔧 入力正規化
  const normalize = (v?: string) =>
    v
      ?.toLowerCase()
      .replace(/house/, "home")
      .replace(/1g/, "1gbps")
      .replace(/2g/, "2gbps")
      .replace(/5g/, "5gbps")
      .replace(/10g/, "10gbps")
      .replace(/ギガ/, "gbps")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      )
      .trim() ?? "";

  const fiberType = normalize(answers.fiberType);
  const fiberSpeed = normalize(answers.fiberSpeed);

  let result = setPlans.filter((p) => p.setCategory === "光回線");

  if (mobilePlanId) {
    result = result.filter(
      (p) =>
        !p.applicablePlanIds || p.applicablePlanIds.includes(mobilePlanId)
    );
  }

  if (fiberType && fiberType !== "any") {
    result = result.filter(
      (p) => !p.fiberType || normalize(p.fiberType) === fiberType
    );
  }

  if (fiberSpeed && fiberSpeed !== "any") {
    const required = fiberSpeed.includes("10gbps") ? 10 : 1;
    result = result.filter((p) => {
      const planSpeed =
        typeof p.fiberSpeed === "string"
          ? parseInt(p.fiberSpeed.replace(/Gbps以上?/i, ""), 10) || 0
          : Number(p.fiberSpeed ?? 0);
      return planSpeed >= required;
    });
  }

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
  });

  return bestByCarrier;
}
