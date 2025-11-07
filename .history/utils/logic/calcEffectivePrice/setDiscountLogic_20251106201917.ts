// utils/logic/calcEffectivePrice/setDiscountLogic.ts
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
}

export function calcSetDiscounts(plan: Plan, answers: DiagnosisAnswers): SetDiscountResult {
  let fiberDiscount = 0;
  let routerDiscount = 0;
  let pocketWifiDiscount = 0;
  let electricDiscount = 0;
  let gasDiscount = 0;
  let fiberBaseFee = 0;
  let routerBaseFee = 0;
  let pocketWifiBaseFee = 0;

  const normalizeText = (text: string) =>
    text
      ?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/Gps/gi, "Gbps")
      .replace(/\s+/g, "")
      .trim() || "";

  // === 光回線割 ===
  if (answers.fiberType && answers.fiberSpeed) {
    const ansFiberType = normalizeText(answers.fiberType);
    const ansFiberSpeed = normalizeText(answers.fiberSpeed);
    const match = fiberDiscountPlans.find(
      (p: any) =>
        p.carrier === plan.carrier &&
        (!p.fiberType || normalizeText(p.fiberType) === ansFiberType) &&
        (!p.fiberSpeed || normalizeText(p.fiberSpeed) === ansFiberSpeed)
    );
    if (match) {
      fiberDiscount = match.setDiscountAmount;
      fiberBaseFee = match.setBaseFee ?? 0;
      console.log(`🌐 光セット割: ${plan.carrier} -¥${fiberDiscount}/月`);
    }
  }

  // === ホームルーター割 ===
  if (answers.routerCapacity && answers.routerSpeed) {
    const ansSpeed = normalizeText(answers.routerSpeed);
    const match = routerDiscountPlans.find(
      (p: any) =>
        p.carrier === plan.carrier && normalizeText(p.routerSpeed ?? "") === ansSpeed
    );
    if (match) {
      routerDiscount = match.setDiscountAmount;
      routerBaseFee = match.setBaseFee ?? 0;
      console.log(`📶 ルーター割: ${plan.carrier} -¥${routerDiscount}/月`);
    }
  }

  // === ポケットWi-Fi割 ===
  if (answers.pocketWifiCapacity || answers.pocketWifiSpeed) {
    const ansCapacity = normalizeText(answers.pocketWifiCapacity ?? "");
    const ansSpeed = normalizeText(answers.pocketWifiSpeed ?? "");

    const match = pocketWifiDiscountPlans.find(
      (p: any) =>
        p.carrier?.toLowerCase() === plan.carrier?.toLowerCase() &&
        (
          (p.routerCapacity && normalizeText(p.routerCapacity) === ansCapacity) ||
          (p.routerSpeed && normalizeText(p.routerSpeed) === ansSpeed)
        )
    );

    if (match) {
      pocketWifiDiscount = match.setDiscountAmount ?? 0;
      pocketWifiBaseFee = match.setBaseFee ?? 0;
      console.log(`📡 ポケットWi-Fi割: ${plan.carrier} -¥${pocketWifiDiscount}/月`);
    }
  }

  // === 電気・ガス割 ===
  const setDiscountText = Array.isArray(answers.setDiscount)
    ? answers.setDiscount.join(",")
    : (answers.setDiscount ?? "");

  if (setDiscountText.includes("電気") && plan.supportsElectricSet && plan.energyDiscountRules) {
    const match = plan.energyDiscountRules.find((r) => r.type === "電気");
    if (match) electricDiscount = match.discount;
  }

  if (setDiscountText.includes("ガス") && plan.supportsGasSet && plan.energyDiscountRules) {
    const match = plan.energyDiscountRules.find((r) => r.type === "ガス");
    if (match) gasDiscount = match.discount;
  }

  return {
    fiberDiscount,
    routerDiscount,
    pocketWifiDiscount,
    electricDiscount,
    gasDiscount,
    fiberBaseFee,
    routerBaseFee,
    pocketWifiBaseFee,
  };
}
