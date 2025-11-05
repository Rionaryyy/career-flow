import { Plan } from "../types/planTypes";
import { devicePricesLease } from "../data/devicePricesLease";
import { devicePricesBuy } from "../data/devicePricesBuy";



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
    initialFee: 4950,        // 店頭契約時
    initialFeeOnline: 0,     // オンライン契約時
    esimFee: 0,              // eSIM発行手数料
    baseMonthlyFee: 1980,
    networkQuality: "高",
    requiresAppCall: false,
    availableMethod: "both",
    maxDataGB: 30,
    speedLimitMbps: 0.5,
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
    voicemailFee: 300,
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
      // 💰 初期費用・キャッシュバック
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
    carrierPaymentRewardRate: 0.005,          // d払い +0.5%
carrierPaymentRewardLimit: 1000,
carrierShoppingRewardRate_Yahoo: 0,
carrierShoppingRewardRate_LOHACO: 0,
carrierShoppingRewardRate_Rakuten: 0,
carrierShoppingRewardRate_AUPayMarket: 0,


    // ✅ 🎬 サブスクセット割対応
  includedSubscriptions: "Netflix, Disney+, Apple Music, Spotify",


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
    availableMethod: "both",
    maxDataGB: 20,
    speedLimitMbps: 1,
    initialFee: 4950,
    initialFeeOnline: 0,
    esimFee: 550,
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
    supportsInternationalUnlimitedCalls: false,
    voicemailFee: 200,
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
       // 💰 初期費用・キャッシュバック
   
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

    // 💳 キャリア還元・ショッピング加算（バーコード決済・経済圏）
carrierPaymentRewardRate: 0.05,          // PayPay利用時の還元率（例：5%）
carrierPaymentRewardLimit: 1500,         // 月上限（円）
carrierShoppingRewardRate_Yahoo: 0.02,   // Yahoo!ショッピング +2%
carrierShoppingRewardRate_LOHACO: 0.02,  // LOHACO +2%
carrierShoppingRewardRate_Rakuten: 0,    // 楽天市場は対象外
carrierShoppingRewardRate_AUPayMarket: 0,// au PAYマーケット対象外



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
    initialFee: 3300,
    initialFeeOnline: 0,
    esimFee: 0,

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
    internationalOptions: [
  {
    id: "international_unlimited_au",
    name: "国際通話定額オプション（23カ国・月900分）",
    description: "対象23カ国への国際通話が月900分まで無料（以降30秒22円）",
    fee: 900,
    type: "international",
  },
],
voicemailFee: 330,
    supportsInternationalUnlimitedCalls: true, // ✅ ←追加
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
    // 💰 初期費用・キャッシュバック
   
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
carrierPaymentRewardRate: 0.005,          // au PAY +0.5%
carrierPaymentRewardLimit: 1000,
carrierShoppingRewardRate_Yahoo: 0,
carrierShoppingRewardRate_LOHACO: 0,
carrierShoppingRewardRate_Rakuten: 0,
carrierShoppingRewardRate_AUPayMarket: 0.01, // au PAYマーケット +1%



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
     initialFee: 3300,
    initialFeeOnline: 0,
    esimFee: 550,
    networkQuality: "高",
    requiresAppCall: true,
    availableMethod: "both",
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
    internationalOptions: [
  {
    id: "international_unlimited_rakuten",
    name: "国際通話かけ放題オプション（65カ国対象）",
    description: "Rakuten Linkアプリ利用で65カ国への国際通話がかけ放題",
    fee: 980,
    type: "international",
  },
],
voicemailFee: 0,

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
    supportsInternationalUnlimitedCalls: true, // ✅ ←追加
    ageDiscountRules: [
      { ageGroup: "18歳以下", discount: 400 },
      { ageGroup: "25歳以下", discount: 300 },
      { ageGroup: "30歳以下", discount: 200 },
      { ageGroup: "60歳以上", discount: 150 },
    ],
    discountCombinationRules: ["exclusive_student_age"],
    supportsRakutenEconomy: true,
    deviceDiscountAmount: 500,
    // 💰 初期費用・キャッシュバック
  
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
carrierPaymentRewardRate: 0.01,           // 楽天ペイ +1%
carrierPaymentRewardLimit: 500,           // 月上限（円）
carrierShoppingRewardRate_Yahoo: 0,
carrierShoppingRewardRate_LOHACO: 0,
carrierShoppingRewardRate_Rakuten: 0.01,  // 楽天市場 +1%（SPU）
carrierShoppingRewardRate_AUPayMarket: 0,



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

/**
 * ===================================================
 * 📦 devicePrices（返却プログラム／購入プログラム）自動紐付け
 * ---------------------------------------------------
 * iPhone 17 Pro (512GB) のデータを参照。
 * ===================================================
 */
export const allPlansWithDevices: Plan[] = allPlans.map((plan) => {
  // リース（返却プログラム）を検索
  const leaseDevice = devicePricesLease.find(
    (d) =>
      d.carrier === plan.carrier &&
      d.model === "iPhone 17 Pro" &&
      d.storage === "512GB"
  );

  // 購入（所有型）を検索
  const buyDevice = devicePricesBuy.find(
    (d) =>
      d.carrier === plan.carrier &&
      d.model === "iPhone 17 Pro" &&
      d.storage === "512GB"
  );

  // === deviceProgram を構成 ===
  let deviceProgram = null;

  if (leaseDevice) {
    deviceProgram = {
      model: leaseDevice.model,
      storage: leaseDevice.storage,
      programName: leaseDevice.programName,
      monthlyPayment: leaseDevice.monthlyPayment,
      paymentMonths: leaseDevice.paymentMonths,
      returnOption: leaseDevice.returnOption,
      ownershipType: leaseDevice.ownershipType,
    };
  } else if (buyDevice) {
    deviceProgram = {
      model: buyDevice.model,
      storage: buyDevice.storage,
      programName: buyDevice.programName,
      monthlyPayment: buyDevice.monthlyPayment,
      paymentMonths: buyDevice.paymentMonths,
      returnOption: buyDevice.returnOption,
      ownershipType: buyDevice.ownershipType,
    };
  }

  // supportsReturnProgram の設定
  const supportsReturn =
    leaseDevice !== undefined && plan.planType !== "サブブランド";

  return {
    ...plan,
    deviceProgram,
    supportsReturnProgram: supportsReturn,
  };
});