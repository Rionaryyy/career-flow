// app/types/types.ts
export type Phase1Answers = {
  considerPoints: boolean | null;
  networkQuality: "high" | "medium" | "low" | null;
  carrierType: "major" | "sub" | "cheap" | null;
  supportPriority: "high" | "medium" | "low" | null;
  contractFreedom: boolean | null;
};

export type Phase2Answers = {
  ecosystemUsage: "none" | "light" | "heavy" | null;
  monthlyData: number | null;
  callFrequency: "rare" | "sometimes" | "often" | null;
  familyDiscount: boolean | null;
};

export type DiagnosisAnswers = {
  phase1: Phase1Answers;
  phase2: Phase2Answers;
};
