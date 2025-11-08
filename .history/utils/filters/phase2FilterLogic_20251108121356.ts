import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterByFiberSet } from "./filterByInternetSet";
import { fiberDiscountPlans as setDiscountPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { devicePricesLease } from "../../data/devicePricesLease";
import { devicePricesBuy } from "../../data/devicePricesBuy";

export function filterPlansByPhase2(answers: DiagnosisAnswers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

  // 🟦 データ通信容量フィルター（value対応）
  if (answers.dataUsage) {
    const usage = answers.dataUsage;
    let minRequired = 0;
    let isUnlimited = false;

    switch (usage) {
      case "minimal":
        minRequired = 0;
        break;
      case "3gb":
        minRequired = 3;
        break;
      case "5gb":
        minRequired = 5;
        break;
      case "10gb":
        minRequired = 10;
        break;
      case "20gb":
        minRequired = 20;
        break;
      case "30gb":
        minRequired = 30;
        break;
      case "50gb":
        minRequired = 50;
        break;
      case "unlimited":
        isUnlimited = true;
        break;
      default:
        break;
    }

    if (isUnlimited) {
      filtered = filtered.filter((plan) => plan.maxDataGB >= 999 || plan.maxDataGB === Infinity);
    } else {
      filtered = filtered.filter((plan) => plan.maxDataGB >= minRequired);
    }
  }

  // 🟩 速度制限後の通信速度
  if (answers.speedLimitImportance) {
    const importance = answers.speedLimitImportance;
    let minSpeed = 0;

    switch (importance) {
      case "high":
        minSpeed = 1;
        break;
      case "medium":
        minSpeed = 0.5;
        break;
      case "low":
      default:
        minSpeed = 0;
        break;
    }

    if (minSpeed > 0) {
      filtered = filtered.filter((plan) => (plan.speedLimitMbps ?? 0) >= minSpeed);
    }
  }

  // 🟨 テザリングフィルター
  if (answers.tetheringNeeded === "yes" || answers.tetheringUsage) {
    let minRequired = 0;

    switch (answers.tetheringUsage) {
      case "30gb":
        minRequired = 30;
        break;
      case "60gb":
        minRequired = 60;
        break;
      case "unlimited":
        minRequired = 999;
        break;
      default:
        break;
    }

    filtered = filtered.filter(
      (plan) =>
        plan.tetheringAvailable === true && (plan.tetheringUsage ?? 0) >= minRequired
    );
  }

  // 🟪 通話プラン（value対応に差し替え）
  if (answers.callPlanType && answers.callPlanType.length > 0) {
    const selectedTypes = answers.callPlanType ?? [];
    let matches: Plan[] = [];

    // 時間制限型
    if (selectedTypes.includes("timeLimit")) {
      const pref = answers.timeLimitPreference ?? "";
      const timeLimitMap = { "5min": 5, "10min": 10, "15min": 15, "30min": 30, "unlimited": Infinity };
      const limit = timeLimitMap[pref as keyof typeof timeLimitMap] ?? 0;

      matches.push(
        ...filtered.filter(
          (p) =>
            (p.callType === "time" && (p.callTimeLimit ?? 0) >= limit) ||
            p.callType === "unlimited"
        )
      );
    }

    // 月間制限型
    if (selectedTypes.includes("monthlyLimit")) {
      const pref = answers.monthlyLimitPreference ?? "";
      const monthlyLimitMap = { "60min": 60, "70min": 70, "100min": 100, "unlimited": Infinity };
      const limit = monthlyLimitMap[pref as keyof typeof monthlyLimitMap] ?? 0;

      matches.push(
        ...filtered.filter(
          (p) =>
            (p.callType === "monthly" && (p.callMonthlyLimit ?? 0) >= limit) ||
            p.callType === "unlimited"
        )
      );
    }

    // ハイブリッド型
    if (selectedTypes.includes("hybrid")) {
      const pref = answers.hybridCallPreference ?? "";
      const hybridLimitMap = {
        "30x10": { count: 30, perCall: 10 },
        "50x10": { count: 50, perCall: 10 },
        "unlimited": { count: Infinity, perCall: Infinity },
      };
      const limit = hybridLimitMap[pref as keyof typeof hybridLimitMap] ?? { count: 0, perCall: 0 };

      matches.push(
        ...filtered.filter(
          (p) =>
            (p.callType === "hybrid" &&
              (p.callCountLimit ?? 0) >= limit.count &&
              (p.callPerCallLimit ?? 0) >= limit.perCall) ||
            p.callType === "unlimited"
        )
      );
    }

    // 無制限型
    if (selectedTypes.includes("noPreference")) {
      matches.push(...filtered.filter((p) => p.callType === "unlimited"));
    }

    filtered = Array.from(new Map(matches.map((p) => [p.planId, p])).values());
  }

  // 🌍 国際通話かけ放題
  if (answers.needInternationalCallUnlimited === "yes") {
    const selectedCarriers = Array.isArray(answers.internationalCallCarrier)
      ? answers.internationalCallCarrier
      : [];

    filtered = filtered.filter((plan) => {
      if (!plan.supportsInternationalUnlimitedCalls) return false;
      if (selectedCarriers.length === 0) return true;
      return selectedCarriers.some((c) => plan.carrier.toLowerCase().includes(c));
    });
  }

  // 📱 端末モデル＋容量
  if (answers.deviceModel && answers.deviceStorage) {
    const selectedModel = answers.deviceModel;
    const selectedStorage = answers.deviceStorage;

    filtered = filtered.filter((plan) =>
      devicePricesLease.some(
        (d) =>
          d.model === selectedModel &&
          d.storage === selectedStorage &&
          d.carrier === plan.carrier &&
          d.ownershipType === "lease"
      )
    );
  }

  // 🌏 海外利用
  if (answers.overseasSupport === "yes") {
    filtered = filtered.filter((plan) => plan.overseasSupport === true);
  }

  // 💳 支払い方法
  if (answers.mainCard && Array.isArray(answers.mainCard)) {
    const selectedMethods = answers.mainCard;
    filtered = filtered.filter((plan) =>
      selectedMethods.some((method) =>
        plan.supportedPaymentMethods?.includes(method)
      )
    );
  }

  // 🟧 セット割（setDiscount: fiber / router / pocketwifi）
  if (Array.isArray(answers.setDiscount) && answers.setDiscount.length > 0) {
    const isFiber = answers.setDiscount.includes("fiber");
    const isRouter = answers.setDiscount.includes("router");
    const isPocket = answers.setDiscount.includes("pocketwifi");

    let matchedFiberPlans: any[] = [];
    let matchedRouterPlans: any[] = [];
    let matchedPocketPlans: any[] = [];

    if (isFiber) {
      matchedFiberPlans = filterByFiberSet(answers, setDiscountPlans, plans[0]?.planId);
    }

    if (isRouter) {
      try {
        const { filterByRouterSet } = require("./filterByRouterSet");
        const { routerDiscountPlans } = require("../../data/setDiscounts/routerDiscountPlans");
        matchedRouterPlans = filterByRouterSet(answers, routerDiscountPlans, plans[0]?.planId);
      } catch {}
    }

    if (isPocket) {
      try {
        const { filterByPocketWifiSet } = require("./filterByPocketWifiSet");
        const { pocketWifiDiscountPlans } = require("../../data/setDiscounts/pocketWifiDiscountPlans");
        matchedPocketPlans = filterByPocketWifiSet(answers, pocketWifiDiscountPlans, plans[0]?.planId);
      } catch {}
    }

    const normalizeCarrier = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes("docomo")) return "docomo";
      if (lower.includes("softbank")) return "softbank";
      if (lower.includes("rakuten")) return "rakuten";
      if (lower.includes("au")) return "au";
      return lower;
    };

    filtered = filtered.map((plan) => {
      const planCarrier = normalizeCarrier(plan.carrier);
      const fiberMatch = matchedFiberPlans.find((p) => normalizeCarrier(p.carrier) === planCarrier);
      const routerMatch = matchedRouterPlans.find((p) => normalizeCarrier(p.carrier) === planCarrier);
      const pocketMatch = matchedPocketPlans.find((p) => normalizeCarrier(p.carrier) === planCarrier);

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

      return { ...plan, setDiscountApplied: false, setDiscountAmount: 0 };
    });
  }

  return filtered;
}
