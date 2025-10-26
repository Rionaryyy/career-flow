import { Plan } from "../../types/planTypes";
import { DiagnosisAnswers } from "../../types/types";
import { fiberDiscountPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { routerDiscountPlans } from "../../data/setDiscounts/routerDiscountPlans";
import { pocketWifiDiscountPlans } from "../../data/setDiscounts/pocketWifiDiscountPlans";
import { devicePricesLease } from "../../data/devicePricesLease";
import { devicePricesBuy } from "../../data/devicePricesBuy";

export interface PlanCostBreakdown {
  baseFee: number;
  callOptionFee: number;
  familyDiscount: number;
  studentDiscount: number;
  ageDiscount: number;
  cashback: number;
  initialFeeMonthly: number;
  tetheringFee: number;
  total: number;
  fiberDiscount?: number;
  routerDiscount?: number;
  pocketWifiDiscount?: number;
  electricDiscount?: number;
  gasDiscount?: number;
  subscriptionDiscount?: number;
  paymentDiscount?: number;
  paymentReward?: number;
  shoppingReward?: number;
  pointReward?: number;
  deviceLeaseMonthly?: number;
  deviceBuyMonthly?: number;
  totalWithDevice?: number;
  cashbackTotal?: number;
  initialCostTotal?: number;
  deviceTotal?: number;
}

export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers): PlanCostBreakdown {
  const base = plan.baseMonthlyFee ?? 0;

  // === 通話オプション料金 ===
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

  // === 📱 端末関連（月額費用） ===
  let deviceLeaseMonthly = 0;
  let deviceBuyMonthly = 0;

  const normalize = (text: string) =>
    text
      ?.replace(/\s+/g, "")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/ＧＢ/gi, "GB")
      .replace(/gb$/i, "gb")
      .toLowerCase()
      .trim() || "";

  const buyingText =
    answers.phase2?.buyingDevice ??
    answers.phase2?.devicePurchaseMethods?.[0] ??
    "";

  const selectedModel = normalize(answers.phase2?.deviceModel ?? "");
  const selectedStorage = normalize(answers.phase2?.deviceStorage ?? "");

  // 🟦 リース型（返却プログラム）
  if (typeof buyingText === "string" && /(返却|カエドキ|トクする|スマホトク|プログラム)/.test(buyingText)) {
    const match = devicePricesLease.find(
      (d) =>
        d.ownershipType === "lease" &&
        d.carrier?.toLowerCase() === plan.carrier?.toLowerCase() &&
        normalize(d.model).includes(selectedModel) &&
        normalize(d.storage).includes(selectedStorage)
    );
    if (match) deviceLeaseMonthly = match.monthlyPayment;
    else console.warn(`❌ Lease not found for ${plan.carrier}: ${selectedModel}, ${selectedStorage}`);
  }

  // 🟥 購入型（キャリアまたは正規店購入）
  if (typeof buyingText === "string" && /(購入|分割|一括)/.test(buyingText)) {
    const isCarrierPurchase =
      /(キャリア|au|docomo|ドコモ|ソフトバンク|softbank|rakuten|楽天)/i.test(buyingText);
    const isOfficialStorePurchase = /(正規|Apple|家電量販店)/i.test(buyingText);

    if (isOfficialStorePurchase) {
      console.log("🟢 正規店購入のため、端末料金は非適用");
      deviceBuyMonthly = 0;
    } else {
      const matchBuy = devicePricesBuy.find((d) => {
        const modelMatch =
          normalize(d.model).includes(selectedModel) || selectedModel.includes(normalize(d.model));
        const storageMatch =
          normalize(d.storage).includes(selectedStorage) || selectedStorage.includes(normalize(d.storage));

        if (!isCarrierPurchase) {
          return d.ownershipType === "buy" && modelMatch && storageMatch;
        }
        return (
          d.ownershipType === "buy" &&
          d.carrier?.toLowerCase() === plan.carrier?.toLowerCase() &&
          modelMatch &&
          storageMatch
        );
      });

      if (matchBuy) {
        deviceBuyMonthly = matchBuy.monthlyPayment;
        console.log(
          `✅ Buy matched: ${matchBuy.model} ${matchBuy.storage} (${matchBuy.carrier}) → ${matchBuy.monthlyPayment}`
        );
      } else {
        console.warn(`❌ Buy not found for ${plan.carrier}: ${selectedModel}, ${selectedStorage}`);
      }
    }
  }

  // === 💰 キャッシュバック・初期費用（月換算） ===
  let cashback = 0;
  let initialFeeMonthly = 0;

  const compareAxis = answers.phase1?.compareAxis ?? "";
  const comparePeriod = answers.phase1?.comparePeriod ?? "";

  // 比較期間（月換算）
  let periodMonths = 12;
  if (comparePeriod.includes("2年")) periodMonths = 24;
  else if (comparePeriod.includes("3年")) periodMonths = 36;

  if (compareAxis.includes("実際に支払う金額")) {
    const initialCost = plan.initialCost ?? 0;
    const cashbackTotal = plan.cashbackAmount ?? 0;

    // ✅ 修正版：キャッシュバック - 初期費用を割る前に計算
    const netBenefit = cashbackTotal - initialCost;

    initialFeeMonthly = netBenefit / periodMonths;
    cashback = cashbackTotal / periodMonths; // 表示用
  }

  // === テザリング費用 ===
  let tetheringFee = 0;
  const wantsTethering = answers.phase2?.tetheringNeeded === true;
  if (wantsTethering && plan.tetheringAvailable && plan.tetheringFee > 0) {
    tetheringFee = plan.tetheringFee;
  }

  // === セット割（光・ルーター・電気など） ===
  let fiberDiscount = 0;
  let routerDiscount = 0;
  let pocketWifiDiscount = 0;
  let electricDiscount = 0;
  let gasDiscount = 0;

  const normalizeText = (text: string) =>
    text
      ?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/Gps/gi, "Gbps")
      .replace(/\s+/g, "")
      .trim() || "";

  if (answers.phase2?.fiberType && answers.phase2?.fiberSpeed) {
    const ansFiberType = normalizeText(answers.phase2.fiberType);
    const ansFiberSpeed = normalizeText(answers.phase2.fiberSpeed);
    const match = fiberDiscountPlans.find(
      (p: any) =>
        p.carrier === plan.carrier &&
        (!p.fiberType || normalizeText(p.fiberType) === ansFiberType) &&
        (!p.fiberSpeed || normalizeText(p.fiberSpeed) === ansFiberSpeed)
    );
    if (match) fiberDiscount = match.setDiscountAmount;
  }

  if (answers.phase2?.routerCapacity && answers.phase2?.routerSpeed) {
    const ansSpeed = normalizeText(answers.phase2.routerSpeed);
    const match = routerDiscountPlans.find(
      (p: any) => p.carrier === plan.carrier && normalizeText(p.routerSpeed ?? "") === ansSpeed
    );
    if (match) routerDiscount = match.setDiscountAmount;
  }

  if (answers.phase2?.pocketWifiCapacity && answers.phase2?.pocketWifiSpeed) {
    const ansSpeed = normalizeText(answers.phase2.pocketWifiSpeed);
    const match = pocketWifiDiscountPlans.find(
      (p: any) => p.carrier === plan.carrier && normalizeText(p.pocketWifiSpeed ?? "") === ansSpeed
    );
    if (match) pocketWifiDiscount = match.setDiscountAmount;
  }

  const setDiscountText = Array.isArray(answers.phase2?.setDiscount)
    ? answers.phase2?.setDiscount.join(",")
    : (answers.phase2?.setDiscount ?? "");

  if (setDiscountText.includes("電気") && plan.supportsElectricSet && plan.energyDiscountRules) {
    const match = plan.energyDiscountRules.find((r) => r.type === "電気");
    if (match) electricDiscount = match.discount;
  }

  if (setDiscountText.includes("ガス") && plan.supportsGasSet && plan.energyDiscountRules) {
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
    cashback -
    fiberDiscount -
    routerDiscount -
    pocketWifiDiscount -
    electricDiscount -
    gasDiscount +
    initialFeeMonthly +
    tetheringFee +
    deviceLeaseMonthly +
    deviceBuyMonthly;

  return {
    baseFee: base,
    callOptionFee,
    familyDiscount,
    studentDiscount,
    ageDiscount,
    cashback,
    initialFeeMonthly,
    tetheringFee,
    fiberDiscount,
    routerDiscount,
    pocketWifiDiscount,
    electricDiscount,
    gasDiscount,
    deviceLeaseMonthly,
    deviceBuyMonthly,
    total: Math.round(total),
    totalWithDevice: Math.round(total),
  };
}
