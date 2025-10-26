import { Plan } from "@/types/planTypes";

/**
 * ===================================================
 * 📱 モバイルプラン一覧（診断・比較対象）
 * ---------------------------------------------------
 * 各プランは carrier をキーに、
 * 光回線・ルーター・ポケットWi-Fi・電気・ガス
 * の中から条件に合う最安セット割を動的に探索。
 * ===================================================
 */
export const allPlans: Plan[] = [
  // === 🕐 ドコモ 5分かけ放題 ===
  {
    planId: "time_5min",
    carrier: "docomo",
    planName: "ドコモ 5分かけ放題プラン",
    planType: "サブブランド",
    baseMonthlyFee: 1980,
    networkQuality: "高",
    requiresAppCall: false,
    availableMethod: "online",
    maxDataGB: 30,
    speedLimitMbps: 1,
    tetheringAvailable: true,
    tetheringNeeded: true,
    tetheringUsage: 30,
    tetheringFee: 0,
    hasVoicemail: true,
    callOption: true,
    callType: "time",
    callTimeLimit: 5,
    callMonthlyLimit: 0,
    callCountLimit: null,
    callPerCallLimit: null,
    callIncluded: false,
    callOptions: [
      { id: "none", name: "なし", fee: 0 },
      { id: "5min", name: "5分かけ放題", fee: 550 },
      { id: "10min", name: "10分かけ放題", fee: 880 },
    ],
    supportsFamilyDiscount: true,
    familyDiscountRules: [
      { lines: 2, discount: 550 },
      { lines: 3, discount: 1100 },
    ],
    familyDiscountCap: 1100,
    supportsStudentDiscount: true,
    supportsAgeDiscount: true,
    studentDiscountRules: [
      { minAge: 15, maxAge: 22, discount: 600 },
      { minAge: 23, maxAge: 25, discount: 400 },
    ],
    ageDiscountRules: [
      { ageGroup: "18歳以下", discount: 600 },
      { ageGroup: "25歳以下", discount: 500 },
      { ageGroup: "30歳以下", discount: 300 },
      { ageGroup: "60歳以上", discount: 200 },
    ],
    discountCombinationRules: ["exclusive_student_age"],
    supportsDEconomy: true,
    supportsInternationalUnlimitedCalls: false,
    supportsChildPlan: true,
    simOnlyAvailable: true,
    deviceSalesAvailable: true,
    supportsReturnProgram: false,
    deviceDiscountAmount: 300,
    cashbackAmount: 1200,
    overseasSupport: true,
    supportsDualSim: true,
    allowsLocalSimCombination: true,
    supportsGlobalRoaming: true,
    supportedRegions: ["日本", "アメリカ"],
    supportedPaymentMethods: ["クレジットカード", "口座振替"],

    // ✅ 対応セットカテゴリ（動的検索用）
    applicableCategories: ["fiber", "router", "pocketWifi"],

    // ✅ 電気・ガスセット対応
    supportsElectricSet: true,
    supportsGasSet: true,
    energyDiscountRules: [
      { type: "電気", discount: 500 },
      { type: "ガス", discount: 400 },
    ],

    // ✅ セット割情報（初期値）
    setDiscountApplied: false,
    setDiscountAmount: 0,
  },

  // === 📆 ソフトバンク 月60分無料 ===
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
    tetheringNeeded: true,
    tetheringUsage: 60,
    tetheringFee: 220,
    hasVoicemail: false,
    callOption: true,
    callType: "monthly",
    callMonthlyLimit: 60,
    callIncluded: false,
    callOptions: [
      { id: "none", name: "なし", fee: 0 },
      { id: "monthly30", name: "月30分無料", fee: 550 },
      { id: "monthly60", name: "月60分無料", fee: 770 },
    ],
    supportsFamilyDiscount: true,
    familyDiscountRules: [
      { lines: 2, discount: 550 },
      { lines: 3, discount: 1100 },
      { lines: 4, discount: 1320 },
    ],
    familyDiscountCap: 1320,
    supportsStudentDiscount: true,
    supportsAgeDiscount: true,
    studentDiscountRules: [
      { minAge: 15, maxAge: 22, discount: 1100 },
      { minAge: 23, maxAge: 25, discount: 800 },
    ],
    ageDiscountRules: [
      { ageGroup: "18歳以下", discount: 500 },
      { ageGroup: "25歳以下", discount: 400 },
      { ageGroup: "30歳以下", discount: 300 },
      { ageGroup: "60歳以上", discount: 200 },
    ],
    discountCombinationRules: ["exclusive_student_age"],
    supportsPayPayEconomy: true,
    deviceDiscountAmount: 500,
    cashbackAmount: 1200,
    supportsReturnProgram: true,
    overseasSupport: true,
    supportsDualSim: true,
    allowsLocalSimCombination: true,
    supportsGlobalRoaming: true,
    supportedRegions: ["日本", "アジア"],
    supportedPaymentMethods: ["クレジットカード", "口座振替"],
    simOnlyAvailable: true,
    deviceSalesAvailable: true,
    supportsChildPlan: false,

    // ✅ 対応セットカテゴリ（動的検索用）
    applicableCategories: ["fiber", "router", "pocketWifi"],

    // ✅ 電気・ガスセット対応
    supportsElectricSet: true,
    supportsGasSet: true,
    energyDiscountRules: [
      { type: "電気", discount: 500 },
      { type: "ガス", discount: 400 },
    ],

    // ✅ セット割情報（初期値）
    setDiscountApplied: false,
    setDiscountAmount: 0,
  },

  // === 🔁 au ハイブリッド（30回×10分） ===
  {
    planId: "hybrid_30x10",
    carrier: "au",
    planName: "au 月30回・各10分無料プラン",
    planType: "サブブランド",
    baseMonthlyFee: 2780,
    networkQuality: "高",
    requiresAppCall: false,
    availableMethod: "both",
    maxDataGB: 20,
    speedLimitMbps: 1,
    tetheringAvailable: true,
    tetheringNeeded: true,
    tetheringUsage: 60,
    tetheringFee: 330,
    hasVoicemail: true,
    callOption: true,
    callType: "hybrid",
    callCountLimit: 30,
    callPerCallLimit: 10,
    callIncluded: false,
    callOptions: [
      { id: "none", name: "なし", fee: 0 },
      { id: "hybrid_30x10", name: "月30回・各10分無料", fee: 880 },
    ],
    supportsFamilyDiscount: true,
    familyDiscountRules: [
      { lines: 2, discount: 550 },
      { lines: 3, discount: 1100 },
    ],
    familyDiscountCap: 1100,
    supportsStudentDiscount: true,
    supportsAgeDiscount: true,
    studentDiscountRules: [
      { minAge: 15, maxAge: 22, discount: 1000 },
      { minAge: 23, maxAge: 25, discount: 700 },
    ],
    ageDiscountRules: [
      { ageGroup: "18歳以下", discount: 550 },
      { ageGroup: "25歳以下", discount: 450 },
      { ageGroup: "30歳以下", discount: 350 },
      { ageGroup: "60歳以上", discount: 250 },
    ],
    discountCombinationRules: ["exclusive_student_age"],
    supportsAuEconomy: true,
    deviceDiscountAmount: 400,
    cashbackAmount: 2400,
    supportsReturnProgram: true,
    simOnlyAvailable: true,
    deviceSalesAvailable: true,
    overseasSupport: true,
    supportsDualSim: true,
    allowsLocalSimCombination: true,
    supportsGlobalRoaming: true,
    supportedRegions: ["日本", "ヨーロッパ"],
    supportedPaymentMethods: ["クレジットカード"],
    supportsChildPlan: false,

    // ✅ 対応セットカテゴリ（動的検索用）
    applicableCategories: ["fiber", "router", "pocketWifi"],

    // ✅ 電気・ガスセット対応
    supportsElectricSet: true,
    supportsGasSet: true,
    energyDiscountRules: [
      { type: "電気", discount: 500 },
      { type: "ガス", discount: 400 },
    ],

    // ✅ セット割情報（初期値）
    setDiscountApplied: false,
    setDiscountAmount: 0,
  },

  // === 🌐 楽天 無制限かけ放題 ===
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
    tetheringNeeded: true,
    tetheringUsage: 999,
    tetheringFee: 0,
    hasVoicemail: true,
    callOption: false,
    callType: "unlimited",
    callIncluded: true,
    callOptions: [{ id: "unlimited", name: "無制限かけ放題", fee: 0 }],
    supportsFamilyDiscount: true,
    familyDiscountRules: [
      { lines: 2, discount: 200 },
      { lines: 3, discount: 400 },
      { lines: 4, discount: 600 },
    ],
    familyDiscountCap: 600,
    supportsStudentDiscount: true,
    supportsAgeDiscount: true,
    studentDiscountRules: [
      { minAge: 15, maxAge: 22, discount: 440 },
      { minAge: 23, maxAge: 25, discount: 300 },
    ],
    ageDiscountRules: [
      { ageGroup: "18歳以下", discount: 400 },
      { ageGroup: "25歳以下", discount: 300 },
      { ageGroup: "30歳以下", discount: 200 },
      { ageGroup: "60歳以上", discount: 150 },
    ],
    discountCombinationRules: ["exclusive_student_age"],
    supportsRakutenEconomy: true,
    deviceDiscountAmount: 500,
    cashbackAmount: 2400,
    simOnlyAvailable: true,
    deviceSalesAvailable: true,
    supportsReturnProgram: false,
    overseasSupport: true,
    supportsDualSim: true,
    allowsLocalSimCombination: true,
    supportsGlobalRoaming: true,
    supportedRegions: ["日本", "アメリカ", "韓国"],
    supportedPaymentMethods: ["クレジットカード", "楽天ポイント払い"],
    supportsChildPlan: false,

    // ✅ 対応セットカテゴリ（動的検索用）
    applicableCategories: ["fiber", "router", "pocketWifi"],

    // ✅ 電気・ガスセット対応
    supportsElectricSet: true,
    supportsGasSet: true,
    energyDiscountRules: [
      { type: "電気", discount: 300 },
      { type: "ガス", discount: 300 },
    ],

    // ✅ セット割情報（初期値）
    setDiscountApplied: false,
    setDiscountAmount: 0,
  },
];
