// types/types.ts
export interface Phase1Answers {
  // すべて文字列（選択肢の日本語文言）または null
  includePoints: string | null;
  networkQuality: string | null;
  carrierType: string | null;
  supportPreference: string | null;
  contractLockPreference: string | null;
}

export interface Phase2Answers {
  // データ通信ニーズ
  dataUsage: string | null;
  speedLimitImportance: string | null;
  tetheringNeeded: string | null;
  tetheringUsage: string | null;

  // 通話
  callFrequency: string | null;
  callPriority: string | null;
  callOptionsNeeded: string | null;
  callPurpose: string | null;

  // 契約条件・割引
  familyLines: string | null;
  setDiscount: string | null;
  infraSet: string | null;

  // 経済圏・ポイント
  ecosystem: string | null;
  ecosystemMonthly: string | null;

  // サブスク
  subs: string[] | null;
  subsDiscountPreference: string | null;

  // 端末
  buyingDevice: string | null;
  devicePurchaseMethods: string[] | null;

  // 海外・特殊ニーズ
  overseasUse: string | null;
  overseasPreference: string | null;
  dualSim: string | null;
  specialUses: string[] | null;

  // 支払い方法
  paymentMethods: string[] | null;
}

export interface DiagnosisAnswers {
  phase1: Phase1Answers;
  phase2: Phase2Answers;
}
