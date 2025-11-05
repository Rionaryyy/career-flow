import { Plan } from "@/types/planTypes";

/**
 * Google Sheets から取得した 2次元配列を Plan[] に変換する関数
 */
export function transformSheetToPlans(rows: any[][]): Plan[] {
  if (!rows || rows.length === 0) return [];

  const header = rows[0];
  const dataRows = rows.slice(1);

  const plans: Plan[] = dataRows.map((row, index) => {
    const plan: any = {};
    header.forEach((key: string, i: number) => {
      plan[key] = row[i] ?? "";
    });

    return {
      // === 基本情報 ===
      planId: plan.planId || `plan_${index + 1}`,
      carrier: plan.carrier || "",
      planName: plan.planName || "",
      planType: plan.planType || "大手",
      baseMonthlyFee: Number(plan.baseMonthlyFee) || 0,
      networkQuality: plan.networkQuality || "中",
      requiresAppCall: plan.requiresAppCall === "TRUE",
      availableMethod: plan.availableMethod || "both",

      // === 初期費用 ===
      initialFee: Number(plan.initialFee) || 0,
      initialFeeOnline: Number(plan.initialFeeOnline) || 0,
      esimFee: Number(plan.esimFee) || 0,

      // === データ通信 ===
      maxDataGB: Number(plan.maxDataGB) || 0,
      speedLimitMbps: Number(plan.speedLimitMbps) || 0,
      tetheringNeeded: plan.tetheringNeeded === "TRUE",
      tetheringAvailable: plan.tetheringAvailable === "TRUE",
      tetheringUsage: Number(plan.tetheringUsage) || 0,
      tetheringFee: Number(plan.tetheringFee) || 0,

      // === 通話関連 ===
      hasVoicemail: plan.hasVoicemail === "TRUE",
      callOption: plan.callOption === "TRUE",
      callType: plan.callType || "time",
      callIncluded: plan.callIncluded === "TRUE",
      callOptions: plan.callOptions ? plan.callOptions.split(",") : [],
      internationalOptions: plan.internationalOptions ? plan.internationalOptions.split(",") : [],
      voicemailFee: Number(plan.voicemailFee) || 0,

      // === 割引・販売系 ===
      simOnlyAvailable: plan.simOnlyAvailable === "TRUE",
      deviceSalesAvailable: plan.deviceSalesAvailable === "TRUE",
      supportsReturnProgram: plan.supportsReturnProgram === "TRUE",

      // === 経済圏 / 支払い ===
      supportedPaymentMethods: plan.supportedPaymentMethods
        ? plan.supportedPaymentMethods.split(",")
        : [],
      includedSubscriptions: plan.includedSubscriptions
        ? plan.includedSubscriptions.split(",")
        : [],
      deviceDiscountAmount: Number(plan.deviceDiscountAmount) || 0,
      cashbackAmount: Number(plan.cashbackAmount) || 0,

      // === 割引系 ===
      setDiscountApplied: plan.setDiscountApplied === "TRUE",
      setDiscountAmount: Number(plan.setDiscountAmount) || 0,
      applicableCategories: plan.applicableCategories
        ? plan.applicableCategories.split(",")
        : [],

      // === エネルギー割引 ===
      energyDiscountRules: [
        { type: "電気", discount: Number(plan.energyDiscountElectric) || 0 },
        { type: "ガス", discount: Number(plan.energyDiscountGas) || 0 },
      ],

      // === 欠けていたフィールドのデフォルト補完 ===
      supportsChildPlan: false,
      overseasSupport: false,
      supportsDualSim: false,
      allowsLocalSimCombination: false,
      supportsGlobalRoaming: false,
      supportsRakutenEconomy: false,
      supportsDEconomy: false,
      supportsAuEconomy: false,
      supportsPayPayEconomy: false,
      subscriptionDiscountRules: [],
      paymentBenefitRules: [],
    };
  });

  return plans;
}
