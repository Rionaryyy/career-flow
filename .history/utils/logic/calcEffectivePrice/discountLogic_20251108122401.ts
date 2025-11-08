import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface DiscountResult {
  familyDiscount: number;
  studentDiscount: number;
  ageDiscount: number;
  debug?: string;
}

/**
 * 💸 家族割・学割・年齢割をまとめて算出（Phase構造なし対応版）
 */
export function calcDiscounts(plan: Plan, answers: DiagnosisAnswers): DiscountResult {
  // === 👨‍👩‍👧‍👦 家族割 ===
  let familyDiscount = 0;
  if (plan.supportsFamilyDiscount && answers.familyLines) {
    // ✅ "2lines" / "3lines" 対応
    const lineCount =
      typeof answers.familyLines === "string"
        ? parseInt(answers.familyLines.replace(/\D/g, ""), 10) || 1
        : 1;
    if (plan.familyDiscountRules?.length) {
      const matched = [...plan.familyDiscountRules]
        .sort((a, b) => b.lines - a.lines)
        .find((r) => lineCount >= r.lines);
      if (matched) familyDiscount = matched.discount;
    }
  }

  // === 🎓 学割 ===
  let studentDiscount = 0;
  const hasStudent =
    answers.studentDiscount === "はい" || answers.studentDiscount === "yes";
  const ageGroup = answers.ageGroup;

  if (hasStudent && plan.supportsStudentDiscount && plan.studentDiscountRules) {
    const matched = plan.studentDiscountRules.find((r) => {
      const min = r.minAge ?? 0;
      const max = r.maxAge ?? Infinity;
      // ✅ "under18" / "over60" 形式対応
      const numericMap: Record<string, number> = {
        under18: 17,
        under20: 19,
        under25: 24,
        under30: 29,
        over60: 60,
      };
      const ageValue =
        numericMap[ageGroup as keyof typeof numericMap] ??
        parseInt(ageGroup?.replace(/\D/g, "") || "0", 10);
      return ageValue >= min && ageValue <= max;
    });
    if (matched) studentDiscount = matched.discount;
  }

  // === 👴 年齢割 ===
  let ageDiscount = 0;
  if (plan.supportsAgeDiscount && plan.ageDiscountRules && ageGroup) {
    const normalizedInput = ageGroup
      .replace(/\s/g, "")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s: string) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      );

    // ✅ 英語形式を数値に変換
    const numericMap: Record<string, number> = {
      under18: 17,
      under20: 19,
      under25: 24,
      under30: 29,
      over60: 60,
      over65: 65,
    };
    const numericInput =
      numericMap[normalizedInput as keyof typeof numericMap] ??
      parseInt(normalizedInput.replace(/\D/g, "") || "0", 10);

    const matched = plan.ageDiscountRules.find((r) => {
      const normalizedRule = r.ageGroup
        .replace(/\s/g, "")
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s: string) =>
          String.fromCharCode(s.charCodeAt(0) - 0xfee0)
        );
      const numericRule = parseInt(normalizedRule.replace(/\D/g, "") || "0", 10);
      return (
        normalizedInput.includes(normalizedRule) ||
        normalizedRule.includes(normalizedInput) ||
        numericInput === numericRule
      );
    });
    if (matched) ageDiscount = matched.discount;
  }

  // === 🚫 学割と年齢割の排他ルール ===
  if ((plan.discountCombinationRules ?? []).includes("exclusive_student_age")) {
    if (studentDiscount > 0 && ageDiscount > 0) {
      if (studentDiscount >= ageDiscount) ageDiscount = 0;
      else studentDiscount = 0;
    }
  }

  const debug = `👨‍👩‍👧‍👦 family=${familyDiscount}, 🎓 student=${studentDiscount}, 👴 age=${ageDiscount}`;

  return { familyDiscount, studentDiscount, ageDiscount, debug };
}
