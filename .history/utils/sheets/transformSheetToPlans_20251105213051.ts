import { Plan, CallOption } from "@/types/planTypes";

/**
 * Googleスプレッドシートの「縦持ち（1列=1項目）」データを Plan[] に変換
 * - A列：日本語項目名
 * - B列：英語項目名（プログラム上のキー）
 * - C列以降：各プランのデータ
 */
export function transformSheetToPlans(rows: string[][]): Plan[] {
  if (!rows || rows.length < 2) {
    throw new Error("スプレッドシートのデータ形式が不正です。");
  }

  const englishKeys = rows.map((r) => r[1]); // 英語項目名
  const numPlans = rows[0].length - 2; // C列以降の列数がプラン数

  const toNumber = (val: any) => (val && !isNaN(val) ? Number(val) : 0);
  const toBool = (val: any) => String(val).toLowerCase() === "true";
  const toArray = (val: any) =>
    typeof val === "string" && val.includes(",")
      ? val.split(",").map((v) => v.trim())
      : val
      ? [val]
      : [];

  const plans: Plan[] = [];

  for (let col = 2; col < rows[0].length; col++) {
    const planData: Record<string, any> = {};

    for (let row = 0; row < rows.length; row++) {
      const key = englishKeys[row];
      const value = rows[row][col];
      if (key) planData[key] = value;
    }

    // === 通話オプションを CallOption[] に変換 ===
    const callOptionKeys = [
      "5min", "10min", "15min", "30min",
      "monthly30min", "monthly60min", "monthly70min", "monthly100min",
      "10minX30calls", "10minX50calls", "5minX30calls", "unlimited"
    ];

    const callOptions: CallOption[] = callOptionKeys
      .filter((key) => planData[key] !== undefined && planData[key] !== "")
      .map((key) => ({
        id: key,
        name: key,
        fee: toNumber(planData[key]),
      }));

    const plan: Plan = {
      planId: `plan_${col - 1}`,
      carrier: planData.carrier ?? "",
      planName: planData.planName ?? "",
      planType: (planData.carrierType as "大手" | "サブブランド" | "格安SIM") ?? "大手",
      baseMonthlyFee: toNumber(planData.baseMonthlyFee),
      networkQuality: (planData.networkQuality as "高" | "中" | "低") ?? "中",
      requiresAppCall: toBool(planData.requiresAppCall),
      availableMethod: (planData.contractMethod as "online" | "store" | "both") ?? "both",

      initialFee: toNumber(planData.initialFee),
      initialFeeOnline: toNumber(planData.initialFeeOnline),
      esimFee: toNumber(planData.esimFee),

      maxDataGB: toNumber(planData.dataUsage),
      speedLimitMbps: toNumber(planData.speedLimitMbps),
      tetheringNeeded: toBool(planData.tetheringNeeded),
      tetheringAvailable: toBool(planData.tetheringAvailable),
      tetheringUsage: toNumber(planData.tetheringUsage),
      tetheringFee: 0,

      hasVoicemail: toBool(planData.hasVoicemail),
      callOption: true,
      callType: "time",
      callIncluded: true,
      callOptions,
      internationalOptions: [],
      voicemailFee: 0,

      supportsChildPlan: toBool(planData.supportsChildPlan),
      simOnlyAvailable: true,
      deviceSalesAvailable: toBool(planData.deviceSalesAvailable),
      supportsReturnProgram: toBool(planData.supportsReturnProgram),

      overseasSupport: toBool(planData.overseasSupport),
      supportsDualSim: false,
      allowsLocalSimCombination: false,
      supportsGlobalRoaming: false,

      supportedPaymentMethods: toArray(planData.paymentTiming),
      supportsRakutenEconomy: planData.carrier === "rakuten",
      supportsDEconomy: planData.carrier === "docomo",
      supportsAuEconomy: planData.carrier === "au",
      supportsPayPayEconomy: planData.carrier === "softbank",

      energyDiscountRules: [
        { type: "電気", discount: toNumber(planData.electricDiscount) },
        { type: "ガス", discount: toNumber(planData.gasDiscount) },
      ],
      subscriptionDiscountRules: [],
      paymentBenefitRules: [],
      includedSubscriptions: Array.isArray(toArray(planData.includedSubscriptions))
        ? toArray(planData.includedSubscriptions).join(",")
        : planData.includedSubscriptions ?? "",

      deviceDiscountAmount: 0,
      cashbackAmount: 0,
      setDiscountApplied: false,
      setDiscountAmount: 0,
      applicableCategories: [],
    };

    plans.push(plan);
  }

  return plans;
}
