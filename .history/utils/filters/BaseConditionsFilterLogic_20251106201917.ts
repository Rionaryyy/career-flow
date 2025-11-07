// utils/filters/phase1FilterLogic.ts
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";

/**
 * 統合後: Phase1相当の基本条件でプランを絞り込み
 * - carrierType（大手/サブブランド/格安）
 * - networkQuality（高/中/低）
 * - contractMethod（online/store/both）
 * - appCallUnlimited（はい→アプリ必須可, いいえ→アプリ必須は除外）
 */
export function filterPlansByPhase1(answers: DiagnosisAnswers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

  const base = answers.phase1 ?? answers; // ✅ Phase統合対応

  // キャリアの種類
  if (base.carrierType) {
    if (base.carrierType.includes("大手キャリア")) {
      // 大手のみ
      filtered = filtered.filter((p) => p.planType === "大手");
    } else if (base.carrierType.includes("サブブランド")) {
      // サブブランドを含む選択肢 → 大手＋サブブランドを許容
      filtered = filtered.filter(
        (p) => p.planType === "大手" || p.planType === "サブブランド"
      );
    } else if (base.carrierType.includes("格安SIM")) {
      // 格安SIMも含める選択肢 → 全タイプ許容
      filtered = filtered.filter(
        (p) =>
          p.planType === "大手" ||
          p.planType === "サブブランド" ||
          p.planType === "格安SIM"
      );
    }
  }

  // 通信品質
  if (base.networkQuality) {
    if (base.networkQuality.includes("とても重視")) {
      filtered = filtered.filter((p) => p.networkQuality === "高");
    } else if (base.networkQuality.includes("ある程度重視")) {
      filtered = filtered.filter(
        (p) => p.networkQuality === "中" || p.networkQuality === "高"
      );
    } else if (base.networkQuality.includes("こだわらない")) {
      // 何もしない（全許容）
    }
  }

  // 契約方法フィルター（柔軟対応）
  if (base.contractMethod) {
    if (base.contractMethod.includes("店頭")) {
      // 店頭希望 → 店舗または両対応
      filtered = filtered.filter((p) =>
        ["store", "both"].includes(p.availableMethod)
      );
    } else if (base.contractMethod.includes("オンライン")) {
      // オンライン希望 → オンライン・両対応
      filtered = filtered.filter((p) =>
        ["online", "both"].includes(p.availableMethod)
      );
    }
  }

  return filtered;
}
