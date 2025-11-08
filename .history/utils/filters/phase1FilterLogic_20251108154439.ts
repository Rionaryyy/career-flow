// utils/filters/phase1FilterLogic.ts
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";

/**
 * Phase1基本条件フィルター
 * --------------------------------------------
 * - carrierType: "major_only" | "include_sub" | "include_mvno"
 * - networkQuality: "high" | "medium" | "low"
 * - appCallUnlimited: "include" | "exclude"
 * - contractMethod: "store" | "online" | "either"
 */
export function filterPlansByPhase1(answers: DiagnosisAnswers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

  const base = answers.phase1 ?? answers; // ✅ Phase統合対応

  // === 📡 キャリアタイプフィルター ===
  if (base.carrierType) {
    switch (base.carrierType) {
      case "major_only":
        // 大手キャリアのみ（ドコモ / au / ソフトバンク / 楽天）
        filtered = filtered.filter((p) => p.planType === "大手");
        break;

      case "include_sub":
        // サブブランドも含めて（ahamo / povo / LINEMO / UQ）
        filtered = filtered.filter(
          (p) => p.planType === "大手" || p.planType === "サブブランド"
        );
        break;

      case "include_mvno":
        // 格安SIMも含めて（IIJ / mineo / NUROなど）
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

      case "low":
        // 「こだわらない」= 全許容
        break;

      default:
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

      case "either":
      default:
        // 両対応 or 未指定 → フィルタなし
        break;
    }
  }

  return filtered;
}
