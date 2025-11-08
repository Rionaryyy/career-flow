import { fiberDiscountPlans } from "@/data/setDiscounts/fiberDiscountPlans";
import { routerDiscountPlans } from "@/data/setDiscounts/routerDiscountPlans";
import { pocketWifiDiscountPlans } from "@/data/setDiscounts/pocketWifiDiscountPlans";
import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface SetDiscountResult {
  fiberDiscount: number;
  routerDiscount: number;
  pocketWifiDiscount: number;
  electricDiscount: number;
  gasDiscount: number;
  fiberBaseFee: number;
  routerBaseFee: number;
  pocketWifiBaseFee: number;
  debug?: string;
}

/**
 * 🏠 セット割ロジック（Phase2対応版）
 * -----------------------------------------------------
 * 「answers.setDiscount」の英語IDを優先。
 * fiber / router / pocketwifi / electric / gas に対応。
 */
export function calcSetDiscounts(plan: Plan, answers: DiagnosisAnswers): SetDiscountResult {
  let fiberDiscount = 0;
  let routerDiscount = 0;
  let pocketWifiDiscount = 0;
  let electricDiscount = 0;
  let gasDiscount = 0;
  let fiberBaseFee = 0;
  let routerBaseFee = 0;
  let pocketWifiBaseFee = 0;

  const normalize = (t?: string) =>
    t?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/\s+/g, "")
      .trim()
      .toLowerCase() || "";

  const selected = Array.isArray(answers.setDiscount)
    ? answers.setDiscount.map((s) => normalize(s))
    : [];

  // === 🌐 光回線セット ===
  if (selected.includes("fiber") || (answers.fiberType && answers.fiberSpeed)) {
    const type = normalize(answers.fiberType);
    const speed = normalize(answers.fiberSpeed);

    const match = fiberDiscountPlans.find(
      (p) =>
        normalize(p.carrier) === normalize(plan.carrier) &&
        (!p.fiberType || normalize(p.fiberType) === type) &&
        (!p.fiberSpeed || normalize(p.fiberSpeed) === speed)
    );

    if (match) {
      fiberDiscount = match.setDiscountAmount ?? 0;
      fiberBaseFee = match.setBaseFee ?? 0;
      console.log(`🌐 光セット割: ${plan.carrier} -¥${fiberDiscount}/月`);
    }
  }

  // === 📶 ホームルーターセット ===
  if (selected.includes("router") || (answers.routerCapacity && answers.routerSpeed)) {
    const speed = normalize(answers.routerSpeed);

    const match = routerDiscountPlans.find(
      (p) =>
        normalize(p.carrier) === normalize(plan.carrier) &&
        (!p.routerSpeed || normalize(p.routerSpeed) === speed)
    );

    if (match) {
      routerDiscount = match.setDiscountAmount ?? 0;
      routerBaseFee = match.setBaseFee ?? 0;
      console.log(`📶 ルーター割: ${plan.carrier} -¥${routerDiscount}/月`);
    }
  }

  // === 📡 ポケットWi-Fiセット ===
  if (selected.includes("pocketwifi") || answers.pocketWifiCapacity || answers.pocketWifiSpeed) {
    const cap = normalize(answers.pocketWifiCapacity);
    const speed = normalize(answers.pocketWifiSpeed);

    const match = pocketWifiDiscountPlans.find(
      (p) =>
        normalize(p.carrier) === normalize(plan.carrier) &&
        (
          (p.routerCapacity && normalize(p.routerCapacity) === cap) ||
          (p.routerSpeed && normalize(p.routerSpeed) === speed)
        )
    );

    if (match) {
      pocketWifiDiscount = match.setDiscountAmount ?? 0;
      pocketWifiBaseFee = match.setBaseFee ?? 0;
      console.log(`📡 ポケットWi-Fi割: ${plan.carrier} -¥${pocketWifiDiscount}/月`);
    }
  }

  // === 🔌 電気・ガスセット ===
  const raw = selected.join(",");
  if (
    (raw.includes("electric") || raw.includes("電気")) &&
    plan.supportsElectricSet &&
    plan.energyDiscountRules
  ) {
    const match = plan.energyDiscountRules.find(
      (r) => normalize(r.type).includes("electric") || r.type === "電気"
    );
    if (match) electricDiscount = match.discount;
  }

  if (
    (raw.includes("gas") || raw.includes("ガス")) &&
    plan.supportsGasSet &&
    plan.energyDiscountRules
  ) {
    const match = plan.energyDiscountRules.find(
      (r) => normalize(r.type).includes("gas") || r.type === "ガス"
    );
    if (match) gasDiscount = match.discount;
  }

  const debug = `📦 fiber=${fiberDiscount}, router=${routerDiscount}, pocket=${pocketWifiDiscount}, electric=${electricDiscount}, gas=${gasDiscount}`;

  return {
    fiberDiscount,
    routerDiscount,
    pocketWifiDiscount,
    electricDiscount,
    gasDiscount,
    fiberBaseFee,
    routerBaseFee,
    pocketWifiBaseFee,
    debug,
  };
}
