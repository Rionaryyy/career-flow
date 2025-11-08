// utils/sheets/transformSheetToPlans.ts
import { Plan, CallOption, InternationalCallOption } from "@/types/planTypes";

/**
 * Google Sheets の行データを Plan[] に変換
 */
export function transformSheetToPlans(rows: any[][]): Plan[] {
  if (!rows || rows.length === 0) return [];

  const header = rows[0];
  const dataRows = rows.slice(1);

  // 🔧 ユーティリティ関数群
  const toNumber = (val: any): number => {
    const num = Number(val);
    return Number.isFinite(num) ? num : 0;
  };

  const toBool = (val: any): boolean =>
    String(val).trim().toUpperCase() === "TRUE";

  const toStringArray = (val: any): string[] =>
    !val
      ? []
      : String(val)
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);

  const toCallOptionArray = (val: any): CallOption[] =>
    !val
      ? []
      : String(val)
          .split(",")
          .map((v) => v.trim() as unknown as CallOption)
          .filter(Boolean);

  const toIntlOptionArray = (val: any): InternationalCallOption[] =>
    !val
      ? []
      : String(val)
          .split(",")
          .map((v) => v.trim() as unknown as InternationalCallOption)
          .filter(Boolean);

  const plans = dataRows.map((row, index): Plan => {
    const plan: Record<string, any> = {};
    header.forEach((key: string, i: number) => {
      plan[key] = row[i] ?? "";
    });

    return {
      // === 基本情報 ===
      planId: plan["プランID"] || `plan_${index + 1}`,
      carrier: plan["キャリア"] || "",
      planName: plan["プラン名"] || "",
      planType: plan["キャリア種別"] || "大手",
      baseMonthlyFee: toNumber(plan["基本料金"]),
      networkQuality: plan["通信品質"] || "中",
      requiresAppCall: toBool(plan["専用アプリ通話"]),
      availableMethod: plan["契約方法"] || "both",

      // === 初期費用 ===
      initialFee: toNumber(plan["初期費用（店頭）"]),
      initialFeeOnline: toNumber(plan["初期費用（オンライン）"]),
      esimFee: toNumber(plan["eSIM発行料"]),

      // === データ通信 ===
      maxDataGB: toNumber(plan["データ容量（GB）"]),
      speedLimitMbps: toNumber(plan["速度制限（Mbps）"]),
      tetheringNeeded: toBool(plan["テザリング利用可"]),
      tetheringAvailable: toBool(plan["テザリング利用可"]),
      tetheringUsage: toNumber(plan["テザリング利用上限（GB）"]),
      tetheringFee: toNumber(plan["テザリングオプション料"]),

      // === 通話関連 ===
      hasVoicemail: toBool(plan["留守番電話オプション"]),
      callOption: toBool(plan["かけ放題オプションあり"]),
      callType: plan["通話タイプ"] || "time",
      callIncluded: toBool(plan["無料通話分含む"]),
      callOptions: toCallOptionArray(plan["通話オプションリスト"]),
      internationalOptions: toIntlOptionArray(plan["国際通話オプション"]),
      voicemailFee: toNumber(plan["留守電オプション料"]),

      // === 割引・販売系 ===
      simOnlyAvailable: toBool(plan["SIMのみ契約可"]),
      deviceSalesAvailable: toBool(plan["端末購入可"]),
      supportsReturnProgram: toBool(plan["返却プログラム有"]),

      // === 経済圏 / 支払い ===
      supportedPaymentMethods: toStringArray(plan["対応支払い方法"]),
      // ✅ string[] → string に変換（型: string）
      includedSubscriptions: String(plan["付帯サブスク"] || ""),
      deviceDiscountAmount: toNumber(plan["端末割引額"]),
      cashbackAmount: toNumber(plan["キャッシュバック額"]),

      // === 割引系 ===
      setDiscountApplied: toBool(plan["セット割対象"]),
      setDiscountAmount: toNumber(plan["セット割金額"]),
      // ✅ string[] → "fiber" | "router" | "pocketWifi" の union にキャスト
      applicableCategories: toStringArray(plan["カテゴリ"]).map(
        (v) => v as "fiber" | "router" | "pocketWifi"
      ),

      // === エネルギー割引 ===
      energyDiscountRules: [
        { type: "電気" as const, discount: toNumber(plan["電気割引額"]) },
        { type: "ガス" as const, discount: toNumber(plan["ガス割引額"]) },
      ],

      // === 補完 ===
      supportsChildPlan: toBool(plan["子どもプラン対応"]),
      overseasSupport: toBool(plan["海外対応"]),
      supportsDualSim: toBool(plan["デュアルSIM対応"]),
      allowsLocalSimCombination: toBool(plan["国内SIM併用可"]),
      supportsGlobalRoaming: toBool(plan["海外ローミング可"]),
      supportsRakutenEconomy: toBool(plan["楽天経済圏対応"]),
      supportsDEconomy: toBool(plan["d経済圏対応"]),
      supportsAuEconomy: toBool(plan["au経済圏対応"]),
      supportsPayPayEconomy: toBool(plan["PayPay経済圏対応"]),
      subscriptionDiscountRules: [],
      paymentBenefitRules: [],
    };
  });

  return plans;
}
