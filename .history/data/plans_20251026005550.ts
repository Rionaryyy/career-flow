import { Plan } from "@/types/planTypes";

/**
 * ===================================================
 * 📱 モバイルプラン一覧（診断・比較対象）
 * ---------------------------------------------------
 * 各プランは carrier をキーに、
 * 光回線・ルーター・ポケットWi-Fi・電気・ガス・サブスク・支払い方法
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

    applicableCategories: ["fiber", "router", "pocketWifi"],

    supportsElectricSet: true,
    supportsGasSet: true,
    energyDiscountRules: [
      { type: "電気", discount: 500 },
      { type: "ガス", discount: 400 },
    ],

    // ✅ 🎬 サブスクセット割対応
    subscriptionDiscountRules: [
      { id: "sub_docomo_dtv", applicableSubscriptions: ["dTV", "dアニメストア"], discount: 300 },
      { id: "sub_docomo_magazine", applicableSubscriptions: ["dマガジン"], discount: 200 },
      { id: "sub_docomo_disney", applicableSubscriptions: ["Disney+"], discount: 200 },
      { id: "sub_docomo_netflix", applicableSubscriptions: ["Netflix"], discount: 200 },
      { id: "sub_docomo_spotify", applicableSubscriptions: ["Spotify", "Amazon Music"], discount: 150 },
      { id: "sub_docomo_youtube", applicableSubscriptions: ["YouTube Premium"], discount: 150 },
      { id: "sub_docomo_amazon", applicableSubscriptions: ["Amazon Prime Video"], discount: 150 },
      { id: "sub_docomo_bundle", applicableSubscriptions: ["dTV", "Disney+", "Netflix"], discount: 400 },
    ],

    // 💳 支払い方法割引・還元ルール
    paymentBenefitRules: [
      {
        method: "クレジットカード",
        brands: ["dカード", "dカード GOLD"],
        discount: 100,
        rate: 0.10,
        appliesTo: "baseFee",
      },
      {
        method: "銀行口座引き落とし",
        brands: ["みずほ銀行", "三井住友銀行", "三菱UFJ銀行"],
        discount: 50,
        rate: 0.00,
        appliesTo: "baseFee",
      },
    ],

    // 🛍️ 還元率（追加）
    shoppingRewardRate: 0.005, // 0.5%
    paymentRewardRate: 0.01, // 1.0%

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

    applicableCategories: ["fiber", "router", "pocketWifi"],

    supportsElectricSet: true,
    supportsGasSet: true,
    energyDiscountRules: [
      { type: "電気", discount: 500 },
      { type: "ガス", discount: 400 },
    ],

    subscriptionDiscountRules: [
      { id: "sub_softbank_yahoo", applicableSubscriptions: ["Yahoo!プレミアム"], discount: 200 },
      { id: "sub_softbank_line", applicableSubscriptions: ["LINE MUSIC"], discount: 150 },
      { id: "sub_softbank_abema", applicableSubscriptions: ["ABEMAプレミアム"], discount: 200 },
      { id: "sub_softbank_netflix", applicableSubscriptions: ["Netflix"], discount: 200 },
      { id: "sub_softbank_amazon", applicableSubscriptions: ["Amazon Prime Video"], discount: 150 },
      { id: "sub_softbank_youtube", applicableSubscriptions: ["YouTube Premium"], discount: 150 },
      { id: "sub_softbank_spotify", applicableSubscriptions: ["Spotify"], discount: 150 },
      { id: "sub_softbank_bundle", applicableSubscriptions: ["LINE MUSIC", "ABEMAプレミアム", "Netflix"], discount: 350 },
    ],

    paymentBenefitRules: [
      {
        method: "クレジットカード",
        brands: ["ソフトバンクカード", "ソフトバンクカード GOLD", "PayPayカード"],
        discount: 100,
        rate: 0.05,
        appliesTo: "total",
      },
      {
        method: "銀行口座引き落とし",
        brands: ["三井住友銀行", "三菱UFJ銀行"],
        discount: 50,
        rate: 0.00,
        appliesTo: "baseFee",
      },
    ],

    // 🛍️ 還元率（追加）
    shoppingRewardRate: 0.005,
    paymentRewardRate: 0.01,

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

    applicableCategories: ["fiber", "router", "pocketWifi"],

    supportsElectricSet: true,
    supportsGasSet: true,
    energyDiscountRules: [
      { type: "電気", discount: 500 },
      { type: "ガス", discount: 400 },
    ],

    subscriptionDiscountRules: [
      { id: "sub_au_telasa", applicableSubscriptions: ["TELASA（テラサ）"], discount: 300 },
      { id: "sub_au_unext", applicableSubscriptions: ["U-NEXT"], discount: 300 },
      { id: "sub_au_apple", applicableSubscriptions: ["Apple Music"], discount: 150 },
      { id: "sub_au_amazon", applicableSubscriptions: ["Amazon Prime Video"], discount: 200 },
      { id: "sub_au_youtube", applicableSubscriptions: ["YouTube Premium"], discount: 150 },
      { id: "sub_au_netflix", applicableSubscriptions: ["Netflix"], discount: 200 },
      { id: "sub_au_spotify", applicableSubscriptions: ["Spotify"], discount: 150 },
      { id: "sub_au_bundle", applicableSubscriptions: ["TELASA（テラサ）", "U-NEXT", "Amazon Prime Video"], discount: 500 },
    ],

    paymentBenefitRules: [
      {
        method: "クレジットカード",
        brands: ["au PAYカード", "au PAYカード GOLD"],
        discount: 100,
        rate: 0.05,
        appliesTo: "total",
      },
    ],

    // 🛍️ 還元率（追加）
    shoppingRewardRate: 0.005,
    paymentRewardRate: 0.01,

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

    applicableCategories: ["fiber", "router", "pocketWifi"],

    supportsElectricSet: true,
    supportsGasSet: true,
    energyDiscountRules: [
      { type: "電気", discount: 300 },
      { type: "ガス", discount: 300 },
    ],

    subscriptionDiscountRules: [
      { id: "sub_rakuten_tv", applicableSubscriptions: ["Rakuten TV"], discount: 200 },
      { id: "sub_rakuten_music", applicableSubscriptions: ["Rakuten Music"], discount: 150 },
      { id: "sub_rakuten_books", applicableSubscriptions: ["楽天マガジン"], discount: 100 },
      { id: "sub_rakuten_disney", applicableSubscriptions: ["Disney+"], discount: 200 },
      { id: "sub_rakuten_netflix", applicableSubscriptions: ["Netflix"], discount: 200 },
      { id: "sub_rakuten_youtube", applicableSubscriptions: ["YouTube Premium"], discount: 150 },
      { id: "sub_rakuten_spotify", applicableSubscriptions: ["Spotify"], discount: 150 },
      { id: "sub_rakuten_bundle", applicableSubscriptions: ["Rakuten TV", "Rakuten Music", "Netflix"], discount: 400 },
    ],

    paymentBenefitRules: [
      {
        method: "クレジットカード",
        brands: ["楽天カード", "楽天カード GOLD"],
        discount: 100,
        rate: 0.05,
        appliesTo: "total",
      },
      {
        method: "楽天ポイント払い",
        brands: [],
        discount: 0,
        rate: 0.01,
        appliesTo: "total",
      },
    ],

    // 🛍️ 還元率（追加）
    shoppingRewardRate: 0.01, // 楽天市場などは高還元
    paymentRewardRate: 0.015, // 楽天カード利用時は高還元

    setDiscountApplied: false,
    setDiscountAmount: 0,
  },
];