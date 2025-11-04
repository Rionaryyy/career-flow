import { Plan, CallOption } from "@/types/planTypes";

/**
 * Googleスプレッドシートのデータを Plan[] に変換
 */
export function transformSheetToPlans(rows: string[][]): Plan[] {
  const header = rows[0];
  const dataRows = rows.slice(1);

  const toNumber = (val: any) => (val && !isNaN(val) ? Number(val) : 0);
  const toBool = (val: any) => String(val).toLowerCase() === "true";
  const toArray = (val: any) =>
    typeof val === "string" && val.includes(",")
      ? val.split(",").map((v) => v.trim())
      : val
      ? [val]
      : [];

  const plans: Plan[] = dataRows.map((row, i) => {
    const obj: Record<string, any> = {};
    header.forEach((key, j) => {
      obj[key] = row[j];
    });

    // === 通話オプションを CallOption[] に変換 ===
    const callOptionKeys = [
      "5min", "10min", "15min", "30min",
      "monthly30min", "monthly60min", "monthly70min", "monthly100min",
      "10minX30calls", "10minX50calls", "5minX30calls", "unlimited"
    ];

    const callOptions: CallOption[] = callOptionKeys
      .filter((key) => obj[key] !== undefined && obj[key] !== "")
      .map((key) => ({
        id: key,
        name: key,
        fee: toNumber(obj[key]),
      }));

    const plan: Plan = {
      planId: `plan_${i + 1}`,
      carrier: obj.carrier ?? "",
      planName: obj.planName ?? "",
      planType: (obj.carrierType as "大手" | "サブブランド" | "格安SIM") ?? "大手", // ✅ 修正①
      baseMonthlyFee: toNumber(obj.baseMonthlyFee),
      networkQuality: (obj.networkQuality as "高" | "中" | "低") ?? "中",
      requiresAppCall: false, // スプレッドシートに該当列がなければ false で初期化
      availableMethod: (obj.contractMethod as "online" | "store" | "both") ?? "both",

      // 初期費用・料金系
      initialFee: toNumber(obj.initialFee),
      initialFeeOnline: toNumber(obj.initialFeeOnline),
      esimFee: toNumber(obj.esimFee),

      // データ関連
      maxDataGB: toNumber(obj.dataUsage),
      speedLimitMbps: toNumber(obj.speedLimitMbps),
      tetheringNeeded: toBool(obj.tetheringNeeded),
      tetheringAvailable: toBool(obj.tetheringAvailable),
      tetheringUsage: toNumber(obj.tetheringUsage),
      tetheringFee: 0,

      // 通話関連
      hasVoicemail: toBool(obj.hasVoicemail),
      callOption: true,
      callType: "time",
      callIncluded: true,
      callOptions, // ✅ 修正②
      internationalOptions: [],
      voicemailFee: 0,

      // 割引・家族関連
      supportsChildPlan: toBool(obj.supportsChildPlan),
      simOnlyAvailable: true,
      deviceSalesAvailable: toBool(obj.deviceSalesAvailable),
      supportsReturnProgram: toBool(obj.supportsReturnProgram),

      // 海外対応
      overseasSupport: toBool(obj.overseasSupport),
      supportsDualSim: false,
      allowsLocalSimCombination: false,
      supportsGlobalRoaming: false,

      // 支払い・経済圏
      supportedPaymentMethods: toArray(obj.paymentTiming),
      supportsRakutenEconomy: obj.carrier === "rakuten",
      supportsDEconomy: obj.carrier === "docomo",
      supportsAuEconomy: obj.carrier === "au",
      supportsPayPayEconomy: obj.carrier === "softbank",

      // 割引系
      energyDiscountRules: [
        { type: "電気", discount: toNumber(obj.electricDiscount) },
        { type: "ガス", discount: toNumber(obj.gasDiscount) },
      ],
      subscriptionDiscountRules: [],
      paymentBenefitRules: [],
      includedSubscriptions: Array.isArray(toArray(obj.includedSubscriptions))
        ? toArray(obj.includedSubscriptions).join(",") // ✅ 修正③
        : obj.includedSubscriptions ?? "",

      // 料金関連
      deviceDiscountAmount: 0,
      cashbackAmount: 0,

      // セット割系
      setDiscountApplied: false,
      setDiscountAmount: 0,
      applicableCategories: [],
    };

    return plan;
  });

  return plans;
}
