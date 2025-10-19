import { z } from "zod";

/**
 * プランデータ構造スキーマ
 * - Googleスプレッドシートから読み込んだ各プランの定義を型で保証
 * - filterPlans.tsで安全にフィルタリング可能
 */
export const planSchema = z.object({
  // 🔹 基本情報
  planId: z.string(),
  carrier: z.enum(["docomo", "au", "softbank", "rakuten"]).optional(),
  plan: z.string(),
  planType: z.enum(["大手", "サブブランド", "格安SIM"]).optional(),
  planDetails: z.string().optional(),

  // 🔹 契約・料金関連
  contractTerm: z.string().optional(),
  contractTerm_Months: z.string().optional(),
  contractCancellationFee: z.string().optional(),
  cashbackOffer: z.string().optional(),
  initialFee: z.string().optional(),
  baseMonthlyFee: z.string().optional(),
  dataAllowance: z.string().optional(),

  // 🔹 通話関連
  voiceAppAvailability: z.string().optional(),
  voiceOption_IncludedUnlimitedCalls: z.string().optional(),
  fiveMinUnlimitedCallsOption: z.string().optional(),
  fifteenMinUnlimitedCallsOption: z.string().optional(),
  unlimitedCallOption: z.string().optional(),

  // 🔹 データ共有・通信品質
  dataSharingAvailability: z.string().optional(),
  dataSharingLimit: z.string().optional(),
  networkQuality: z.string().optional(),

  // 🔹 海外利用
  internationalRoamingAvailability: z.string().optional(),
  internationalDataFee: z.string().optional(),
  internationalCallRate: z.string().optional(),
  postLimitSpeed_Roaming: z.string().optional(),

  // 🔹 割引・キャンペーン
  discountCombination_ActualConditions: z.string().optional(),
  campaignDuration_PlanLevel: z.string().optional(),
  earlyTerminationFeeWaiver: z.string().optional(),
  familyDiscount_1to3Members: z.string().optional(),
  studentDiscount_Under18: z.string().optional(),
  studentDiscount_Under22: z.string().optional(),
  youthDiscount_Under29: z.string().optional(),
  youthDiscount_Under22: z.string().optional(),
  youthDiscount_Under25: z.string().optional(),
  youthDiscount_Under29only: z.string().optional(),
  seniorDiscount_Over60: z.string().optional(),
  childPlan: z.string().optional(),

  // 🔹 端末購入・割引関連
  deviceDiscountAvailability: z.string().optional(),
  deviceDiscountAmount: z.string().optional(),
  devicePurchaseConditions: z.string().optional(),
  deviceReturnPlanAvailability: z.string().optional(),
  deviceReturnConditions: z.string().optional(),

  // 🔹 オプション・サブスク関連
  optionalServices: z.string().optional(),
  optionalServiceFee: z.string().optional(),
  netflixSubscription: z.string().optional(),
  spotifySubscription: z.string().optional(),
  amazonPrimeSubscription: z.string().optional(),
  deviceProtectionOption: z.string().optional(),
  securityOption: z.string().optional(),
  cloudStorageOption: z.string().optional(),
  videoServiceOption: z.string().optional(),
  musicServiceOption: z.string().optional(),

  // 🔹 データ追加・通話パッケージ
  dataAddOn_1GB: z.string().optional(),
  dataAddOn_5GB: z.string().optional(),
  internationalCallPackage: z.string().optional(),
  internationalDataPackage: z.string().optional(),
  domesticSMSOption: z.string().optional(),
  internationalSMSOption: z.string().optional(),

  // 🔹 テザリング関連
  tetheringAvailability: z.string().optional(),
  tetheringDataLimit: z.string().optional(),

  // 🔹 その他
  deviceBalanceAtCancellation_PlanRule: z.string().optional(),
  cashbackAmount: z.string().optional(),
  utilityDiscountAmount: z.string().optional(),
  supportSystem: z.string().optional(),
});

export type Plan = z.infer<typeof planSchema>;
export type PlanSchemaType = z.infer<typeof planSchema>;
