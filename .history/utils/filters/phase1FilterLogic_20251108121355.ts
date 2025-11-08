// utils/filters/phase1FilterLogic.ts
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";

/**
 * 🧩 Phase1相当の基本条件フィルター（ID / value統一対応版）
 * 参照元:
 *  - carrierType (major_only / include_sub / include_mvno)
 *  - networkQuality (high / medium / low)
 *  - contractMethod (store / online / either)
 *  - appCallUnlimited (include / exclude)
 */
export function filterPlansByPhase1(answers: DiagnosisAnswers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

  // === 🟦 キャリアタイプ ===
  switch (answers.carrierType) {
    case "major_only":
      filtered = filtered.filter((p) => p.planType === "大手");
      break;
    case "include_sub":
      filtered = filtered.filter(
        (p) => p.planType === "大手" || p.planType === "サブブランド"
      );
      break;
    case "include_mvno":
      // 全タイプ許容（格安SIM含む）
      filtered = filtered.filter(
        (p) =>
          p.planType === "大手" ||
          p.planType === "サブブランド" ||
          p.planType === "格安SIM"
      );
      break;
    default:
      break;
  }

  // === 🟩 通信品質 ===
  switch (answers.networkQuality) {
    case "high": // 大手キャリア水準
      filtered = filtered.filter((p) => p.networkQuality === "高");
      break;
    case "medium": // サブブランド水準以上
      filtered = filtered.filter(
        (p) => p.networkQuality === "中" || p.networkQuality === "高"
      );
      break;
    case "low": // コスト優先 → フィルターなし
    default:
      break;
  }

  // === 🟨 契約方法 ===
  switch (answers.contractMethod) {
    case "store":
      filtered = filtered.filter((p) =>
        ["store", "both"].includes(p.availableMethod)
      );
      break;
    case "online":
      filtered = filtered.filter((p) =>
        ["online", "both"].includes(p.availableMethod)
      );
      break;
    case "either":
    default:
      break; // どちらでもOK
  }

  // === 🟧 通話アプリかけ放題許容 ===
  if (answers.appCallUnlimited === "exclude") {
    // 「通常通話のみ」希望 → アプリ必須プランを除外
    filtered = filtered.filter((p) => !p.requiresAppCall);
  } else if (answers.appCallUnlimited === "include") {
    // 「アプリ通話もOK」→ 除外なし
  }

  return filtered;
}
