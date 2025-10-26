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

  // === Phase2: データ・テザリング ===
  maxDataGB: number;
  speedLimitMbps: number;
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

  // === 割引・家族系 ===
  supportsChildPlan: boolean;
  familyLines?: number;
  supportsFamilyDiscount?: boolean;
  supportsStudentDiscount?: boolean;
  supportsAgeDiscount?: boolean;
  familyDiscountRules?: { lines: number; discount: number }[];
  familyDiscountCap?: number;
  ageDiscountRules?: { ageGroup: "18歳以下" | "25歳以下" | "30歳以下" | "60歳以上"; discount: number }[];
  studentDiscountRules?: { minAge?: number; maxAge?: number; discount: number }[];
  discountCombinationRules?: string[];

  // === 端末関連 ===
  simOnlyAvailable: boolean;
  deviceSalesAvailable: boolean;
  supportsReturnProgram: boolean;
  availableDevices?: string[];

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

  // === 料金関連 ===
  deviceDiscountAmount?: number;
  cashbackAmount?: number;
  initialFee?: number;

  // === 🟩 セット割適用後フィールド（可変） ===
  setDiscountApplied?: boolean;      // 割引適用済みフラグ
  setDiscountAmount?: number;        // 割引額（円）
  setCategory?: "光回線" | "ルーター" | "ポケットWi-Fi"; // 適用元カテゴリ

  // === 🆕 セット割対象カテゴリ（動的検索用） ===
  applicableCategories?: ("fiber" | "router" | "pocketWifi")[];
}

/**
 * ===================================================
 * 💡 セット割データベース定義（光回線・Wi-Fi・ルーター等）
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

  // ルーター専用
  routerCapacity?: string;
  routerSpeed?: string;

  // 🟩 ポケットWi-Fi関連
  pocketWifiCapacity?: string | null;
  pocketWifiSpeed?: string | null;

  setDiscountAmount: number;

    // 🆕 追加：どのモバイルプランに適用できるか
  applicablePlanIds?: string[];
  
}

/**
 * ===================================================
 * 💰 料金計算ブレークダウン（Resultで使用）
 * ===================================================
 */
export interface PlanCostBreakdown {
  baseFee: number;
  callOptionFee: number;
  familyDiscount: number;
  studentDiscount: number;
  ageDiscount: number;
  economyDiscount: number;
  deviceDiscount: number;
  cashback: number;
  initialFeeMonthly: number;
  tetheringFee: number;
  total: number;

  // 🏠 セット割（新規追加）
  fiberDiscount?: number;
  routerDiscount?: number;
  pocketWifiDiscount?: number;
}
