export interface Phase1Answers {
  includePoints: string | null;
  networkQuality: string | null;
  carrierType: string | null;
  considerCardAndPayment: string | null; 
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

  // ④ 経済圏・ポイント（ショッピング利用と支払い方法に分割）
  shoppingList: string[] | null;       // 複数選択可
  shoppingMonthly: string | null;      // 月間利用額
  paymentList: string[] | null;        // 複数選択可
  paymentMonthly: string | null;       // 月間利用額

  // ⑤ サブスク
  videoSubscriptions: string[] | null;
  musicSubscriptions: string[] | null;
  bookSubscriptions: string[] | null;
  gameSubscriptions: string[] | null;
  cloudSubscriptions: string[] | null;
  otherSubscriptions: string[] | null;

  subscriptionMonthly: string | null;

  // ⑥ 端末・購入形態
  // ⑥ 端末・購入形態
devicePreference?: string | null;      // 「端末購入する/しない」
devicePurchaseMethods?: string[] | null; // 端末購入方法（複数選択）
deviceModel?: string | null;           // 選んだ端末モデル
deviceStorage?: string | null;        // 選んだ容量
buyingDevice: string | null;    
 oldDevicePlan: string | null;
  // ⑦ 海外利用・特殊ニーズ
  overseasUse: string | null;
  overseasPreference: string | null;
  dualSim: string | null;
  specialUses: string[] | null;

  // ⑧ 支払い方法（ここは月額込みで統合済み）
  mainCard?: string | null;
  paymentTiming?: string | null;
}

export interface DiagnosisAnswers {
  phase1: Phase1Answers;
  phase2: Phase2Answers;
}
