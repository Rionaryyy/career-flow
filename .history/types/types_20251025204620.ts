export interface Phase1Answers {
  includePoints: string | null;
  networkQuality: string | null;
  carrierType: string | null;
  considerCardAndPayment?: string | null;

  // 新規追加：ポイント還元も実質料金に含めるか
  considerPointInActualCost?: string | null; // "はい" | "いいえ"

  supportPreference: string | null;
  contractLockPreference: string | null;

  compareAxis?: string;   // 料金比較の基準（「月額」 or 「実質月額」）
  comparePeriod?: string; // 比較期間（12 / 24 / 36ヶ月）

  contractMethod?: string | null; // ← 全角スペース削除＆型統一
  appCallUnlimited?: string | null; // ← optionalにして安全化
}

export interface Phase2Answers {
  // ① データ通信ニーズ
  dataUsage: string | null;
  speedLimitImportance: string | null;
  tetheringNeeded?: boolean | null;
  tetheringUsage?: string | null;

  // ② 通話（国内・海外）
  callDuration?: string | null;                  // ← 国内・1回あたりの通話時間
  callFrequencyPerWeek?: string | null;          // ← 国内・週あたりの通話回数
  familyCallRatio?: string | null;               // ← 家族との通話比率
  overseasCallDuration?: string | null;          // ← 海外・1回あたりの通話時間
  overseasCallFrequencyPerWeek?: string | null;  // ← 海外・週あたりの通話回数
  callOptionsNeeded?: string | null;             // ← 留守電・転送オプション

  // 🟩 追加：かけ放題関連
  needCallPlan?: string | null; // 「かけ放題オプションを利用したいか」
  callPlanType?: string[]; // ← 配列にする

  timeLimitPreference?: string | null; // 時間制限型（5分・15分・無制限など）
  monthlyLimitPreference?: string | null; // 月間制限型（60分・70分など）
  hybridCallPreference?: string | null; // ハイブリッド型（月30回×10分など）
  unknownCallUsageDuration?: string | null;
  unknownCallFrequency?: string | null;
  needCallPlanConfirm?: string | null;
  needInternationalCallUnlimited?: string; // 「海外へのかけ放題オプションは必要ですか？」
  internationalCallCarrier?: string[];

  // ③ 契約条件・割引
  familyLines: string | null;
  setDiscount: string | null;
  infraSet: string | null;
  familyLinesDetail?: string;
  fiberUsage?: string;
  ageGroup?: string;
  studentDiscount?: string;
  fiberType?: string;
  fiberSpeed?: string;
  routerStatus?: string;
  pocketWifiUsage?: string;
  pocketWifiCapacity?: string;
  routerCapacity?: string;
  routerSpeed?: string;
  pocketWifiSpeed?: string;
  childUnder12Plan?: string;
  target?: "main" | "child_under12";

  // 🟩 追加（ここが今回の修正ポイント）
  hasElectricSet?: boolean; // ⚡ 電気セット契約あり
  hasGasSet?: boolean;      // 🔥 ガスセット契約あり

  // ④ 経済圏・ポイント
  shoppingList: string[] | null;
  shoppingMonthly: string | null;
  paymentList: string[] | null;
  paymentMonthly: string | null;

  // ⑤ サブスク
  videoSubscriptions: string[] | null;
  musicSubscriptions: string[] | null;
  bookSubscriptions: string[] | null;
  gameSubscriptions: string[] | null;
  cloudSubscriptions: string[] | null;
  otherSubscriptions: string[] | null;
  subscriptionMonthly: string | null;
  subscriptionList?: string[];

  // ⑥ 端末・購入形態
  devicePreference?: string | null;
  devicePurchaseMethods?: string[] | null;
  deviceModel?: string | null;
  deviceStorage?: string | null;
  buyingDevice: string | null;
  oldDevicePlan: string | null;

  // ⑦ 海外利用・特殊ニーズ
  overseasUse: string | null;
  overseasPreference: string | null;
  dualSim: string | null;
  specialUses: string[] | null;

  // === 海外利用 追加項目（UIに合わせて optional） ===
  stayDuration?: string | null;          // 短期/長期
  usageType?: string | null;             // データ/通話/両方
  stayCountry?: string | null;           // 入力/選択された国・地域名
  monthlyData?: string | null;           // 〜50MB/日 など
  monthlyCall?: string | null;           // 5〜30分/週 など
  localSimPurchase?: string | null;      // 現地SIMを自分で購入できるか（はい/いいえ）
  overseasSupport?: "はい" | "いいえ";

  // ⑧ 支払い方法
  mainCard?: string[]; // ✅ 修正：配列型に変更
  paymentTiming?: string | null;

  studentDiscount_Under18?: string | null; // 18歳以下の学割
  studentDiscount_Under22?: string | null; // 22歳以下の学割
}

export interface DiagnosisAnswers {
  phase1: Phase1Answers;
  phase2: Phase2Answers;
}
