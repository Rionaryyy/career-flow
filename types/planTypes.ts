// types/planTypes.ts

// === Phase1 共通タイプ定義 ===
export type PlanType = "大手" | "サブブランド" | "格安SIM";
export type NetworkQuality = "低" | "中" | "高";
export type AvailableMethod = "online" | "store" | "both";

export interface Plan {
  // === Phase1: 基本属性 ===
  planId: string;
  planName: string;
  carrier: string;
  planType: PlanType;
  baseMonthlyFee: number;
  networkQuality: NetworkQuality;
  requiresAppCall: boolean; // 例: 楽天リンク必須など
  availableMethod: AvailableMethod;

  // === Phase2: データ関連 ===
  maxDataGB: number; // 無制限は Infinity 推奨
  speedLimitMbps: number; // 制限時や混雑時の目安
  tetheringAvailable: boolean;
  tetheringMaxGB?: number | typeof Infinity;
  tetheringFee?: number; // テザリング利用料（円）

  // === Phase2: 通話関連（新規追加）===
  hasVoicemail: boolean; // 留守番電話対応
  callOption?: boolean; // かけ放題オプション有無
  callType?: "time" | "monthly" | "hybrid" | "unlimited" | null; // プラン種別
  callTimeLimit?: number | null; // 1回あたり通話上限（分）
  callMonthlyLimit?: number | null; // 月内合計上限（分）
  callCountLimit?: number | null; // 月内通話回数上限
  callPerCallLimit?: number | null; // 1通話あたりの上限（ハイブリッド型）
  callIncluded?: boolean; // 基本料金にかけ放題が含まれるか
  supportsInternationalUnlimitedCalls?: boolean; // 海外通話かけ放題に対応しているか
  
  // === Phase2: 割引・家族系 ===
  supportsChildPlan: boolean;
  familyLines?: number; // 家族割人数または割引額
  studentDiscount_Under22?: boolean; // 学割（22歳以下）
  studentDiscount_Under18?: boolean; // 学割（18歳以下）

  // === Phase2: 端末関連 ===
  simOnlyAvailable: boolean;
  deviceSalesAvailable: boolean;
  supportsReturnProgram: boolean;
  availableDevices?: string[];

  // === Phase2: 海外利用 ===
  supportsOverseasUse: boolean;
  supportsDualSim: boolean;
  allowsLocalSimCombination: boolean;
  supportsGlobalRoaming: boolean;
  supportedRegions?: string[];

  // === Phase2: 支払い方法 / 経済圏 ===
  supportedPaymentMethods: string[]; // ["クレジットカード","口座振替",...]
  supportsRakutenEconomy?: boolean;
  supportsDEconomy?: boolean;
  supportsAuEconomy?: boolean;
  supportsPayPayEconomy?: boolean;

  // === 料金・割引関連 ===
  deviceDiscountAmount?: number; // 端末割引額
  cashbackAmount?: number; // キャッシュバック額
  initialFee?: number; // 初期費用（円）
}
