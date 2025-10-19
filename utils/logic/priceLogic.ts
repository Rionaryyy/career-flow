import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface PlanCostBreakdown {
  baseFee: number;
  familyDiscount: number;
  studentDiscount: number;
  economyDiscount: number;
  deviceDiscount: number;
  cashback: number;
  initialFeeMonthly: number;
  tetheringFee: number;
  total: number;
}

export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers): PlanCostBreakdown {
  const base = plan.baseMonthlyFee ?? 0;

  // 🟦 家族割
  const familyDiscount =
    answers.phase2.familyLines && (plan as any).familyLines
      ? Math.min((plan as any).familyLines * 100, 1000)
      : 0;

  // 🟦 学割ロジック（18歳以下 & 学生「はい」）
  const isStudent = answers.phase2.ageGroup === "18歳以下" && answers.phase2.studentDiscount === "はい";
  const studentDiscount =
    isStudent &&
    ((plan as any).studentDiscount_Under18 || (plan as any).studentDiscount_Under22)
      ? 500
      : 0;

  // 🟦 経済圏割
  let economyDiscount = 0;
  if (answers.phase2.mainCard?.includes("楽天") && plan.supportsRakutenEconomy) economyDiscount = 300;
  if (answers.phase2.mainCard?.includes("dカード") && plan.supportsDEconomy) economyDiscount = 200;
  if (answers.phase2.mainCard?.includes("au") && plan.supportsAuEconomy) economyDiscount = 200;
  if (answers.phase2.mainCard?.includes("PayPay") && plan.supportsPayPayEconomy) economyDiscount = 200;

  // 🟦 端末割引
  const deviceDiscount = (plan as any).deviceDiscountAmount ?? 0;

  // 🟦 キャッシュバック（月平均換算）
  const cashback = (plan as any).cashbackAmount ? (plan as any).cashbackAmount / 12 : 0;

  // 🟦 初期費用（月平均）
  const initialFeeMonthly = (plan as any).initialFee ? (plan as any).initialFee / 24 : 0;

  // 🟦 テザリング利用料
  const tetheringFee = (plan as any).tetheringFee ?? 0;

  // 🟩 総計
  const total =
    base -
    familyDiscount -
    studentDiscount -
    economyDiscount -
    deviceDiscount -
    cashback +
    initialFeeMonthly +
    tetheringFee;

  return {
    baseFee: base,
    familyDiscount,
    studentDiscount,
    economyDiscount,
    deviceDiscount,
    cashback,
    initialFeeMonthly,
    tetheringFee,
    total: Math.round(total),
  };
}
