import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterByFiberSet } from "./filterByInternetSet";
import { fiberDiscountPlans as setDiscountPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { devicePricesLease } from "../../data/devicePricesLease";
import { devicePricesBuy } from "../../data/devicePricesBuy";

export function filterPlansByPhase2(plans: Plan[], answers: DiagnosisAnswers): Plan[] {
  let filtered = [...plans];
  const phase2 = answers.phase2 ?? answers; // ✅ Phase統合対応

  // === 🟦 データ通信容量フィルター（ID形式対応） ===
  if (phase2.dataUsage) {
    const usage = phase2.dataUsage?.toString().toLowerCase().trim() ?? "";
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
        minRequired = 0;
        break;
    }

    if (isUnlimited) {
      filtered = filtered.filter(
        (plan) => plan.maxDataGB >= 999 || plan.maxDataGB === Infinity
      );
    } else {
      filtered = filtered.filter((plan) => plan.maxDataGB >= minRequired);
    }
  }

  // ===================================================
  // 🚦 速度制限後の通信速度フィルター
  // ===================================================
  if (phase2.speedLimitImportance) {
    const map = { high: 1, medium: 0.5, low: 0 } as const;
    const importance = phase2.speedLimitImportance as keyof typeof map;
    const minSpeed = map[importance] ?? 0;

    if (minSpeed > 0) {
      filtered = filtered.filter((plan) => (plan.speedLimitMbps ?? 0) >= minSpeed);
    }
  }

  // ===================================================
  // 🟨 テザリングフィルター
  // ===================================================
  const tetheringNeeded = phase2.tetheringNeeded === "yes";
  const tetheringUsage = phase2.tetheringUsage ?? "";

  if (tetheringNeeded || tetheringUsage) {
    const map = { "30gb": 30, "60gb": 60, unlimited: 999 } as const;
    const minRequired = map[tetheringUsage as keyof typeof map] ?? 0;

    filtered = filtered.filter(
      (plan) =>
        plan.tetheringAvailable === true &&
        (plan.tetheringUsage ?? 0) >= minRequired
    );
  }

  // 🟩 国内通話プランフィルター
  if (phase2.callPlanType && phase2.callPlanType.length > 0) {
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

    const selectedTypes = phase2.callPlanType ?? [];
    let matches: Plan[] = [];

    // 時間制限型
    if (selectedTypes.some((t: string) => t.includes("1回あたり"))) {
      const pref = phase2.timeLimitPreference ?? "";
      const limitKey = (Object.keys(timeLimitMap) as (keyof typeof timeLimitMap)[]).find((k) =>
        pref.includes(k)
      );
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
    if (selectedTypes.some((t: string) => t.includes("合計通話時間"))) {
      const pref = phase2.monthlyLimitPreference ?? "";
      const limitKey = (Object.keys(monthlyLimitMap) as (keyof typeof monthlyLimitMap)[]).find((k) =>
        pref.includes(k)
      );
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
    if (selectedTypes.some((t: string) => /(ハイブリッド|回数)/.test(t))) {
      const pref = phase2.hybridCallPreference ?? "";
      const limitKey = (Object.keys(hybridLimitMap) as (keyof typeof hybridLimitMap)[]).find((k) =>
        pref.includes(k)
      );
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
    if (selectedTypes.some((t: string) => /(無制限|かけ放題)/.test(t))) {
      matches.push(...filtered.filter((p) => p.callType === "unlimited"));
    }

    filtered = Array.from(new Map(matches.map((p) => [p.planId, p])).values());
  }

  // 🌍 国際通話フィルター
  if (phase2.needInternationalCallUnlimited === "はい") {
    const selectedCarriers = Array.isArray(phase2.internationalCallCarrier)
      ? phase2.internationalCallCarrier
      : [];

    filtered = filtered.filter((plan) => {
      if (!plan.supportsInternationalUnlimitedCalls) return false;
      if (selectedCarriers.length === 0) return true;

      return selectedCarriers.some((c: string) => {
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

  // === 📱 端末モデル＋容量の一致チェック ===
  if (phase2.deviceModel && phase2.deviceStorage) {
    const selectedModel = phase2.deviceModel.trim();
    const selectedStorage = phase2.deviceStorage.trim();
    const buyingText = phase2.buyingDevice ?? "";

    if (typeof buyingText !== "string" || !buyingText.includes("正規店")) {
      filtered = filtered.filter((plan) => {
        const match = devicePricesLease.some(
          (d) =>
            d.model === selectedModel &&
            d.storage === selectedStorage &&
            d.carrier === plan.carrier &&
            d.ownershipType === "lease"
        );
        return match;
      });
    }
  }

  // ⑤ 海外利用フィルター
  if (phase2.overseasSupport === "はい") {
    filtered = filtered.filter((plan) => plan.overseasSupport === true);
  }

  // ⑥ 支払い方法フィルター
  if (phase2.mainCard && Array.isArray(phase2.mainCard) && phase2.mainCard.length > 0) {
    const selectedMethods = phase2.mainCard as string[];
    filtered = filtered.filter((plan) =>
      selectedMethods.some((method: string) => plan.supportedPaymentMethods?.includes(method))
    );
  }

  return filtered;
}
