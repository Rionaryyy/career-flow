import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { devicePricesLease } from "../../data/devicePricesLease";
import { devicePricesBuy } from "../../data/devicePricesBuy";

import { allPlans } from "@/data/plans";
console.log(
  "🧩 Using plans sample (deep):",
  allPlans[0]?.callOptions?.map((o) => ({
    id: o.id,
    name: o.name,
    fee: o.fee,
    type: o.type,
  }))
);



export function filterPlansByPhase2(plans: Plan[], answers: DiagnosisAnswers): Plan[] {
  let filtered = [...plans];
  const phase2 = answers.phase2 ?? answers;

  // === 🟦 データ通信容量フィルター ===
  if (phase2.dataUsage) {
    const usage = phase2.dataUsage.toLowerCase().trim();
    const map: Record<string, number> = {
      minimal: 0,
      "3gb": 3,
      "5gb": 5,
      "10gb": 10,
      "20gb": 20,
      "30gb": 30,
      "50gb": 50,
    };
    const minRequired = map[usage] ?? 0;
    const isUnlimited = usage === "unlimited";

    filtered = isUnlimited
      ? filtered.filter((p) => p.maxDataGB >= 999 || p.maxDataGB === Infinity)
      : filtered.filter((p) => p.maxDataGB >= minRequired);
  }

  // 🚦 速度制限フィルター
  if (phase2.speedLimitImportance) {
    const map = { high: 1, medium: 0.5, low: 0 };
    const minSpeed = map[phase2.speedLimitImportance as keyof typeof map] ?? 0;
    if (minSpeed > 0) {
      filtered = filtered.filter((p) => (p.speedLimitMbps ?? 0) >= minSpeed);
    }
  }

// 🟨 テザリングフィルター
const tetheringNeeded = phase2.tetheringNeeded;
const tetheringUsage = phase2.tetheringUsage ?? "";

// ✅ 「いいえ」または null の場合はフィルターをスキップ
if (tetheringNeeded === "はい" || tetheringNeeded === "yes") {
  if (tetheringUsage) {
    const map = { "30gb": 30, "60gb": 60, unlimited: 999 };
    const minRequired = map[tetheringUsage as keyof typeof map] ?? 0;

    filtered = filtered.filter(
      (p) =>
        p.tetheringAvailable === true &&
        (p.tetheringUsage ?? 0) >= minRequired
    );
  } else {
    // 「はい」だけど容量未回答の場合 → テザリング対応プランのみ残す
    filtered = filtered.filter((p) => p.tetheringAvailable === true);
  }
}


// ===================================================
// 📞 国内通話プランフィルター（UI質問準拠・上位互換＋無制限対応・最終安定版）
// ===================================================
if (phase2.callPlanType && phase2.callPlanType.length > 0) {
  const selectedTypes = phase2.callPlanType;
  let matches: Plan[] = [];

  console.log("📞 [CallPlanType] 選択:", selectedTypes);
  console.log("🧩 [phase2 Snapshot]:", {
    callPlanType: phase2.callPlanType,
    timeLimitPreference: phase2.timeLimitPreference,
    monthlyLimitPreference: phase2.monthlyLimitPreference,
    hybridCallPreference: phase2.hybridCallPreference,
  });

  const beforeCount = filtered.length;

  // === 汎用ヘルパー: 無制限判定 ===
  const hasUnlimited = (p: Plan): boolean => {
    const inCallOptions = p.callOptions?.some(
      (opt) =>
        opt.type === "unlimited" ||
        opt.id === "unlimited" ||
        String(opt.name)?.includes("無制限")
    );
    const inAvailableList = Array.isArray(p.availableCallOptions)
      ? p.availableCallOptions.includes("unlimited")
      : false;
    return Boolean(inCallOptions || inAvailableList);
  };

  // === 1️⃣ 時間制限型 ===
  if (selectedTypes.includes("timeLimit")) {
    const pref = phase2.timeLimitPreference ?? "";
    if (!pref) {
      console.log("⏸️ [TimeLimit] まだ詳細未選択のためスキップ");
    } else {
      const map: Record<string, number> = {
        "5min": 5,
        "10min": 10,
        "15min": 15,
        "30min": 30,
        unlimited: Infinity,
      };
      const limit = map[pref] ?? 0;
      console.log(`⏱️ [TimeLimit] 指定: ${pref} (${limit}分)`);

      const newMatches = filtered.filter((p) => {
        const hasUnlimitedOption = hasUnlimited(p);
        const timeLimits = p.callOptions
          ?.filter((opt) => opt.type === "time")
          .map((opt) => map[opt.id] ?? 0) ?? [];

        const hasHigherTier = timeLimits.some((v) => v >= limit);
        return hasUnlimitedOption || hasHigherTier;
      });

      matches.push(...newMatches);
      console.log(`📉 時間制限型フィルター: ${filtered.length} → ${matches.length} 件`);
    }
  }

  // === 2️⃣ 月間制限型 ===
  if (selectedTypes.includes("monthlyLimit")) {
    const pref = phase2.monthlyLimitPreference ?? "";
    if (!pref) {
      console.log("⏸️ [MonthlyLimit] まだ詳細未選択のためスキップ");
    } else {
      const map: Record<string, number> = {
        "monthly30min": 30,
        "monthly60min": 60,
        "monthly70min": 70,
        "monthly100min": 100,
        unlimited: Infinity,
      };
      const limit = map[pref] ?? 0;
      console.log(`📆 [MonthlyLimit] 指定: ${pref} (${limit}分/月)`);

      const newMatches = filtered.filter((p) => {
        const hasUnlimitedOption = hasUnlimited(p);
        const monthlyLimits = p.callOptions
          ?.filter((opt) => opt.type === "monthly")
          .map((opt) => map[opt.id] ?? 0) ?? [];

        const hasHigherTier = monthlyLimits.some((v) => v >= limit);
        return hasUnlimitedOption || hasHigherTier;
      });

      matches.push(...newMatches);
      console.log(`📉 月間制限型フィルター: ${filtered.length} → ${matches.length} 件`);
    }
  }

  // === 3️⃣ ハイブリッド型 ===
  if (selectedTypes.includes("hybrid")) {
    const pref = phase2.hybridCallPreference ?? "";
    if (!pref) {
      console.log("⏸️ [Hybrid] まだ詳細未選択のためスキップ");
    } else {
      const map = {
        "30x10min": { count: 30, perCall: 10 },
        "50x10min": { count: 50, perCall: 10 },
        unlimited: { count: Infinity, perCall: Infinity },
      };
      const { count, perCall } = map[pref as keyof typeof map] ?? { count: 0, perCall: 0 };
      console.log(`🔄 [Hybrid] 指定: ${pref} (${count}回 × ${perCall}分)`);

      const newMatches = filtered.filter((p) => {
        const hasUnlimitedOption = hasUnlimited(p);
        const hybridOptions = p.callOptions?.filter((opt) => opt.type === "hybrid") ?? [];

        const hasHigherTier = hybridOptions.some((opt) => {
          const def = map[opt.id as keyof typeof map] ?? { count: 0, perCall: 0 };
          return def.count >= count && def.perCall >= perCall;
        });

        return hasUnlimitedOption || hasHigherTier;
      });

      matches.push(...newMatches);
      console.log(`📉 ハイブリッド型フィルター: ${filtered.length} → ${matches.length} 件`);
    }
  }

  // === 4️⃣ 無制限型（特例） ===
  if (selectedTypes.includes("unlimited") || selectedTypes.includes("noPreference")) {
    console.log("💬 [Unlimited] 無制限型フィルター発動");
    const before = matches.length || filtered.length;
    const newMatches = filtered.filter(hasUnlimited);
    matches.push(...newMatches);
    console.log(`💬 無制限型フィルター: ${before} → ${matches.length} 件`);
  }

  // === 5️⃣ 重複除去 & 最終反映 ===
  const unique = Array.from(new Map(matches.map((p) => [p.planId, p])).values());
  const afterCount = unique.length;

  console.log(`✅ 通話フィルター完了: ${beforeCount} → ${afterCount} 件（重複除外後）`);
  filtered = unique;
}


  // 🌍 国際通話フィルター
  if (phase2.needInternationalCallUnlimited === "yes") {
    const selectedCarriers = Array.isArray(phase2.internationalCallCarrier)
      ? phase2.internationalCallCarrier
      : [];
    filtered = filtered.filter((plan) => {
      if (!plan.supportsInternationalUnlimitedCalls) return false;
      if (selectedCarriers.length === 0) return true;
      return selectedCarriers.some((c: string) => {
  if (c === "rakuten") return plan.carrier?.toLowerCase().includes("rakuten");
  if (c === "au") return plan.carrier?.toLowerCase().includes("au");
  return false;
});

    });
  }

 // ===================================================
// 📱 端末フィルター（deviceQuestions構造に準拠）
// ===================================================
if (phase2.devicePreference === "yes") {
  const purchaseMethod = Array.isArray(phase2.devicePurchaseMethods)
    ? phase2.devicePurchaseMethods[0]
    : phase2.devicePurchaseMethods ?? "";

  const selectedModel = phase2.deviceModel?.trim() ?? "";
  const selectedStorage = phase2.deviceStorage?.trim() ?? "";

  // === 1️⃣ 正規店購入（Apple・家電量販店など）===
  if (purchaseMethod === "store_purchase") {
    // → キャリアで端末購入を条件にしているプランを除外
    filtered = filtered.filter((plan) => plan.devicePurchaseRequired !== true);
  }

  // === 2️⃣ キャリア購入（通常購入 or 返却プログラム）===
  else if (purchaseMethod === "carrier_purchase" || purchaseMethod === "carrier_return") {
    // 該当キャリアが指定端末を扱っているかチェック
    if (selectedModel && selectedStorage) {
      const targetList =
        purchaseMethod === "carrier_return" ? devicePricesLease : devicePricesBuy;

      filtered = filtered.filter((plan) =>
        targetList.some(
          (d) =>
            d.model === selectedModel &&
            d.storage === selectedStorage &&
            d.carrier === plan.carrier
        )
      );
    }
  }
}

// === 端末購入しない場合（SIMのみ契約）===
if (phase2.devicePreference === "no") {
  filtered = filtered.filter((plan) => plan.simOnlyAvailable !== false);
}


// ===================================================
// 🌏 海外利用フィルター（overseasSection準拠）
// ===================================================
if (phase2.overseasSupport === "yes") {
  filtered = filtered.filter((plan) => plan.overseasSupport === true);
}



// ===================================================
// 💳 支払い方法フィルター（Plan構造準拠）
// ===================================================
if (Array.isArray(phase2.mainCard) && phase2.mainCard.length > 0) {
  const selectedMethods = phase2.mainCard; // ["credit", "bank", "debit"]

  // 🗺️ 値マッピング（回答ID → Plan側の表記）
  const methodMap: Record<string, string> = {
    credit: "クレジットカード",
    debit: "デビットカード",
    bank: "口座振替",
  };

  filtered = filtered.filter((plan) =>
    selectedMethods.some((method: string) => {
      const mapped = methodMap[method];
      return plan.supportedPaymentMethods?.includes(mapped);
    })
  );
}


  return filtered;
}
