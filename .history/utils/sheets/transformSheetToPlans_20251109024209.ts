// utils/sheets/transformSheetToPlans.ts
import { Plan, CallOption, InternationalCallOption } from "@/types/planTypes";

/**
 * Google Sheets の行データを Plan[] に変換
 */
export function transformSheetToPlans(rows: any[][]): Plan[] {
  if (!rows || rows.length === 0) return [];

  // 🧹 ヘッダー整形（クォート・空白・全角スペースを削除）
  const header = rows[0].map((h) =>
    String(h).replace(/["\\]/g, "").replace(/\s+/g, "").trim()
  );
  const dataRows = rows.slice(1);

  // 🔧 ユーティリティ関数群
  const toNumber = (val: any): number => {
    const num = Number(val);
    return Number.isFinite(num) ? num : 0;
  };

  const toBool = (val: any): boolean => {
    if (val === true || val === false) return val;
    const str = String(val).trim().toLowerCase();
    return str === "true" || str === "yes" || str === "1";
  };

  const toStringArray = (val: any): string[] =>
    !val
      ? []
      : String(val)
          .split(/[,、]/)
          .map((v) => v.trim())
          .filter(Boolean);

  const toCallOptionArray = (plan: Record<string, any>): CallOption[] => {
    const options: CallOption[] = [];
    const optionIds = [
      "5min",
      "10min",
      "15min",
      "30min",
      "monthly30min",
      "monthly60min",
      "monthly70min",
      "monthly100min",
      "10minX30calls",
      "10minX50calls",
      "5minX30calls",
      "unlimited",
    ];

    optionIds.forEach((id) => {
      const fee = Number(plan[id]);
      if (!isNaN(fee) && fee > 0) {
        options.push({ id, name: id, fee });
      }
    });
    return options;
  };

  const toIntlOptionArray = (val: any): InternationalCallOption[] =>
    !val
      ? []
      : String(val)
          .split(",")
          .map(
            (v) =>
              ({
                id: v.trim(),
                name: v.trim(),
                fee: 0,
                type: "international",
              } as InternationalCallOption)
          )
          .filter(Boolean);

  // === 🧩 Plan配列生成 ===
  const plans = dataRows.map((row, index): Plan => {
    const plan: Record<string, any> = {};

    // ✅ クリーン化したキーを利用して格納
    header.forEach((key: string, i: number) => {
      plan[key] = row[i] ?? "";
    });

    return {
      // === 基本情報 ===
      planId: plan["planId"] || plan["プランID"] || `plan_${index + 1}`,
      carrier: plan["carrier"] || plan["キャリア"] || "",
      planName: plan["planName"] || plan["プラン名"] || "",
      planType: plan["planType"] || plan["キャリア種別"] || "大手",
      baseMonthlyFee: toNumber(plan["baseMonthlyFee"] || plan["基本料金"]),
      networkQuality: plan["networkQuality"] || plan["通信品質"] || "中",
      requiresAppCall: toBool(plan["requiresAppCall"] || plan["専用アプリ通話"]),
      availableMethod: plan["availableMethod"] || plan["契約方法"] || "both",

      // === 初期費用 ===
      initialFee: toNumber(plan["initialFee"] || plan["初期費用（店頭）"]),
      initialFeeOnline: toNumber(plan["initialFeeOnline"] || plan["初期費用（オンライン）"]),
      esimFee: toNumber(plan["esimFee"] || plan["eSIM発行料"]),

      // === データ通信 ===
      maxDataGB: toNumber(plan["maxDataGB"] || plan["データ容量（GB）"]),
      speedLimitMbps: toNumber(plan["speedLimitMbps"] || plan["速度制限（Mbps）"]),
      tetheringNeeded: toBool(plan["tetheringNeeded"] || plan["テザリング利用可"]),
      tetheringAvailable: toBool(plan["tetheringAvailable"] || plan["テザリング利用可"]),
      tetheringUsage: toNumber(plan["tetheringUsage"] || plan["テザリング利用上限（GB）"]),
      tetheringFee: toNumber(plan["tetheringFee"] || plan["テザリングオプション料"]),

      // === 通話関連 ===
      hasVoicemail: toBool(plan["hasVoicemail"] || plan["留守番電話オプション"]),
      callOption: toBool(plan["callOption"] || plan["かけ放題オプションあり"]),
      callType: plan["callType"] || plan["通話タイプ"] || "time",
      callIncluded: toBool(plan["callIncluded"] || plan["無料通話分含む"]),
      callOptions: toCallOptionArray(plan),
      internationalOptions: toIntlOptionArray(plan["国際通話オプション"]),
      voicemailFee: toNumber(plan["voicemailFee"] || plan["留守電オプション料"]),

      // === 割引・販売系 ===
      simOnlyAvailable: toBool(plan["simOnlyAvailable"] || plan["SIMのみ契約可"]),
      deviceSalesAvailable: toBool(plan["deviceSalesAvailable"] || plan["端末購入可"]),
      supportsReturnProgram: toBool(plan["supportsReturnProgram"] || plan["返却プログラム有"]),

      // === 経済圏 / 支払い ===
      supportedPaymentMethods: toStringArray(
        plan["supportedPaymentMethods"] || plan["対応支払い方法"]
      ),

      // ✅ string → string[] 変換修正済
      includedSubscriptions: toStringArray(
        plan["includedSubscriptions"] || plan["付帯サブスク"]
      ),

      deviceDiscountAmount: toNumber(plan["deviceDiscountAmount"] || plan["端末割引額"]),
      cashbackAmount: toNumber(plan["cashbackAmount"] || plan["キャッシュバック額"]),

      // === 割引系 ===
      setDiscountApplied: toBool(plan["setDiscountApplied"] || plan["セット割対象"]),
      setDiscountAmount: toNumber(plan["setDiscountAmount"] || plan["セット割金額"]),
      applicableCategories: toStringArray(
        plan["applicableCategories"] || plan["カテゴリ"]
      ).map((v) => v as "fiber" | "router" | "pocketWifi"),

      // === エネルギー割引 ===
      energyDiscountRules: [
        { type: "電気" as const, discount: toNumber(plan["電気割引額"] || plan["electricDiscount"]) },
        { type: "ガス" as const, discount: toNumber(plan["ガス割引額"] || plan["gasDiscount"]) },
      ],

      // === 補完 ===
      supportsChildPlan: toBool(plan["supportsChildPlan"] || plan["子どもプラン対応"]),
      overseasSupport: toBool(plan["overseasSupport"] || plan["海外対応"]),
      supportsDualSim: toBool(plan["supportsDualSim"] || plan["デュアルSIM対応"]),
      allowsLocalSimCombination: toBool(plan["allowsLocalSimCombination"] || plan["国内SIM併用可"]),
      supportsGlobalRoaming: toBool(plan["supportsGlobalRoaming"] || plan["海外ローミング可"]),
      supportsRakutenEconomy: toBool(plan["supportsRakutenEconomy"] || plan["楽天経済圏対応"]),
      supportsDEconomy: toBool(plan["supportsDEconomy"] || plan["d経済圏対応"]),
      supportsAuEconomy: toBool(plan["supportsAuEconomy"] || plan["au経済圏対応"]),
      supportsPayPayEconomy: toBool(plan["supportsPayPayEconomy"] || plan["PayPay経済圏対応"]),
      subscriptionDiscountRules: [],
      paymentBenefitRules: [],
    };
  });

  return plans;
}
