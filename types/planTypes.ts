// types/planTypes.ts

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
  tetheringNeeded?: boolean; // テザリング必要かどうか
  tetheringAvailable: boolean;
  tetheringUsage: number; // null禁止にして常に保持
  tetheringFee: number;

  // === Phase2: 通話関連 ===
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

  // === Phase2: 割引・家族系 ===
  supportsChildPlan: boolean;
  familyLines?: number;

  // === 割引・特典フラグ ===
  supportsFamilyDiscount?: boolean; // 家族割対応
  supportsStudentDiscount?: boolean; // 学割対応
  supportsAgeDiscount?: boolean;     // 年齢割対応

  // === 家族割詳細 ===
  familyDiscountRules?: { lines: number; discount: number }[];
  familyDiscountCap?: number;

  // === 年齢別割引ルール（キャリアごと設定） ===
  ageDiscountRules?: {
    ageGroup: "18歳以下" | "25歳以下" | "30歳以下" | "60歳以上";
    discount: number;
  }[];

  // === 学割ルール（キャリア／年齢範囲別設定） ===
  studentDiscountRules?: {
    minAge?: number;
    maxAge?: number;
    discount: number;
  }[];

  // === 併用可否ルール（例: ["exclusive_student_age"]）
  discountCombinationRules?: string[];

  // === Phase2: 端末関連 ===
  simOnlyAvailable: boolean;
  deviceSalesAvailable: boolean;
  supportsReturnProgram: boolean;
  availableDevices?: string[];

  // === Phase2: 海外利用 ===
  overseasSupport: boolean;
  supportsDualSim: boolean;
  allowsLocalSimCombination: boolean;
  supportsGlobalRoaming: boolean;
  supportedRegions?: string[];

  // === Phase2: 支払い方法 / 経済圏 ===
  supportedPaymentMethods: string[];
  supportsRakutenEconomy?: boolean;
  supportsDEconomy?: boolean;
  supportsAuEconomy?: boolean;
  supportsPayPayEconomy?: boolean;

  // === 料金・割引関連 ===
  deviceDiscountAmount?: number;
  cashbackAmount?: number;
  initialFee?: number;
}
