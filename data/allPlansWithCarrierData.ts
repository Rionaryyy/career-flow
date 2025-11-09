// data/allPlansWithCarrierData.ts
import plans from "./plans.json";
import carrierSpecificList from "./carrierSpecific.json";
import { Plan, CarrierSpecific } from "@/types/planTypes";

// plans.json が「生の」オブジェクトなので、Plan に寄せながら carrierSpecific をくっつける
export const allPlansWithCarrierData: Plan[] = (plans as any[]).map((plan, index) => {
  // プランの carrier は「ドコモ」「au」みたいな日本語なので、そのまま使う
  const matched = (carrierSpecificList as CarrierSpecific[]).find(
    (c) => c.carrier === plan.carrier
  );

  return {
    // plans.json にあるものは全部展開
    ...plan,
    // 念のため planId がない行には自動採番（ほぼないと思うけど保険）
    planId: plan.planId || `plan_${index + 1}`,
    // ここでキャリア依存をくっつける
    carrierSpecific: matched,
  } as Plan;
});
