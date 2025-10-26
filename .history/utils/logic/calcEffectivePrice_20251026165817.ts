import { Plan } from "../../types/planTypes";
import { DiagnosisAnswers } from "../../types/types";
import { fiberDiscountPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { routerDiscountPlans } from "../../data/setDiscounts/routerDiscountPlans";
import { pocketWifiDiscountPlans } from "../../data/setDiscounts/pocketWifiDiscountPlans";
import { devicePrices } from "../../data/devicePrices"; // 🆕 追加


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
  // 🏠 セット割フィールドを追加
  fiberDiscount?: number;
  routerDiscount?: number;
  pocketWifiDiscount?: number;
  electricDiscount?: number; // ⚡ 電気割
  gasDiscount?: number; // 🔥 ガス割
  subscriptionDiscount?: number;
  paymentDiscount?: number;
  paymentReward?: number;
  shoppingReward?: number; // 🛍️ ショッピング還元
  pointReward?: number; // 💰 ポイント還元
  deviceLeaseMonthly?: number; // 🆕 返却プログラム（月額端末費用）
  deviceBuyMonthly?: number,
  totalWithDevice?: number,
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

// === 📱 返却プログラム（月額端末費用） ===
let deviceLeaseMonthly = 0;
const buyingText = answers.phase2?.buyingDevice ?? "";

if (
  (typeof buyingText === "string" && /(返却|カエドキ|トクする|スマホトク|プログラム)/.test(buyingText)) ||
  (answers.phase2?.deviceModel && answers.phase2?.deviceStorage)
) {
  const selectedModel = answers.phase2?.deviceModel?.trim();
  const selectedStorage = answers.phase2?.deviceStorage?.trim();

  const match = devicePrices.find(
    (d) =>
      d.model === selectedModel &&
      d.storage === selectedStorage &&
      d.carrier === plan.carrier &&
      d.ownershipType === "lease"
  );

  console.log("🔍 carrier:", plan.carrier);
  console.log("🔍 model:", selectedModel);
  console.log("🔍 storage:", selectedStorage);
  console.log("🔍 match:", match);

  if (match) {
    console.log("✅ Device Lease Matched:", match);
    deviceLeaseMonthly = match.monthlyPayment;
  } else {
    console.warn("⚠️ Device lease NOT matched:", {
      carrier: plan.carrier,
      model: selectedModel,
      storage: selectedStorage,
    });
  }
}

// === 🏬 正規店購入（Apple / Google公式） ===
let deviceBuyMonthly = 0;
let deviceBuyTotal = 0; // 🆕 一括購入額の実額を保持

if (answers.phase2?.buyingDevice?.includes("正規店")) {
  const selectedModel = answers.phase2?.deviceModel?.trim();
  const selectedStorage = answers.phase2?.deviceStorage?.trim();

  const match = devicePrices.find(
    (d) =>
      d.model === selectedModel &&
      d.storage === selectedStorage &&
      ["apple", "google"].includes(d.carrier) &&
      d.ownershipType === "buy"
  );

  if (match) {
    // 🟩 一括購入として扱う（installmentでも24ヶ月合算）
    deviceBuyTotal = match.monthlyPayment * match.paymentMonths;
    // 一括価格を月換算した値を補助的に表示する場合のみ使用
    deviceBuyMonthly = Math.round(deviceBuyTotal / 24);
  } else {
    console.warn("⚠️ 正規店購入データが見つかりません:", {
      model: selectedModel,
      storage: selectedStorage,
    });
  }
}





  // === キャッシュバック ===
  let cashback = plan.cashbackAmount ? plan.cashbackAmount / 12 : 0;

  // === 初期費用 ===
  const initialFeeMonthly = plan.initialFee ? plan.initialFee / 24 : 0;

  // === テザリング費用 ===
  let tetheringFee = 0;
  const wantsTethering = answers.phase2?.tetheringNeeded === true;
  if (wantsTethering && plan.tetheringAvailable && plan.tetheringFee > 0) {
    tetheringFee = plan.tetheringFee;
  }

  // === 🟩 セット割（光 / ルーター / ポケットWi-Fi / 電気 / ガス） ===
  let fiberDiscount = 0;
  let routerDiscount = 0;
  let pocketWifiDiscount = 0;
  let electricDiscount = 0;
  let gasDiscount = 0;

  const normalize = (text: string) =>
    text?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/Gps/gi, "Gbps")
      .replace(/\s+/g, "")
      .trim() || "";

  // --- 光 ---
  if (answers.phase2?.fiberType && answers.phase2?.fiberSpeed) {
    const ansFiberType = normalize(answers.phase2.fiberType);
    const ansFiberSpeed = normalize(answers.phase2.fiberSpeed);
    const match = fiberDiscountPlans.find(
      (p: any) =>
        p.carrier === plan.carrier &&
        (!p.fiberType || normalize(p.fiberType) === ansFiberType) &&
        (!p.fiberSpeed || normalize(p.fiberSpeed) === ansFiberSpeed)
    );
    if (match) fiberDiscount = match.setDiscountAmount;
  }

  // --- ルーター ---
  if (answers.phase2?.routerCapacity && answers.phase2?.routerSpeed) {
    const ansCap = normalize(answers.phase2.routerCapacity);
    const ansSpeed = normalize(answers.phase2.routerSpeed);
    const match = routerDiscountPlans.find(
      (p: any) => p.carrier === plan.carrier && normalize(p.routerSpeed ?? "") === ansSpeed
    );
    if (match) routerDiscount = match.setDiscountAmount;
  }

  // --- ポケットWi-Fi ---
  if (answers.phase2?.pocketWifiCapacity && answers.phase2?.pocketWifiSpeed) {
    const ansCap = normalize(answers.phase2.pocketWifiCapacity);
    const ansSpeed = normalize(answers.phase2.pocketWifiSpeed);
    const match = pocketWifiDiscountPlans.find(
      (p: any) => p.carrier === plan.carrier && normalize(p.pocketWifiSpeed ?? "") === ansSpeed
    );
    if (match) pocketWifiDiscount = match.setDiscountAmount;
  }

  // --- 電気・ガス ---
  const setDiscountText = Array.isArray(answers.phase2?.setDiscount)
    ? answers.phase2?.setDiscount.join(",")
    : (answers.phase2?.setDiscount ?? "");

  if (
    setDiscountText.includes("電気") &&
    plan.supportsElectricSet &&
    plan.energyDiscountRules
  ) {
    const match = plan.energyDiscountRules.find((r) => r.type === "電気");
    if (match) electricDiscount = match.discount;
  }

  if (
    setDiscountText.includes("ガス") &&
    plan.supportsGasSet &&
    plan.energyDiscountRules
  ) {
    const match = plan.energyDiscountRules.find((r) => r.type === "ガス");
    if (match) gasDiscount = match.discount;
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

  // === 💳 支払い割引・還元 ===
  let paymentDiscount = 0;
  let paymentReward = 0;

  const selectedMain = answers.phase2?.mainCard ?? [];
  const selectedBrands = answers.phase2?.cardDetail ?? [];

  if (plan.paymentBenefitRules?.length) {
    for (const rule of plan.paymentBenefitRules) {
      const matchesMethod = selectedMain.includes(rule.method);
      const matchesBrand = rule.brands?.some((b) => selectedBrands.includes(b));
      if (matchesMethod || matchesBrand) {
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

  // === 🛍️ ショッピング還元（日常支出ベース） ===
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

  // === 💰 ポイント還元（日々の支払い利用ベース） ===
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
  gasDiscount -
  subscriptionDiscount -
  paymentDiscount -
  paymentReward -
  shoppingReward -
  pointReward +
  initialFeeMonthly +
  tetheringFee +
  deviceLeaseMonthly; // 🟦 通信関連は月額計算のみ

// 🟩 一括購入価格を別で保持（UI側で明示表示）
const totalWithDevice = total + deviceBuyTotal;


// ✅ return オブジェクトを正しく閉じる
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
  subscriptionDiscount,
  paymentDiscount,
  paymentReward,
  shoppingReward,
  pointReward,
  deviceLeaseMonthly,
  deviceBuyMonthly, // 一括価格の月換算値（UI補助用）
  total: Math.round(total), // 月額ベース（通信のみ）
  totalWithDevice: Math.round(totalWithDevice), // 💰 通信＋一括端末価格
};


}
