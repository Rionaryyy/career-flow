import { Phase2Answers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterByFiberSet } from "./filterByInternetSet";
import { fiberDiscountPlans as setDiscountPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { devicePricesLease } from "@/data/devicePricesLease";
import { devicePricesBuy } from "@/data/devicePricesBuy";



export function filterPlansByPhase2(answers: Phase2Answers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

  // 🟦 ① データ通信容量フィルター（確認済み ✅）
  if (answers.dataUsage) {
    const usage = answers.dataUsage ?? "";
    let minRequired = 0;

    switch (true) {
      case usage.includes("〜3GB"):
        minRequired = 3;
        break;
      case usage.includes("〜5GB"):
        minRequired = 5;
        break;
      case usage.includes("〜10GB"):
        minRequired = 10;
        break;
      case usage.includes("〜20GB"):
        minRequired = 20;
        break;
      case usage.includes("〜30GB"):
        minRequired = 30;
        break;
      case usage.includes("〜50GB"):
        minRequired = 50;
        break;
      case usage.includes("無制限"):
        minRequired = Infinity;
        break;
      default:
        minRequired = 0;
        break;
    }

    filtered = filtered.filter(plan => plan.maxDataGB >= minRequired);
  }

  // 🟨 ①.5 テザリングフィルター
  const tetheringNeeded =
    typeof answers.tetheringNeeded === "boolean" ? answers.tetheringNeeded : false;
  const tetheringUsage =
    typeof answers.tetheringUsage === "string" ? answers.tetheringUsage.trim() : "";

  if (tetheringNeeded || tetheringUsage !== "") {
    let minRequired = 0;

    switch (true) {
      case tetheringUsage.includes("〜30GB"):
        minRequired = 30;
        break;
      case tetheringUsage.includes("〜60GB"):
        minRequired = 60;
        break;
      case tetheringUsage.includes("無制限"):
        minRequired = 999;
        break;
      default:
        minRequired = 0;
        break;
    }

    filtered = filtered.filter(
      (plan) =>
        plan.tetheringAvailable === true &&
        (plan.tetheringUsage ?? 0) >= minRequired
    );

    console.log("🟨 テザリングフィルター適用:", {
      minRequired,
      resultCount: filtered.length,
      filteredPlans: filtered.map((p) => ({
        carrier: p.carrier,
        usage: p.tetheringUsage,
      })),
    });
  }

  // 🟩🟩 ③ 国内通話プランフィルター
  if (answers.callPlanType && answers.callPlanType.length > 0) {
    const timeLimitMap = {
      "5分以内": 5,
      "10分以内": 10,
      "15分以内": 15,
      "30分以内": 30,
      "無制限": Infinity,
    } as const;

    const monthlyLimitMap = {
      "月60分まで無料": 60,
      "月70分まで無料": 70,
      "月100分まで無料": 100,
      "無制限（完全定額）": Infinity,
    } as const;

    const hybridLimitMap = {
      "月30回まで各10分無料": { count: 30, perCall: 10 },
      "月50回まで各10分無料": { count: 50, perCall: 10 },
      "無制限（回数制限なし）": { count: Infinity, perCall: Infinity },
    } as const;

    const selectedTypes = answers.callPlanType ?? [];
    let matches: Plan[] = [];

    // 時間制限型
    if (selectedTypes.some((t) => t.includes("1回あたり"))) {
      const pref = answers.timeLimitPreference ?? "";
      const limitKey = (Object.keys(timeLimitMap) as (keyof typeof timeLimitMap)[])
        .find((k) => pref.includes(k));
      const limit = limitKey ? timeLimitMap[limitKey] : 0;

      matches.push(
        ...filtered.filter(
          (p) =>
            (p.callType === "time" && (p.callTimeLimit ?? 0) >= limit) ||
            p.callType === "unlimited"
        )
      );
    }

    // 月間制限型
    if (selectedTypes.some((t) => t.includes("合計通話時間"))) {
      const pref = answers.monthlyLimitPreference ?? "";
      const limitKey = (Object.keys(monthlyLimitMap) as (keyof typeof monthlyLimitMap)[])
        .find((k) => pref.includes(k));
      const limit = limitKey ? monthlyLimitMap[limitKey] : 0;

      matches.push(
        ...filtered.filter(
          (p) =>
            (p.callType === "monthly" && (p.callMonthlyLimit ?? 0) >= limit) ||
            p.callType === "unlimited"
        )
      );
    }

    // ハイブリッド型
    if (selectedTypes.some((t) => /(ハイブリッド|回数)/.test(t))) {
      const pref = answers.hybridCallPreference ?? "";
      const limitKey = (Object.keys(hybridLimitMap) as (keyof typeof hybridLimitMap)[])
        .find((k) => pref.includes(k));
      const { count, perCall } = limitKey ? hybridLimitMap[limitKey] : { count: 0, perCall: 0 };

      matches.push(
        ...filtered.filter(
          (p) =>
            (p.callType === "hybrid" &&
              (p.callCountLimit ?? 0) >= count &&
              (p.callPerCallLimit ?? 0) >= perCall) ||
            p.callType === "unlimited"
        )
      );
    }

    // 無制限型
    if (selectedTypes.some((t) => /(無制限|かけ放題)/.test(t))) {
      matches.push(...filtered.filter((p) => p.callType === "unlimited"));
    }

    // 海外通話フィルター
    if (answers.needInternationalCallUnlimited === "はい") {
      const selectedCarriers = Array.isArray(answers.internationalCallCarrier)
        ? answers.internationalCallCarrier
        : [];
      matches = matches.filter((plan) => {
        if (selectedCarriers.length === 0)
          return plan.supportsInternationalUnlimitedCalls === true;

        return selectedCarriers.some((c) => {
          const lower = c.toLowerCase();
          return (
            (lower.includes("楽天") && plan.carrier?.toLowerCase().includes("rakuten")) ||
            (lower.includes("au") && plan.carrier?.toLowerCase().includes("au")) ||
            (lower.includes("softbank") && plan.carrier?.toLowerCase().includes("softbank")) ||
            (lower.includes("docomo") && plan.carrier?.toLowerCase().includes("docomo"))
          );
        });
      });
    }

    filtered = Array.from(new Map(matches.map((p) => [p.planId, p])).values());
  }

// === 📱 端末モデル＋容量の一致チェック ===
if (answers.deviceModel && answers.deviceStorage) {
  const selectedModel = answers.deviceModel.trim();
  const selectedStorage = answers.deviceStorage.trim();
  const buyingText = answers.buyingDevice ?? "";

  // 🩵 正規店購入の場合はフィルターをスキップ（全キャリア残す）
  if (typeof buyingText === "string" && buyingText.includes("正規店")) {
    console.log("🧩 device filter skipped for 正規店購入 (全キャリア対象)");
  } else {
    // 🟥 通常の返却プログラム or キャリア購入時のみ lease で絞り込み
    filtered = filtered.filter(plan => {
      const match = devicePrices.some(
        d =>
          d.model === selectedModel &&
          d.storage === selectedStorage &&
          d.carrier === plan.carrier &&
          d.ownershipType === "lease"
      );
      return match; // lease 一致キャリアのみ残す
    });

    console.log("🧩 device filter applied:", {
      model: selectedModel,
      storage: selectedStorage,
      resultCount: filtered.length,
      matchedCarriers: filtered.map(p => p.carrier),
    });
  }
}



  // ⑤ 海外利用フィルター
  if (answers.overseasSupport === "はい") {
    filtered = filtered.filter(plan => plan.overseasSupport === true);
  }

  // ⑥ 支払い方法フィルター
  if (answers.mainCard && Array.isArray(answers.mainCard) && answers.mainCard.length > 0) {
    const selectedMethods = answers.mainCard as string[];
    filtered = filtered.filter(plan =>
      selectedMethods.some((method: string) =>
        plan.supportedPaymentMethods?.includes(method)
      )
    );
  }

  // 🟧 ⑦ セット割フィルター（光・ルーター・ポケットWi-Fi）
  if (typeof answers.setDiscount === "string") {
    const isFiber = answers.setDiscount.includes("光回線の契約");
    const isRouter = answers.setDiscount.includes("ルーター購入・レンタル");
    const isPocket = answers.setDiscount.includes("ポケットWi-Fi契約");

    let matchedFiberPlans: any[] = [];
    let matchedRouterPlans: any[] = [];
    let matchedPocketPlans: any[] = [];

    // 光回線
    if (isFiber) {
      matchedFiberPlans = filterByFiberSet(answers, setDiscountPlans, plans[0]?.planId);
      console.log("🟩 光回線フィルター結果:", matchedFiberPlans);
    }

    // ルーター
    if (isRouter) {
      try {
        const { filterByRouterSet } = require("./filterByRouterSet");
        const { routerDiscountPlans } = require("../../data/setDiscounts/routerDiscountPlans");
        matchedRouterPlans = filterByRouterSet(answers, routerDiscountPlans, plans[0]?.planId);
        console.log("📶 ルーターフィルター結果:", matchedRouterPlans);
      } catch {
        console.warn("⚠️ ルーターフィルター未定義。routerDiscountPlansが存在しません。");
      }
    }

    // ポケットWi-Fi
    if (isPocket) {
      try {
        const { filterByPocketWifiSet } = require("./filterByPocketWifiSet");
        const { pocketWifiDiscountPlans } = require("../../data/setDiscounts/pocketWifiDiscountPlans");
        matchedPocketPlans = filterByPocketWifiSet(answers, pocketWifiDiscountPlans, plans[0]?.planId);
        console.log("📡 ポケットWi-Fiフィルター結果:", matchedPocketPlans);
      } catch {
        console.warn("⚠️ ポケットWi-Fiフィルター未定義。pocketWifiDiscountPlansが存在しません。");
      }
    }

    // キャリア表記ゆれ補正
    const normalizeCarrier = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("docomo") || name.includes("ドコモ")) return "docomo";
      if (lower.includes("softbank") || name.includes("ソフトバンク")) return "softbank";
      if (lower.includes("rakuten") || name.includes("楽天")) return "rakuten";
      if (lower.includes("au")) return "au";
      return lower;
    };

    // 割引合算
    filtered = filtered.map((plan) => {
      const planCarrier = normalizeCarrier(plan.carrier);

      const fiberMatch = matchedFiberPlans.find(
        (p) => normalizeCarrier(p.carrier) === planCarrier
      );
      const routerMatch = matchedRouterPlans.find(
        (p) => normalizeCarrier(p.carrier) === planCarrier
      );
      const pocketMatch = matchedPocketPlans.find(
        (p) => normalizeCarrier(p.carrier) === planCarrier
      );

      const fiberDiscount = fiberMatch?.setDiscountAmount ?? 0;
      const routerDiscount = routerMatch?.setDiscountAmount ?? 0;
      const pocketDiscount = pocketMatch?.setDiscountAmount ?? 0;
      const totalDiscount = fiberDiscount + routerDiscount + pocketDiscount;

      if (totalDiscount > 0) {
        return {
          ...plan,
          setDiscountApplied: true,
          setDiscountAmount: totalDiscount,
          baseMonthlyFee: plan.baseMonthlyFee - totalDiscount,
        };
      }

      return {
        ...plan,
        setDiscountApplied: false,
        setDiscountAmount: 0,
      };
    });

    const discountCount = filtered.filter((p) => p.setDiscountApplied).length;
    console.log(
      `🟩 セット割適用: ${discountCount} 件（光:${isFiber ? "✓" : "×"} / ルーター:${isRouter ? "✓" : "×"} / ポケットWi-Fi:${isPocket ? "✓" : "×"}）`
    );
  }

  return filtered;
}
