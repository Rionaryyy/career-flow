export interface Phase1Answers {
  includePoints: string | null;
  networkQuality: string | null;
  carrierType: string | null;
   considerCardAndPayment?: string| null;
  
  // 新規追加：ポイント還元も実質料金に含めるか
  considerPointInActualCost?: string| null; // "はい" | "いいえ"
  supportPreference: string | null;
  contractLockPreference: string | null;
    compareAxis?: string;   // 料金比較の基準（「月額」 or 「実質月額」）
  comparePeriod?: string; // 比較期間（12 / 24 / 36ヶ月）


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
　familyLinesDetail?: string;
　fiberUsage?: string;
 ageGroup?: string;          // ← 追加
  studentDiscount?: string;   // ← 追加
fiberType?: string;
fiberSpeed?: string;
routerStatus?: string;
pocketWifiUsage?: string;
pocketWifiCapacity?: string;
routerCapacity?: string;  // 希望データ容量（例: 〜20GB, 〜50GB, 100GB以上, 無制限, こだわらない）
  routerSpeed?: string;     // 希望通信速度（例: 最大1Gbps, 最大2Gbps, 最大4Gbps, こだわらない）
pocketWifiSpeed?: string; 
  childUnder12Plan?: string; // ← これを追加
  target?: "main" | "child_under12"; // 回線タグ
  
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
