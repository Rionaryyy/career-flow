// ✅ フェーズ①（基本条件）
export interface Phase1Answers {
  includePoints: "はい" | "いいえ" | "";
  qualityPriority: "とても重視する" | "ある程度重視する" | "こだわらない" | "";
  carrierType:
    | "大手キャリア（ドコモ / au / ソフトバンク / 楽天）"
    | "サブブランド（ahamo / povo / LINEMO / UQなど）もOK"
    | "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい"
    | "";
}

// ✅ フェーズ②（詳細条件）
export interface Phase2Answers {
  ecosystemUse: "はい" | "いいえ" | "検討中" | "";
  dataUsage: "small" | "medium" | "large" | "";
  callFrequency: "rare" | "normal" | "frequent" | "";
  familyDiscount: "はい" | "いいえ" | "未定" | "";
  bundleDiscount: "はい" | "いいえ" | "未定" | "";
}

// ✅ 全体型（フェーズ③対応にも拡張可能）
export type DiagnosisAnswers = Phase1Answers & Phase2Answers;
