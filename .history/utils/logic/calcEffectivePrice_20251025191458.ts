import { Plan } from "../../types/planTypes";
import { DiagnosisAnswers } from "../../types/types";
import { fiberDiscountPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { routerDiscountPlans } from "../../data/setDiscounts/routerDiscountPlans";
import { pocketWifiDiscountPlans } from "../../data/setDiscounts/pocketWifiDiscountPlans";

export interface PlanCostBreakdown {
  baseFee: number;
  callOptionFee: number;
  familyDiscount: number;
  studentDiscount: number;
  ageDiscount: number;
  economyDiscount: number;
  deviceDiscount: number;
  cashback: number;
  initialFeeMonthly: number;
  tetheringFee: number;
  total: number;
  // 🏠 セット割フィールドを追加
  fiberDiscount?: number;
  routerDiscount?: number;
  pocketWifiDiscount?: number;
  electricDiscount?: number; // ⚡ 電気割
  gasDiscount?: number; // 🔥 ガス割
}

export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers): PlanCostBreakdown {
  const base = plan.baseMonthlyFee ?? 0;

  // === 通話オプション料金（上位互換を含む）===
  let callOptionFee = 0;
  if (plan.callOptions?.length) {
    const callOptionMap: Record<string, string> = {
      "5分以内": "5min",
      "10分以内": "10min",
      "月30分まで無料": "monthly30",
      "月60分まで無料": "monthly60",
      "月30回まで各10分無料": "hybrid_30x10",
      "無制限（完全定額）": "unlimited",
    };

    const allTexts = [
      answers.phase2?.timeLimitPreference,
      answers.phase2?.monthlyLimitPreference,
      answers.phase2?.hybridCallPreference,
      ...(answers.phase2?.callPlanType ?? []),
    ].filter(Boolean);

    const matchedIds = Object.entries(callOptionMap)
      .filter(([key]) => allTexts.some((t) => t?.includes(key)))
      .map(([, id]) => id);

    const validOptions = plan.callOptions.filter((opt) => {
      if (matchedIds.includes(opt.id)) return true;
      if (matchedIds.includes("5min") && ["10min", "monthly30", "monthly60", "unlimited"].includes(opt.id)) return true;
      if (matchedIds.includes("monthly30") && ["monthly60", "unlimited"].includes(opt.id)) return true;
      if (matchedIds.includes("hybrid_30x10") && ["unlimited"].includes(opt.id)) return true;
      return false;
    });

    const cheapestOption = validOptions.sort((a, b) => a.fee - b.fee)[0];
    callOptionFee = cheapestOption?.fee ?? 0;
  }

  // === 家族割 ===
  let familyDiscount = 0;
  if (plan.supportsFamilyDiscount && answers.phase2?.familyLines) {
    const lineCount = parseInt(answers.phase2.familyLines.replace(/\D/g, ""), 10) || 1;
    if (plan.familyDiscountRules?.length) {
      const matched = [...plan.familyDiscountRules]
        .sort((a, b) => b.lines - a.lines)
        .find((r) => lineCount >= r.lines);
      if (matched) familyDiscount = matched.discount;
    }
  }

  // === 学割・年齢割 ===
  let studentDiscount = 0;
  let ageDiscount = 0;
  const hasStudent = answers.phase2?.studentDiscount === "はい";
  const ageGroup = answers.phase2?.ageGroup;

  if (hasStudent && plan.supportsStudentDiscount && plan.studentDiscountRules) {
    const matched = plan.studentDiscountRules.find((r) => {
      const min = r.minAge ?? 0;
      const max = r.maxAge ?? Infinity;
      const ageValue = parseInt(ageGroup?.replace(/\D/g, "") || "0", 10);
      return ageValue >= min && ageValue <= max;
    });
    if (matched) studentDiscount = matched.discount;
  }

  if (plan.supportsAgeDiscount && plan.ageDiscountRules && ageGroup) {
    const normalizedInput = ageGroup.replace(/\s/g, "").replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    const numericInput = parseInt(normalizedInput.replace(/\D/g, "") || "0", 10);

    const matched = plan.ageDiscountRules.find((r) => {
      const normalizedRule = r.ageGroup
        .replace(/\s/g, "")
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
      const numericRule = parseInt(normalizedRule.replace(/\D/g, "") || "0", 10);
      return (
        normalizedInput.includes(normalizedRule) ||
        normalizedRule.includes(normalizedInput) ||
        numericInput === numericRule
      );
    });
    if (matched) ageDiscount = matched.discount;
  }

  if (plan.discountCombinationRules?.includes("exclusive_student_age")) {
    if (studentDiscount > 0 && ageDiscount > 0) {
      if (studentDiscount >= ageDiscount) ageDiscount = 0;
      else studentDiscount = 0;
    }
  }

  // === 経済圏割 ===
  let economyDiscount = 0;
  const card = answers.phase2?.mainCard?.join("") ?? "";
  const shopping = answers.phase2?.shoppingList?.join("") ?? "";
  if ((card + shopping).includes("楽天") && plan.supportsRakutenEconomy) economyDiscount = 300;
  if ((card + shopping).includes("dカード") && plan.supportsDEconomy) economyDiscount = 200;
  if ((card + shopping).includes("au") && plan.supportsAuEconomy) economyDiscount = 200;
  if ((card + shopping).includes("PayPay") && plan.supportsPayPayEconomy) economyDiscount = 200;

  // === 端末割引 ===
  let deviceDiscount = 0;
  if (answers.phase2?.buyingDevice?.includes("端末購入")) {
    deviceDiscount = plan.deviceDiscountAmount ?? 500;
  }

  // === キャッシュバック ===
  let cashback = plan.cashbackAmount ? plan.cashbackAmount / 12 : 0;

  // === 初期費用 ===
  const initialFeeMonthly = plan.initialFee ? plan.initialFee / 24 : 0;

  // === テザリング費用 ===
  let tetheringFee = 0;
  const wantsTethering = answers.phase2?.tetheringNeeded === true;
  if (wantsTethering && plan.tetheringAvailable) {
    if (typeof plan.tetheringFee === "number" && plan.tetheringFee > 0) {
      tetheringFee = plan.tetheringFee;
    }
  }

  // === 🟩 セット割（光 / ルーター / ポケットWi-Fi / 電気 / ガス） ===
  let fiberDiscount = 0;
  let routerDiscount = 0;
  let pocketWifiDiscount = 0;
  let electricDiscount = 0;
  let gasDiscount = 0;

  // 🔹 normalize helper（全角/半角/単位揺れを吸収）
  const normalize = (text: string) =>
    text
      ?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      )
      .replace(/Gps/gi, "Gbps")
      .replace(/\s+/g, "")
      .trim() || "";

  // --- 光回線 ---
  if (answers.phase2?.fiberType && answers.phase2?.fiberSpeed) {
    const ansFiberSpeed = normalize(answers.phase2.fiberSpeed);
    const ansFiberType = normalize(answers.phase2.fiberType);

    const match = fiberDiscountPlans.find(
      (p: any) =>
        p.carrier === plan.carrier &&
        (!p.fiberType ||
          normalize(p.fiberType) === ansFiberType ||
          ansFiberType.includes(normalize(p.fiberType))) &&
        (!p.fiberSpeed ||
          normalize(p.fiberSpeed) === ansFiberSpeed ||
          ansFiberSpeed.includes(normalize(p.fiberSpeed)))
    );
    if (match) fiberDiscount = match.setDiscountAmount;
  }

  // --- ルーター ---
  if (answers.phase2?.routerCapacity && answers.phase2?.routerSpeed) {
    const ansRouterCapacity = normalize(answers.phase2.routerCapacity);
    const ansRouterSpeed = normalize(answers.phase2.routerSpeed);

    const match = routerDiscountPlans.find((p: any) => {
      if (p.carrier !== plan.carrier) return false;

      const planCap = normalize(p.routerCapacity ?? "");
      const planSpeed = normalize(p.routerSpeed ?? "");

      const capacityOK =
        planCap === ansRouterCapacity ||
        planCap.includes("無制限") ||
        (planCap.includes("100GB") && ansRouterCapacity.includes("20GB")) ||
        (planCap.includes("50GB") && ansRouterCapacity.includes("20GB"));

      const speedOK =
        planSpeed === ansRouterSpeed ||
        planSpeed.includes("Gbps") ||
        ansRouterSpeed.includes("Mbps");

      return capacityOK && speedOK;
    });

    if (match) routerDiscount = match.setDiscountAmount;
  }

  // --- ポケットWi-Fi ---
  if (answers.phase2?.pocketWifiCapacity && answers.phase2?.pocketWifiSpeed) {
    const ansPocketCapacity = normalize(answers.phase2.pocketWifiCapacity);
    const ansPocketSpeed = normalize(answers.phase2.pocketWifiSpeed);

    const match = pocketWifiDiscountPlans.find(
      (p: any) =>
        p.carrier === plan.carrier &&
        (!p.pocketWifiCapacity ||
          normalize(p.pocketWifiCapacity) === ansPocketCapacity ||
          ansPocketCapacity.includes(normalize(p.pocketWifiCapacity))) &&
        (!p.pocketWifiSpeed ||
          normalize(p.pocketWifiSpeed) === ansPocketSpeed ||
          ansPocketSpeed.includes(normalize(p.pocketWifiSpeed)))
    );
    if (match) pocketWifiDiscount = match.setDiscountAmount;
  }

    // --- ⚡ 電気セット割 ---
const hasElectric =
  plan.supportsElectricSet ||
  (Array.isArray(answers.phase2?.setDiscount) &&
    answers.phase2.setDiscount.some((v) =>
      v.includes("電気") || v.includes("電気のセット契約")
    ));

if (hasElectric && plan.energyDiscountRules) {
  const match = plan.energyDiscountRules.find((r) => r.type === "電気");
  if (match) electricDiscount = match.discount;
}

// --- 🔥 ガスセット割 ---
const hasGas =
  plan.supportsGasSet ||
  (Array.isArray(answers.phase2?.setDiscount) &&
    answers.phase2.setDiscount.some((v) =>
      v.includes("ガス") || v.includes("ガスのセット契約")
    ));

if (hasGas && plan.energyDiscountRules) {
  const match = plan.energyDiscountRules.find((r) => r.type === "ガス");
  if (match) gasDiscount = match.discount;
}


  // === 合計 ===
  const total =
    base +
    callOptionFee -
    familyDiscount -
    studentDiscount -
    ageDiscount -
    economyDiscount -
    deviceDiscount -
    cashback -
    fiberDiscount -
    routerDiscount -
    pocketWifiDiscount -
    electricDiscount -
    gasDiscount +
    initialFeeMonthly +
    tetheringFee;

  return {
    baseFee: base,
    callOptionFee,
    familyDiscount,
    studentDiscount,
    ageDiscount,
    economyDiscount,
    deviceDiscount,
    cashback,
    initialFeeMonthly,
    tetheringFee,
    fiberDiscount,
    routerDiscount,
    pocketWifiDiscount,
    electricDiscount,
    gasDiscount,
    total: Math.round(total),
  };
}
