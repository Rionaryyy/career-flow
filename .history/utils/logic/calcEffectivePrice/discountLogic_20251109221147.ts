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
 
 
 
// === 👨‍👩‍👧‍👦 家族割（carrierSpecific対応＋柔軟判定）===
let familyDiscount = 0;

if (answers.familyLines && plan.carrierSpecific) {
  const raw = String(answers.familyLines).toLowerCase();

  // === 家族回線数の柔軟判定 ===
  const lineCount = (() => {
    if (raw.includes("5") || raw.includes("4plus")) return 5;
    if (raw.includes("4")) return 4;
    if (raw.includes("3")) return 3;
    if (raw.includes("2")) return 2;
    return 1;
  })();

  const normalizedLine = Math.min(Math.max(lineCount, 2), 5);
  const key = `familyDiscount_${normalizedLine}` as keyof typeof plan.carrierSpecific;
  const discountValue = plan.carrierSpecific[key];
  familyDiscount = Number(discountValue) || 0;

  console.log("👨‍👩‍👧‍👦 家族割ヒット:", {
    carrier: plan.carrier,
    id: plan.carrierSpecific.id,
    raw,
    lineCount,
    key,
    discount: familyDiscount,
  });
} else {
  console.log("⚠️ 家族割データなし or carrierSpecific未設定:", {
    carrier: plan.carrier,
    familyLines: answers.familyLines,
  });
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

    // ✅ ID形式・日本語形式両対応
    const aliasMap: Record<string, string[]> = {
      under18: ["18歳未満", "未成年"],
      under25: ["25歳以下", "24歳以下", "学生割"],
      under30: ["30歳以下", "29歳以下"],
      over60: ["60歳以上", "シニア", "シルバー"],
      over65: ["65歳以上"],
    };

    // ✅ 数値変換マップ（比較許容 ±1）
    const numericMap: Record<string, number> = {
      under18: 18,
      under20: 20,
      under25: 25,
      under30: 30,
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

      const aliases = aliasMap[normalizedInput] ?? [];
      const matchByAlias = aliases.some((alias) =>
        normalizedRule.includes(alias)
      );

      const numericRule = parseInt(normalizedRule.replace(/\D/g, "") || "0", 10);
      const matchByNumeric = Math.abs(numericInput - numericRule) <= 1;

      return (
        normalizedInput.includes(normalizedRule) ||
        normalizedRule.includes(normalizedInput) ||
        matchByAlias ||
        matchByNumeric
      );
    });

    if (matched) {
      ageDiscount = matched.discount;
      console.log("🧒 年齢割ヒット:", {
        input: ageGroup,
        normalizedInput,
        matchedRule: matched.ageGroup,
        discount: matched.discount,
      });
    } else {
      console.log("⚠️ 年齢割なし:", ageGroup, plan.carrier);
    }
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
