import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";

/**
 * Phase1フィルター（answersをフラット構造で受け取る）
 */
export function filterPlansByPhase1(plans: Plan[], answers: DiagnosisAnswers): Plan[] {
  let filtered = [...plans];

  // === 📡 キャリアタイプ ===
  if (answers.carrierType) {
    switch (answers.carrierType) {
      case "major_only":
        filtered = filtered.filter((p) => p.planType === "大手");
        break;
      case "include_sub":
        filtered = filtered.filter((p) => ["大手", "サブブランド"].includes(p.planType));
        break;
      case "include_mvno":
        filtered = filtered.filter((p) =>
          ["大手", "サブブランド", "格安SIM"].includes(p.planType)
        );
        break;
    }
  }

  // === ⚡ 通信品質 ===
  if (answers.networkQuality) {
    switch (answers.networkQuality) {
      case "high":
        filtered = filtered.filter((p) => p.networkQuality === "高");
        break;
      case "medium":
        filtered = filtered.filter((p) =>
          ["中", "高"].includes(p.networkQuality)
        );
        break;
    }
  }

  // === 🛒 契約方法 ===
  if (answers.contractMethod) {
    switch (answers.contractMethod) {
      case "store":
        filtered = filtered.filter((p) => ["store", "both"].includes(p.availableMethod));
        break;
      case "online":
        filtered = filtered.filter((p) => ["online", "both"].includes(p.availableMethod));
        break;
    }
  }

  console.log("📍 [Phase1] filtered count:", filtered.length);
  return filtered;
}

