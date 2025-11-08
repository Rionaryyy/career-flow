import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface DiscountResult {
  familyDiscount: number;
  studentDiscount: number;
  ageDiscount: number;
  debug?: string;
}

/**
 * 💸 家族割・学割・年齢割をまとめて算出（Phase構造＋ID両対応）
 */
export function calcDiscounts(plan: Plan, answers: DiagnosisAnswers): DiscountResult {
  // === 👨‍👩‍👧‍👦 家族割 ===
  let familyDiscount = 0;
  if (plan.supportsFamilyDiscount && answers.familyLines) {
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

    // ✅ ID形式と日本語形式両対応
    const aliasMap: Record<string, string[]> = {
      under25: ["25歳以下", "24歳以下", "学生割"],
      under30: ["30歳以下", "29歳以下"],
      over60: ["60歳以上", "シニア", "シルバー"],
      over65: ["65歳以上"],
    };

    // ✅ 数値変換マップ
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

      // ✅ ルール名（"25歳以下"）が ID マップ内に含まれるかチェック
      const aliases = aliasMap[normalizedInput] ?? [];
      const matchByAlias = aliases.some((alias) =>
        normalizedRule.includes(alias)
      );

      // ✅ 数値でもチェック
      const numericRule = parseInt(normalizedRule.replace(/\D/g, "") || "0", 10);
      const matchByNumeric = numericInput === numericRule;

      return (
        normalizedInput.includes(normalizedRule) ||
        normalizedRule.includes(normalizedInput) ||
        matchByAlias ||
        matchByNumeric
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
