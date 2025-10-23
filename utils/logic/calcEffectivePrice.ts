import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

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

  // 全条件をマッチ or 上位互換として抽出
  const matchedIds = Object.entries(callOptionMap)
    .filter(([key]) => allTexts.some((t) => t?.includes(key)))
    .map(([, id]) => id);

  // 上位互換含めてフィルタリング
  const validOptions = plan.callOptions.filter((opt) => {
    if (matchedIds.includes(opt.id)) return true;
    if (matchedIds.includes("5min") && ["10min", "monthly30", "monthly60", "unlimited"].includes(opt.id)) return true;
    if (matchedIds.includes("monthly30") && ["monthly60", "unlimited"].includes(opt.id)) return true;
    if (matchedIds.includes("hybrid_30x10") && ["unlimited"].includes(opt.id)) return true;
    return false;
  });

  // 最安料金採用
  const cheapestOption = validOptions.sort((a, b) => a.fee - b.fee)[0];
  callOptionFee = cheapestOption?.fee ?? 0;
}


  // === ② 家族割 ===
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

  // === ③ 学割・年齢割 ===
  let studentDiscount = 0;
  let ageDiscount = 0;
  const hasStudent = answers.phase2?.studentDiscount === "はい";
  const ageGroup = answers.phase2?.ageGroup;

  // 🟩 学割
  if (hasStudent && plan.supportsStudentDiscount && plan.studentDiscountRules) {
    const matched = plan.studentDiscountRules.find((r) => {
      const min = r.minAge ?? 0;
      const max = r.maxAge ?? Infinity;
      const ageValue = parseInt(ageGroup?.replace(/\D/g, "") || "0", 10);
      return ageValue >= min && ageValue <= max;
    });
    if (matched) studentDiscount = matched.discount;
  }

  // 🟦 年齢割
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

  // 🎯 exclusive_student_age
  if (plan.discountCombinationRules?.includes("exclusive_student_age")) {
    if (studentDiscount > 0 && ageDiscount > 0) {
      if (studentDiscount >= ageDiscount) ageDiscount = 0;
      else studentDiscount = 0;
    }
  }

  // === ④ 経済圏割 ===
  let economyDiscount = 0;
  const card = answers.phase2?.mainCard?.join("") ?? "";
  const shopping = answers.phase2?.shoppingList?.join("") ?? "";
  if ((card + shopping).includes("楽天") && plan.supportsRakutenEconomy) economyDiscount = 300;
  if ((card + shopping).includes("dカード") && plan.supportsDEconomy) economyDiscount = 200;
  if ((card + shopping).includes("au") && plan.supportsAuEconomy) economyDiscount = 200;
  if ((card + shopping).includes("PayPay") && plan.supportsPayPayEconomy) economyDiscount = 200;

  // === ⑤ 端末割引 ===
  let deviceDiscount = 0;
  if (answers.phase2?.buyingDevice?.includes("端末購入")) {
    deviceDiscount = plan.deviceDiscountAmount ?? 500;
  }

  // === ⑥ キャッシュバック ===
  let cashback = plan.cashbackAmount ? plan.cashbackAmount / 12 : 0;

  // === ⑦ その他費用 ===
  const initialFeeMonthly = plan.initialFee ? plan.initialFee / 24 : 0;

  // === ⑧ テザリング費用（DBに登録あり + true の場合のみ加算） ===
let tetheringFee = 0;

// 「はい（必要）」などの回答を含む場合のみ対象
const wantsTethering =
  typeof answers.phase2?.tetheringNeeded === "string" &&
  answers.phase2.tetheringNeeded.includes("はい");

if (wantsTethering && plan.tetheringAvailable) {
  // データベースに数値が設定されている場合のみ加算
  if (typeof plan.tetheringFee === "number" && plan.tetheringFee > 0) {
    tetheringFee = plan.tetheringFee;
  }
}


  // === ⑨ 合計 ===
  const total =
    base +
    callOptionFee -
    familyDiscount -
    studentDiscount -
    ageDiscount -
    economyDiscount -
    deviceDiscount -
    cashback +
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
    total: Math.round(total),
  };
}
