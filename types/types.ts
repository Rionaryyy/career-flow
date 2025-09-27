// types/types.ts
export interface Phase1Answers {
  includeEconomy: "yes" | "no"; // ← booleanではなく string に変更（select対応）
  networkPriority: "high" | "medium" | "low";
  carrierType: "major" | "subbrand" | "mvno";
  supportPriority: "high" | "medium" | "low";
  contractBinding: "yes" | "no"; // ← 同上
}

export interface Phase2Answers {
  monthlyData: number; // ← dataUsage ではなく monthlyData に統一
  callFrequency: "low" | "medium" | "high";
  familyDiscount: "yes" | "no";
  setDiscount: "yes" | "no";
  useEcosystem: "yes" | "no";
  ecosystemAmount?: number;
}

export interface DiagnosisAnswers {
  phase1: Phase1Answers;
  phase2: Phase2Answers;
}
