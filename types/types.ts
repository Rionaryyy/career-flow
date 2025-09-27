export interface Phase1Answers {
  includePoints: boolean | null; // ポイント還元や経済圏特典を含めるか
  networkQuality: "low" | "medium" | "high" | null; // 通信品質の重視度
  carrierType: "major" | "sub" | "cheap" | null; // キャリアの種類
  supportLevel: "low" | "medium" | "high" | null; // サポートの重視度
  contractFlexibility: "strict" | "flexible" | null; // 契約縛りの有無
}

export interface Phase2Answers {
  ecosystemUsage: "none" | "light" | "heavy" | null; // 経済圏の利用状況
  monthlyData: number | null; // 毎月のデータ量（GB）
}

export interface DiagnosisAnswers {
  phase1: Phase1Answers;
  phase2: Phase2Answers;
}
