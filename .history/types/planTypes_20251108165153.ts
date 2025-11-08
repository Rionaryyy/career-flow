// === Phase1 共通タイプ定義 ===
export type PlanType = "大手" | "サブブランド" | "格安SIM";
export type NetworkQuality = "低" | "中" | "高";
export type AvailableMethod = "online" | "store" | "both";

// 🟦 通話オプション定義
export interface CallOption {
  id: string;
  name: string;
  fee: number;
}

// 🌍 国際通話オプション定義（追加）
export interface InternationalCallOption {
  id: string;
  name: string;
  description?: string;
  fee: number;
  type?: "international" | "roaming";
}

/**
 * ===================================================
 * 🎬 サブスク割定義（新規追加）
 * ===================================================
 */
export interface SubscriptionDiscountRule {
  id: string; // 動的検索用ID（例: "sub_docomo_dtv"）
  applicableSubscriptions: string[]; // 対応するサブスク名（Phase2回答と一致）
  discount: number; // 割引額（円）
}

/**
 * ===================================================
 * 💳 支払い方法割引・還元ルール定義（新規追加）
 * ===================================================
 */
export interface PaymentBenefitRule {
  method: string; // 支払い方法（例: "クレジットカード"、"銀行口座引き落とし"）
  brands?: string[]; // 対応するカード・銀行名
  discount?: number; // 固定割引額（円）
  rate?: number; // 還元率（例: 0.05 = 5%）
  appliesTo?: "baseFee" | "total"; // 計算対象
}

/**
 * ===================================================
 * 📱 返却プログラム情報定義（修正版）
 * ===================================================
 */
export interface DeviceProgramInfo {
  model: string;
  storage: string;
  programName: string;
  monthlyPayment: number;
  paymentMonths: number;
  returnOption: boolean;
  ownershipType: "lease" | "buy"; // ✅ 正規店購入対応
  totalPayment?: number;
}

/**
 * ===================================================
 * 📱 モバイルプラン定義（診断・比較対象）
 * ===================================================
 */
export interface Plan {
  // === Phase1: 基本属性 ===
  planId: string;
  planName: string;
  carrier: string;
  planType: PlanType;
  baseMonthlyFee: number;
  networkQuality: NetworkQuality;
  requiresAppCall: boolean;
  availableMethod: AvailableMethod;
  // 🆕 契約方法別の初期費用フィールド
  initialFee?: number; // 店頭契約時
  initialFeeOnline?: number; // オンライン契約時
  esimFee?: number; // eSIM発行手数料

  // === Phase2: データ・テザリング ===
  maxDataGB: number;
  speedLimitMbps: number;
  dataLimitType?: "fixed" | "unlimited"; // 🆕 追加：データ容量タイプ（無制限判定用）
  tetheringNeeded?: boolean;
  tetheringAvailable: boolean;
  tetheringUsage: number;
  tetheringFee: number;

  // === 通話関連 ===
  hasVoicemail: boolean;
  callOption?: boolean;
  callType?: "time" | "monthly" | "hybrid" | "unlimited" | null;
  callTimeLimit?: number | null;
  callMonthlyLimit?: number | null;
  callCountLimit?: number | null;
  callPerCallLimit?: number | null;
  callIncluded?: boolean;
  supportsInternationalUnlimitedCalls?: boolean;
  callOptions?: CallOption[];
  internationalOptions?: InternationalCallOption[];
  voicemailFee?: number;

  // === 割引・家族系 ===
  supportsChildPlan: boolean;
  familyLines?: number;
  supportsFamilyDiscount?: boolean;
  supportsStudentDiscount?: boolean;
  supportsAgeDiscount?: boolean;
  familyDiscountRules?: { lines: number; discount: number }[];
  familyDiscountCap?: number;
  ageDiscountRules?: {
    ageGroup: "18歳以下" | "25歳以下" | "30歳以下" | "60歳以上";
    discount: number;
  }[];
  studentDiscountRules?: { minAge?: number; maxAge?: number; discount: number }[];
  discountCombinationRules?: string[];

  // === 端末関連 ===
  simOnlyAvailable: boolean; // SIMのみ契約できるか
  deviceSalesAvailable: boolean; // 端末販売があるか
  supportsReturnProgram: boolean; // 返却プログラム対応か
  availableDevices?: string[]; // モデル名だけ持ってる簡易パターン
  deviceProgram?: DeviceProgramInfo | null;

  // 🆕 ここを追加：端末購入が必須のプランかどうか
  // （診断で「Appleで買う」を選んだときに除外する用）
  devicePurchaseRequired?: boolean;

  // === 海外利用 ===
  overseasSupport: boolean;
  supportsDualSim: boolean;
  allowsLocalSimCombination: boolean;
  supportsGlobalRoaming: boolean;
  supportedRegions?: string[];

  // === 支払い方法 / 経済圏 ===
  supportedPaymentMethods: string[];
  supportsRakutenEconomy?: boolean;
  supportsDEconomy?: boolean;
  supportsAuEconomy?: boolean;
  supportsPayPayEconomy?: boolean;
  shoppingRewardRate?: number;
  paymentRewardRate?: number;
  carrierPaymentRewardRate?: number;
  carrierPaymentRewardLimit?: number;
  carrierShoppingRewardRate_Yahoo?: number;
  carrierShoppingRewardRate_LOHACO?: number;
  carrierShoppingRewardRate_Rakuten?: number;
  carrierShoppingRewardRate_AUPayMarket?: number;
  carrierShoppingRewardRate_PayPayMall?: number; // 🆕 PayPayモール還元率

  // ⚡ 電気・ガスセット対応
  supportsElectricSet?: boolean;
  supportsGasSet?: boolean;
  energyDiscountRules?: {
    type: "電気" | "ガス";
    discount: number;
  }[];

  // 🎬 サブスク割対応
  subscriptionDiscountRules?: SubscriptionDiscountRule[];

  // 💳 支払い割引・還元対応
  paymentBenefitRules?: PaymentBenefitRule[];
  includedSubscriptions?: string;

  // === 料金関連 ===
  deviceDiscountAmount?: number;
  initialCost?: number;
  cashbackAmount?: number;

  // === 🟩 セット割関連 ===
  setDiscountApplied?: boolean;
  setDiscountAmount?: number;
  setCategory?: "光回線" | "ルーター" | "ポケットWi-Fi";
  applicableCategories?: ("fiber" | "router" | "pocketWifi")[];
}

/**
 * ===================================================
 * 💡 セット割データベース定義
 * ===================================================
 */
export interface SetDiscountPlan {
  planId: string;
  carrier: string;
  planName: string;
  setCategory: "光回線" | "ルーター" | "ポケットWi-Fi";
  fiberType?: "戸建て" | "集合住宅（マンション・アパートなど）";
  fiberSpeed?: string;
  setBaseFee: number;
  routerCapacity?: string;
  routerSpeed?: string;
  pocketWifiCapacity?: string | null;
  pocketWifiSpeed?: string | null;
  setDiscountAmount: number;
  applicablePlanIds?: string[];
}

/**
 * ===================================================
 * 💰 料金計算ブレークダウン
 * ===================================================
 */
export interface PlanCostBreakdown {
  baseFee: number;
  callOptionFee: number;
  familyDiscount: number;
  studentDiscount: number;
  ageDiscount: number;
  deviceDiscount: number;
  cashback: number;
  initialFeeMonthly: number;
  tetheringFee: number;
  total: number;

  fiberDiscount?: number;
  routerDiscount?: number;
  pocketWifiDiscount?: number;
  electricDiscount?: number;
  gasDiscount?: number;
  subscriptionDiscount?: number;
  paymentDiscount?: number;
  paymentReward?: number;

  shoppingRewardRate?: number;
  paymentRewardRate?: number;

  deviceLeaseMonthly?: number;
  deviceBuyMonthly?: number;

  // 🆕 キャンペーン項目追加
  campaignCashback?: number;
  campaignMatched?: string[];
}

/**
 * ===================================================
 * 🎁 キャンペーン定義（新規追加）
 * ===================================================
 */
export interface Campaign {
  campaignName: string;
  campaignId: string;
  carrier: string;
  targetPlanIds: string[];
  cashbackAmount: number;
  cashbackType: string;
  conditions: string[];
  description: string;
}
