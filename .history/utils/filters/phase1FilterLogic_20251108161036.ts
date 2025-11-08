import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";

/**
 * Phase1基本条件フィルター
 * --------------------------------------------
 * - carrierType: "major_only" | "include_sub" | "include_mvno"
 * - networkQuality: "high" | "medium" | "low"
 * - contractMethod: "store" | "online" | "either"
 */
export function filterPlansByPhase1(plans: Plan[], answers: DiagnosisAnswers): Plan[] {
  let filtered = [...plans];

  // 🔹 Phase1専用の回答を直接使う
  const base = answers;

  // === 📡 キャリアタイプフィルター ===
  if (base.carrierType) {
    switch (base.carrierType) {
      case "major_only":
        filtered = filtered.filter((p) => p.planType === "大手");
        break;
      case "include_sub":
        filtered = filtered.filter(
          (p) => p.planType === "大手" || p.planType === "サブブランド"
        );
        break;
      case "include_mvno":
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
  }

  // === ⚡ 通信品質フィルター ===
  if (base.networkQuality) {
    switch (base.networkQuality) {
      case "high":
        filtered = filtered.filter((p) => p.networkQuality === "高");
        break;
      case "medium":
        filtered = filtered.filter(
          (p) => p.networkQuality === "中" || p.networkQuality === "高"
        );
        break;
      default:
        // "low" or undefined = フィルタしない
        break;
    }
  }

  // === 🛒 契約方法フィルター ===
  if (base.contractMethod) {
    switch (base.contractMethod) {
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
      default:
        break;
    }
  }

  console.log("📍 [Phase1] filtered count:", filtered.length);
  return filtered;
}
