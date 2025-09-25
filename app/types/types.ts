// ✅ フェーズ①（基本条件）
export interface Phase1Answers {
  includePoints: "はい" | "いいえ" | "";
  qualityPreference: "とても重視する" | "ある程度重視する" | "こだわらない" | "";
  carrierType:
    | "大手キャリア（ドコモ / au / ソフトバンク / 楽天）"
    | "サブブランド（ahamo / povo / LINEMO / UQなど）もOK"
    | "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい"
    | "";
}

// ✅ フェーズ②（詳細条件）
export interface Phase2Answers {
  familyDiscount: "はい" | "いいえ" | "未定" | "";
  setDiscount: "はい" | "いいえ" | "未定" | "";
  specialUse: "はい" | "いいえ" | "";
  economyZone: string[]; // 経済圏（複数選択可）
  monthlySpend: "" | "〜5,000円" | "〜10,000円" | "10,000円以上";
  devicePurchase: "一括" | "分割" | "未定" | "";
  paymentMethod: "クレジットカード" | "口座振替" | "その他" | "";
}

// ✅ フェーズ③（利用詳細など）
export interface Phase3Answers {
  dataUsage: "small" | "medium" | "large" | "";
  afterLimitUsage: "低速でもOK" | "低速はNG" | "";
  callFrequency: "rare" | "normal" | "frequent" | "";
  callOption: "不要" | "5分かけ放題" | "完全かけ放題" | "";
  overseasUse: "はい" | "いいえ" | "";
  dualSim: "はい" | "いいえ" | "";
}

// ✅ 全体（フェーズ①〜③すべて統合）
export interface DiagnosisAnswers
  extends Phase1Answers,
    Phase2Answers,
    Phase3Answers {}
