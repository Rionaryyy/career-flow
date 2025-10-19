import { Phase1Answers } from "@/types/types";
import { PlanSchemaType } from "./planSchema";

/**
 * フェーズ①の回答をもとにプランをフィルタリングする関数
 */
export function filterPlansByPhase1(
  plans: PlanSchemaType[],
  answers: Phase1Answers
): PlanSchemaType[] {
  let filtered = [...plans];

  // --- ① キャリアタイプ ---
  if (answers.carrierType) {
    if (answers.carrierType.includes("大手")) {
      filtered = filtered.filter((p) => p.planType === "大手");
    } else if (answers.carrierType.includes("サブブランド")) {
      filtered = filtered.filter((p) =>
        ["大手", "サブブランド"].includes(p.planType ?? "")
      );
    }
  }

  // --- ② 通信品質 ---
  if (answers.networkQuality) {
    if (answers.networkQuality.includes("とても重視")) {
      filtered = filtered.filter((p) => p.networkQuality === "高速");
    } else if (answers.networkQuality.includes("ある程度")) {
      filtered = filtered.filter((p) =>
        ["高速", "中速"].includes(p.networkQuality ?? "")
      );
    }
  }

  // --- ③ 並び替え（compareAxis）---
  if (answers.compareAxis?.includes("実際に支払う")) {
    filtered.sort(
      (a, b) => Number(a.baseMonthlyFee) - Number(b.baseMonthlyFee)
    );
  } else {
    filtered.sort(
      (a, b) => Number(a.baseMonthlyFee) - Number(b.baseMonthlyFee)
    );
  }

  return filtered;
}
