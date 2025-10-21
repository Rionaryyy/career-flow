// data/plans.ts
import { Plan } from "@/types/planTypes";

export const allPlans: Plan[] = [
  // === 既存プラン群 ===
  // ...ここにあなたの既存プランデータが入っているはず...

  // === 以下、テスト＆確認用通話プラン群（フェーズ2フィルター確認用） ===

  // 🕐 1. 時間制限型（5分 / 10分 など）
  {
    planId: "time_5min",
    carrier: "docomo",
    planName: "ドコモ 5分かけ放題プラン",
    planType: "サブブランド",
    baseMonthlyFee: 1980,
    networkQuality: "高",
    requiresAppCall: false,
    availableMethod: "online",

    maxDataGB: 10,
    speedLimitMbps: 1,
    tetheringAvailable: true,

    hasVoicemail: true,
    callOption: true,
    callType: "time",
    callTimeLimit: 5,
    callMonthlyLimit: 0,
    callCountLimit: null,
    callPerCallLimit: null,
    callIncluded: false,

    supportsInternationalUnlimitedCalls: false,
    supportsChildPlan: true,
    simOnlyAvailable: true,
    deviceSalesAvailable: false,
    supportsReturnProgram: false,

    overseasSupport: true,
    supportsDualSim: true,
    allowsLocalSimCombination: true,
    supportsGlobalRoaming: true,
    supportedRegions: ["日本", "アメリカ"],

    supportedPaymentMethods: ["クレジットカード"],
  },

  // 📆 2. 月間制限型（合計通話時間制）
  {
    planId: "monthly_60min",
    carrier: "softbank",
    planName: "ソフトバンク 月60分無料プラン",
    planType: "サブブランド",
    baseMonthlyFee: 2480,
    networkQuality: "中",
    requiresAppCall: false,
    availableMethod: "online",

    maxDataGB: 20,
    speedLimitMbps: 1,
    tetheringAvailable: true,

    hasVoicemail: false,
    callOption: true,
    callType: "monthly",
    callTimeLimit: null,
    callMonthlyLimit: 60,
    callCountLimit: null,
    callPerCallLimit: null,
    callIncluded: false,

    supportsInternationalUnlimitedCalls: false,
    supportsChildPlan: false,
    simOnlyAvailable: true,
    deviceSalesAvailable: false,
    supportsReturnProgram: false,

    overseasSupport: true,
    supportsDualSim: true,
    allowsLocalSimCombination: true,
    supportsGlobalRoaming: true,
    supportedRegions: ["日本", "アジア"],

    supportedPaymentMethods: ["クレジットカード", "口座振替"],
  },

  // 🔁 3. ハイブリッド型（回数 × 時間制限）
  {
    planId: "hybrid_30x10",
    carrier: "au",
    planName: "au 月30回・各10分無料プラン",
    planType: "サブブランド",
    baseMonthlyFee: 2780,
    networkQuality: "高",
    requiresAppCall: false,
    availableMethod: "store",

    maxDataGB: 20,
    speedLimitMbps: 1,
    tetheringAvailable: true,

    hasVoicemail: true,
    callOption: true,
    callType: "hybrid",
    callTimeLimit: null,
    callMonthlyLimit: null,
    callCountLimit: 30,
    callPerCallLimit: 10,
    callIncluded: false,

    supportsInternationalUnlimitedCalls: false,
    supportsChildPlan: true,
    simOnlyAvailable: true,
    deviceSalesAvailable: true,
    supportsReturnProgram: true,

    overseasSupport: true,
    supportsDualSim: true,
    allowsLocalSimCombination: true,
    supportsGlobalRoaming: true,
    supportedRegions: ["日本", "ヨーロッパ"],

    supportedPaymentMethods: ["クレジットカード"],
  },

  // 🌐 4. 無制限型（完全かけ放題）
  {
    planId: "unlimited_call",
    carrier: "rakuten",
    planName: "楽天 無制限かけ放題プラン",
    planType: "大手",
    baseMonthlyFee: 3278,
    networkQuality: "高",
    requiresAppCall: true,
    availableMethod: "online",

    maxDataGB: 999,
    speedLimitMbps: 3,
    tetheringAvailable: true,

    hasVoicemail: true,
    callOption: false,
    callType: "unlimited",
    callTimeLimit: Infinity,
    callMonthlyLimit: Infinity,
    callCountLimit: Infinity,
    callPerCallLimit: Infinity,
    callIncluded: true,

    supportsInternationalUnlimitedCalls: true,
    supportsChildPlan: true,
    simOnlyAvailable: true,
    deviceSalesAvailable: true,
    supportsReturnProgram: false,

    overseasSupport: true,
    supportsDualSim: true,
    allowsLocalSimCombination: true,
    supportsGlobalRoaming: true,
    supportedRegions: ["日本", "アメリカ", "韓国"],

    supportedPaymentMethods: ["クレジットカード", "楽天ポイント払い"],
  },
];
