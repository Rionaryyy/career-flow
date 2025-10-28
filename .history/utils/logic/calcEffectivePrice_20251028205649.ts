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

  if (typeof buyingText === "string" && /(返却|カエドキ|トクする|スマホトク|プログラム)/.test(buyingText)) {
    const match = devicePricesLease.find(
      (d) =>
        d.ownershipType === "lease" &&
        d.carrier?.toLowerCase() === plan.carrier?.toLowerCase() &&
        normalize(d.model).includes(selectedModel) &&
        normalize(d.storage).includes(selectedStorage)
    );
    if (match) {
      deviceLeaseMonthly = match.monthlyPayment;
      deviceBuyMonthly = 0;
    }
  } else if (typeof buyingText === "string" && /(購入|分割|一括)/.test(buyingText)) {
    const isCarrierPurchase =
      /(キャリア|au|docomo|ドコモ|ソフトバンク|softbank|rakuten|楽天)/i.test(buyingText);
    const isOfficialStorePurchase = /(正規|Apple|家電量販店)/i.test(buyingText);

    if (isOfficialStorePurchase) {
      deviceBuyMonthly = 0;
      deviceLeaseMonthly = 0;
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
        deviceLeaseMonthly = 0;
      }
    }
  }

  // === 💰 キャッシュバック・初期費用（月換算） ===
  let cashback = 0;
  let initialFeeMonthly = 0;
  let cashbackTotal = plan.cashbackAmount ?? 0;
  let initialCostTotal = plan.initialCost ?? 0;

  const compareAxis = answers.phase1?.compareAxis ?? "";
  const comparePeriod = answers.phase1?.comparePeriod ?? "";

  let periodMonths = 12;
  if (comparePeriod.includes("2年")) periodMonths = 24;
  else if (comparePeriod.includes("3年")) periodMonths = 36;

  if (compareAxis.includes("実際に支払う金額")) {
    cashback = cashbackTotal / periodMonths;
    initialFeeMonthly = initialCostTotal / periodMonths;
  }

  // === 🎬 サブスク割 ===
  let subscriptionDiscount = 0;
  const allSubs = [
    answers.phase2?.videoSubscriptions,
    answers.phase2?.musicSubscriptions,
    answers.phase2?.bookSubscriptions,
    answers.phase2?.gameSubscriptions,
    answers.phase2?.cloudSubscriptions,
    answers.phase2?.otherSubscriptions,
  ]
    .flat()
    .filter(Boolean);

  if (allSubs.length && plan.subscriptionDiscountRules?.length) {
    const matched = plan.subscriptionDiscountRules.filter((r) =>
      r.applicableSubscriptions?.some((s) => allSubs.includes(s))
    );
    if (matched.length) subscriptionDiscount = matched.reduce((sum, r) => sum + (r.discount ?? 0), 0);
  }

  // === セット割・その他割引変数の初期化 ===
  let fiberDiscount = 0;
  let routerDiscount = 0;
  let pocketWifiDiscount = 0;
  let electricDiscount = 0;
  let gasDiscount = 0;

// === ⑧ テザリング費用（DBに登録あり + 「はい」回答時のみ加算） ===
let tetheringFee = 0;

// 「はい（必要）」などの回答を含む場合のみ対象
const tetheringAnswer = answers.phase2?.tetheringNeeded;
const wantsTethering =
  (typeof tetheringAnswer === "string" && tetheringAnswer.includes("はい")) ||
  tetheringAnswer === true;

if (wantsTethering && plan.tetheringAvailable) {
  if (typeof plan.tetheringFee === "number" && plan.tetheringFee > 0) {
    tetheringFee = plan.tetheringFee;
  }
}





  // === 💳 支払い割引・還元 ===
  let paymentDiscount = 0;
  let paymentReward = 0;

  const selectedMain = answers.phase2?.mainCard ?? [];
  const selectedBrands = answers.phase2?.cardDetail ?? [];

  if (plan.paymentBenefitRules?.length) {
    for (const rule of plan.paymentBenefitRules) {
      const matchesMethod = selectedMain.includes(rule.method);
      const matchesBrand = rule.brands?.some((b) => selectedBrands.includes(b));

      if (matchesMethod && matchesBrand) {
        if (rule.discount) paymentDiscount += rule.discount;
        if (rule.rate && rule.rate > 0) {
          const totalAfterDiscounts =
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
            gasDiscount -
            subscriptionDiscount -
            paymentDiscount +
            initialFeeMonthly +
            tetheringFee;

          paymentReward += Math.round(totalAfterDiscounts * rule.rate);
        }
      }
    }
  }

  // === 🛍️ ショッピング還元 ===
  let shoppingReward = 0;
  const shoppingList = answers.phase2?.shoppingList ?? [];
  const shoppingMonthly = answers.phase2?.shoppingMonthly ?? "";

  const avgSpend =
    shoppingMonthly.includes("〜5,000") ? 2500 :
    shoppingMonthly.includes("5,000〜10,000") ? 7500 :
    shoppingMonthly.includes("10,000〜30,000") ? 20000 :
    shoppingMonthly.includes("30,000〜50,000") ? 40000 :
    shoppingMonthly.includes("50,000") ? 60000 :
    10000;

  const rewardRateMap: Record<string, number> = {
    "楽天": 0.01,
    "d払い": 0.005,
    "dカード": 0.005,
    "PayPay": 0.005,
    "au PAY": 0.004,
  };

  for (const [key, rate] of Object.entries(rewardRateMap)) {
    if (shoppingList.some((s) =>
      s.includes(key) ||
      (key === "楽天" && s.includes("楽天市場")) ||
      (key === "d払い" && s.includes("dカード")) ||
      (key === "dカード" && s.includes("d払い"))
    )) {
      shoppingReward += Math.round(avgSpend * rate);
    }
  }

  // === 💰 ポイント還元 ===
  let pointReward = 0;
  const paymentList = answers.phase2?.paymentList ?? [];
  const paymentMonthly = answers.phase2?.paymentMonthly ?? "";

  const avgPayment =
    paymentMonthly.includes("〜5,000") ? 2500 :
    paymentMonthly.includes("5,000〜10,000") ? 7500 :
    paymentMonthly.includes("10,000〜30,000") ? 20000 :
    paymentMonthly.includes("30,000〜50,000") ? 40000 :
    paymentMonthly.includes("50,000") ? 60000 :
    10000;

  const pointRateMap: Record<string, number> = {
    "楽天": 0.01,
    "d払い": 0.005,
    "dカード": 0.005,
    "PayPay": 0.005,
    "au PAY": 0.004,
  };

  for (const [key, rate] of Object.entries(pointRateMap)) {
    if (paymentList.some((s) =>
      s.includes(key) ||
      (key === "d払い" && s.includes("dカード")) ||
      (key === "dカード" && s.includes("d払い")) ||
      (key === "楽天" && s.includes("楽天"))
    )) {
      pointReward += Math.round(avgPayment * rate);
    }
  }

  // === セット割（光・ルーター・電気など） ===
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
    gasDiscount -
    subscriptionDiscount -
    paymentDiscount -
    paymentReward -
    shoppingReward -
    pointReward +
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
    cashbackTotal,
    initialFeeMonthly,
    initialCostTotal,
    tetheringFee,
    fiberDiscount,
    routerDiscount,
    pocketWifiDiscount,
    electricDiscount,
    gasDiscount,
    subscriptionDiscount,
    paymentDiscount,
    paymentReward,
    shoppingReward,
    pointReward,
    deviceLeaseMonthly,
    deviceBuyMonthly,
    total: Math.round(total),
    totalWithDevice: Math.round(total),
  };
}
