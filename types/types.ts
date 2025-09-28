// types/types.ts

export interface Phase1Answers {
  includePoints: string | null;
  networkQuality: string | null;
  carrierType: string | null;
  supportPreference: string | null;
  contractLockPreference: string | null;
}

export interface Phase2Answers {
  // ① データ通信ニーズ
  dataUsage: string | null;
  speedLimitImportance: string | null;
  tetheringNeeded: string | null;
  tetheringUsage: string | null;

  // ② 通話
  callFrequency: string | null;
  callPriority: string | null;
  callOptionsNeeded: string | null;
  callPurpose: string | null;

  // ③ 契約条件・割引
  familyLines: string | null;
  setDiscount: string | null;
  infraSet: string | null;

  // ④ 経済圏・ポイント
  ecosystem: string | null;
  ecosystemMonthly: string | null;

  // ✅ 追加（Phase2Ecosystem用）
  usingEcosystem: string | null;
  monthlyUsage: string | null;

  // ⑤ サブスク
  subs: string[] | null;
  subsDiscountPreference: string | null;

  // ✅ 追加（Phase2Subscription用）
  usingServices: string[] | null;
  monthlySubscriptionCost: string | null;

  // ⑥ 端末・購入形態
  buyingDevice: string | null;
  devicePurchaseMethods: string[] | null;

  // ⑦ 海外利用・特殊ニーズ
  overseasUse: string | null;
  overseasPreference: string | null;
  dualSim: string | null;
  specialUses: string[] | null;

  // ⑧ 支払い方法
  paymentMethods: string[] | null;
}

export interface DiagnosisAnswers {
  phase1: Phase1Answers;
  phase2: Phase2Answers;
}
