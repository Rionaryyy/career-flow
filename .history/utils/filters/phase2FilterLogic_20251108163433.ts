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
      case "data_minimal":
        minRequired = 0;
        break;
      case "data_3gb":
        minRequired = 3;
        break;
      case "data_5gb":
        minRequired = 5;
        break;
      case "data_10gb":
        minRequired = 10;
        break;
      case "data_20gb":
        minRequired = 20;
        break;
      case "data_30gb":
        minRequired = 30;
        break;
      case "data_50gb":
        minRequired = 50;
        break;
      case "data_unlimited":
        isUnlimited = true;
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
  // 🚦 速度制限後の通信速度フィルター（ID対応）
  // ===================================================
  if (phase2.speedLimitImportance) {
    const id = phase2.speedLimitImportance.toString().trim().toLowerCase();
    let minSpeed = 0;

    switch (id) {
      case "speed_high":
        minSpeed = 1;
        break;
      case "speed_medium":
        minSpeed = 0.5;
        break;
      case "speed_low":
      default:
        minSpeed = 0;
        break;
    }

    if (minSpeed > 0) {
      filtered = filtered.filter((plan) => (plan.speedLimitMbps ?? 0) >= minSpeed);
    }
  }

  // ===================================================
  // 🟨 テザリングフィルター（ID対応）
  // ===================================================
  const tetheringNeeded = phase2.tetheringNeeded === "yes";
  const tetheringUsage = phase2.tetheringUsage ?? "";

  if (tetheringNeeded || tetheringUsage) {
    const map = {
      tether_30gb: 30,
      tether_60gb: 60,
      tether_unlimited: 999,
    } as const;
    const minRequired = map[tetheringUsage as keyof typeof map] ?? 0;

    filtered = filtered.filter(
      (plan) =>
        plan.tetheringAvailable === true &&
        (plan.tetheringUsage ?? 0) >= minRequired
    );
  }

  // ===================================================
  // 🟩 国内通話プランフィルター（ID対応）
  // ===================================================
  if (phase2.callPlanType && phase2.callPlanType.length > 0) {
    const selected = phase2.callPlanType ?? [];
    let matches: Plan[] = [];

    // === 1. 時間制限型 ===
    if (selected.includes("call_type_time")) {
      const pref = phase2.timeLimitPreference ?? "";
      const map = {
        call_time_5min: 5,
        call_time_10min: 10,
        call_time_15min: 15,
        call_time_30min: 30,
        call_unlimited: Infinity,
      } as const;
      const limit = map[pref as keyof typeof map] ?? 0;

      matches.push(
        ...filtered.filter(
          (p) =>
            (p.callType === "time" && (p.callTimeLimit ?? 0) >= limit) ||
            p.callType === "unlimited"
        )
      );
    }

    // === 2. 月間制限型 ===
    if (selected.includes("call_type_monthly")) {
      const pref = phase2.monthlyLimitPreference ?? "";
      const map = {
        call_monthly_60: 60,
        call_monthly_70: 70,
        call_monthly_100: 100,
        call_unlimited: Infinity,
      } as const;
      const limit = map[pref as keyof typeof map] ?? 0;

      matches.push(
        ...filtered.filter(
          (p) =>
            (p.callType === "monthly" && (p.callMonthlyLimit ?? 0) >= limit) ||
            p.callType === "unlimited"
        )
      );
    }

    // === 3. ハイブリッド型 ===
    if (selected.includes("call_type_hybrid")) {
      const pref = phase2.hybridCallPreference ?? "";
      const map = {
        call_hybrid_30x10: { count: 30, perCall: 10 },
        call_hybrid_50x10: { count: 50, perCall: 10 },
        call_unlimited: { count: Infinity, perCall: Infinity },
      } as const;

      const { count, perCall } = map[pref as keyof typeof map] ?? { count: 0, perCall: 0 };

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

    // === 4. 無制限型（単体選択 or どれでもOK）
    if (selected.includes("call_unlimited")) {
      matches.push(...filtered.filter((p) => p.callType === "unlimited"));
    }

    // === 重複除外 ===
    filtered = Array.from(new Map(matches.map((p) => [p.planId, p])).values());
  }

  // ===================================================
  // 🌍 国際通話フィルター（ID対応）
  // ===================================================
  if (phase2.needInternationalCallUnlimited === "intl_yes") {
    const selectedCarriers = Array.isArray(phase2.internationalCallCarrier)
      ? phase2.internationalCallCarrier
      : [];

    filtered = filtered.filter((plan) => {
      if (!plan.supportsInternationalUnlimitedCalls) return false;
      if (selectedCarriers.length === 0) return true;

      return selectedCarriers.some((c: string) => {
        switch (c) {
          case "intl_rakuten":
            return plan.carrier?.toLowerCase().includes("rakuten");
          case "intl_au":
            return plan.carrier?.toLowerCase().includes("au");
          default:
            return false;
        }
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

  // ===================================================
  // 🌏 海外利用フィルター
  // ===================================================
  if (phase2.overseasSupport === "yes") {
    filtered = filtered.filter((plan) => plan.overseasSupport === true);
  }

  // ===================================================
  // 💳 支払い方法フィルター
  // ===================================================
  if (phase2.mainCard && Array.isArray(phase2.mainCard) && phase2.mainCard.length > 0) {
    const selectedMethods = phase2.mainCard as string[];
    filtered = filtered.filter((plan) =>
      selectedMethods.some((method: string) => plan.supportedPaymentMethods?.includes(method))
    );
  }

  return filtered;
}
