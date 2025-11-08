import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterByFiberSet } from "./filterByInternetSet";
import { fiberDiscountPlans as setDiscountPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { devicePricesLease } from "../../data/devicePricesLease";
import { devicePricesBuy } from "../../data/devicePricesBuy";

export function filterPlansByPhase2(answers: DiagnosisAnswers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

// === 🟦 データ通信容量フィルター（英数字・日本語両対応） ===
if (answers.dataUsage) {
  const usage = answers.dataUsage?.toString().toLowerCase().trim() ?? "";
  let minRequired = 0;
  let isUnlimited = false;

  // 🧠 「無制限」や「unlimited」
  if (usage.includes("無制限") || usage.includes("unlimited")) {
    isUnlimited = true;
  } else if (usage.match(/50\s*gb/)) {
    minRequired = 50;
  } else if (usage.match(/30\s*gb/)) {
    minRequired = 30;
  } else if (usage.match(/20\s*gb/)) {
    minRequired = 20;
  } else if (usage.match(/10\s*gb/)) {
    minRequired = 10;
  } else if (usage.match(/5\s*gb/)) {
    minRequired = 5;
  } else if (usage.match(/3\s*gb/)) {
    minRequired = 3;
  }

  if (isUnlimited) {
    filtered = filtered.filter(
      (plan) =>
        plan.dataLimitType === "unlimited" ||
        plan.maxDataGB >= 999 ||
        plan.maxDataGB === Infinity
    );
  } else {
    filtered = filtered.filter((plan) => plan.maxDataGB >= minRequired);
  }

  console.log("📶 データ容量フィルター:", {
    usage,
    minRequired,
    isUnlimited,
    resultCount: filtered.length,
    matchedCarriers: filtered.map((p) => p.carrier),
  });
}



  // ===================================================
  // 🚦 速度制限後の通信速度フィルター（IDベース対応）
  // ===================================================
  if (answers.speedLimitImportance) {
    const map = { high: 1, medium: 0.5, low: 0 } as const;
    const importance = answers.speedLimitImportance as keyof typeof map;
    const minSpeed = map[importance] ?? 0;

    if (minSpeed > 0) {
      filtered = filtered.filter((plan) => (plan.speedLimitMbps ?? 0) >= minSpeed);
      console.log("🚦速度制限フィルター:", {
        importance,
        minSpeed,
        resultCount: filtered.length,
        matched: filtered.map((p) => ({
          carrier: p.carrier,
          speedLimitMbps: p.speedLimitMbps,
        })),
      });
    } else {
      console.log("🚦速度制限フィルター: 格安SIM水準（low）→ フィルタスキップ");
    }
  }

  // ===================================================
  // 🟨 テザリングフィルター（IDベース対応）
  // ===================================================
  const tetheringNeeded = answers.tetheringNeeded === "yes";
  const tetheringUsage = answers.tetheringUsage ?? "";

  if (tetheringNeeded || tetheringUsage) {
    const map = { "30gb": 30, "60gb": 60, unlimited: 999 } as const;
    const minRequired = map[tetheringUsage as keyof typeof map] ?? 0;

    filtered = filtered.filter(
      (plan) =>
        plan.tetheringAvailable === true &&
        (plan.tetheringUsage ?? 0) >= minRequired
    );

    console.log("🟨 テザリングフィルター:", {
      tetheringNeeded,
      tetheringUsage,
      minRequired,
      resultCount: filtered.length,
      matched: filtered.map((p) => ({
        carrier: p.carrier,
        tetheringUsage: p.tetheringUsage,
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

    filtered = Array.from(new Map(matches.map((p) => [p.planId, p])).values());
  }

  // 🌍 国際通話（海外通話）フィルター ← 🟢 修正位置：ここに移動
  if (answers.needInternationalCallUnlimited === "はい") {
    const selectedCarriers = Array.isArray(answers.internationalCallCarrier)
      ? answers.internationalCallCarrier
      : [];

    filtered = filtered.filter((plan) => {
      if (!plan.supportsInternationalUnlimitedCalls) return false;

      if (selectedCarriers.length === 0) return true;

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

    console.log("🌐 国際通話フィルター適用:", {
      resultCount: filtered.length,
      matched: filtered.map(p => p.carrier)
    });
  }

  // === 📱 端末モデル＋容量の一致チェック ===
  if (answers.deviceModel && answers.deviceStorage) {
    const selectedModel = answers.deviceModel.trim();
    const selectedStorage = answers.deviceStorage.trim();
    const buyingText = answers.buyingDevice ?? "";

    if (typeof buyingText === "string" && buyingText.includes("正規店")) {
      console.log("🧩 device filter skipped for 正規店購入 (全キャリア対象)");
    } else {
      filtered = filtered.filter(plan => {
        const match = devicePricesLease.some(
          d =>
            d.model === selectedModel &&
            d.storage === selectedStorage &&
            d.carrier === plan.carrier &&
            d.ownershipType === "lease"
        );
        return match;
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

    if (isFiber) {
      matchedFiberPlans = filterByFiberSet(answers, setDiscountPlans, plans[0]?.planId);
      console.log("🟩 光回線フィルター結果:", matchedFiberPlans);
    }

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

    const normalizeCarrier = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("docomo") || name.includes("ドコモ")) return "docomo";
      if (lower.includes("softbank") || name.includes("ソフトバンク")) return "softbank";
      if (lower.includes("rakuten") || name.includes("楽天")) return "rakuten";
      if (lower.includes("au")) return "au";
      return lower;
    };

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
