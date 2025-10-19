// utils/filters/phase1FilterLogic.ts
import { Phase1Answers } from "@/types/types";
import { Plan } from "@/types/planTypes";

/**
 * Phase1の回答でプランを絞り込み
 * - carrierType（大手/サブブランド/格安）
 * - networkQuality（高/中/低）
 * - contractMethod（online/store/both）
 * - appCallUnlimited（はい→アプリ必須可, いいえ→アプリ必須は除外）
 */
export function filterPlansByPhase1(answers: Phase1Answers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

 // キャリアの種類
if (answers.carrierType) {
  if (answers.carrierType.includes("大手キャリア")) {
    // 大手のみ
    filtered = filtered.filter(p => p.planType === "大手");
  } 
  else if (answers.carrierType.includes("サブブランド")) {
    // サブブランドを含む選択肢 → 大手＋サブブランドを許容
    filtered = filtered.filter(
      p => p.planType === "大手" || p.planType === "サブブランド"
    );
  } 
  else if (answers.carrierType.includes("格安SIM")) {
    // 格安SIMも含める選択肢 → 全タイプ許容
    filtered = filtered.filter(
      p =>
        p.planType === "大手" ||
        p.planType === "サブブランド" ||
        p.planType === "格安SIM"
    );
  }
}


  // 通信品質
  if (answers.networkQuality) {
    if (answers.networkQuality.includes("とても重視")) {
      filtered = filtered.filter(p => p.networkQuality === "高");
    } else if (answers.networkQuality.includes("ある程度重視")) {
      filtered = filtered.filter(p => p.networkQuality === "中" || p.networkQuality === "高");
    } else if (answers.networkQuality.includes("こだわらない")) {
      // 何もしない（全許容）
    }
  }

  // 契約方法
  if (answers.contractMethod) {
    if (answers.contractMethod.includes("店頭")) {
      filtered = filtered.filter(p => p.availableMethod === "store" || p.availableMethod === "both");
    } else if (answers.contractMethod.includes("オンライン")) {
      filtered = filtered.filter(p => p.availableMethod === "online" || p.availableMethod === "both");
    }
  }



  return filtered;
}
