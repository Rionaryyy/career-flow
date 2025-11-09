import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { devicePricesLease } from "../../data/devicePricesLease";
import { devicePricesBuy } from "../../data/devicePricesBuy";

import { allPlans } from "@/data/plans";



console.log("🧩 Using plans sample:", allPlans[0]?.planId, allPlans[0]?.callOptions);

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

  console.log("🧩 [Phase2 Snapshot Check]", {
  callOptionsNeeded: phase2.callOptionsNeeded,
  phase2Keys: Object.keys(phase2 || {}),
});

  

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

// 🟩 まず、「かけ放題を利用しない」選択があれば即スキップ
if (
  phase2.needCallPlan === "no" ||
  phase2.needCallPlanConfirm === "no" ||
  phase2.callPlanType === null ||
  (Array.isArray(phase2.callPlanType) && phase2.callPlanType.length === 0)
) {
  console.log("💤 [CallFilter] 『いいえ（使った分だけ支払い）』選択のためスキップ");
} else if (
  !phase2.callPlanType ||
  phase2.callPlanType.length === 0 ||
  (phase2.callPlanType.length === 1 && phase2.callPlanType[0] === "noPreference")
) {
  console.log("💤 [CallFilter] 通話タイプ未選択または noPreference のためスキップ");
} else {
  // 🧩 通話フィルターロジック本体（timeLimit / monthlyLimit / hybrid / unlimited）
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

  // === 🧩 汎用ヘルパー: 無制限判定 ===
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

  // ...以下は既存の timeLimit / monthlyLimit / hybrid / unlimited フィルター本体（前回の安定版そのまま）


  // === 1️⃣ 時間制限型 ===
  if (selectedTypes.includes("timeLimit")) {
    const pref = phase2.timeLimitPreference ?? "";
    const map: Record<string, number> = {
      "5min": 5,
      "10min": 10,
      "15min": 15,
      "30min": 30,
      unlimited: Infinity,
    };
    const limit = map[pref] ?? 0;

    const newMatches = filtered.filter((p) => {
      const hasUnlimitedOption = hasUnlimited(p);
      const timeOpts = p.callOptions?.filter((opt) => opt.type === "time") ?? [];

      if (!pref) {
        // ✅ 詳細未選択 → time型すべて＋無制限を通過
        return hasUnlimitedOption || timeOpts.length > 0;
      }

      const hasHigherTier = timeOpts.some((opt) => {
        const optLimit = map[opt.id] ?? 0;
        return optLimit >= limit;
      });

      return hasUnlimitedOption || hasHigherTier;
    });

    matches.push(...newMatches);
    console.log(
      `📉 時間制限型フィルター: ${filtered.length} → ${matches.length} 件（${
        pref ? `${pref}以上` : "詳細未選択→全time型"
      }）`
    );
  }

  // === 2️⃣ 月間制限型 ===
  if (selectedTypes.includes("monthlyLimit")) {
    const pref = phase2.monthlyLimitPreference?.trim() ?? "";
    const map: Record<string, number> = {
      monthly30min: 30,
      monthly60min: 60,
      monthly70min: 70,
      monthly100min: 100,
      unlimited: Infinity,
    };
    const limit = map[pref] ?? 0;

    const newMatches = filtered.filter((p) => {
      const hasUnlimitedOption = hasUnlimited(p);
      const monthlyOpts = p.callOptions?.filter((opt) => opt.type === "monthly") ?? [];

      if (!pref) {
        // ✅ 詳細未選択 → monthly型すべて＋無制限を通過
        return hasUnlimitedOption || monthlyOpts.length > 0;
      }

      const hasHigherTier = monthlyOpts.some((opt) => {
        const optLimit = map[opt.id] ?? 0;
        return optLimit >= limit;
      });

      return hasUnlimitedOption || hasHigherTier;
    });

    matches.push(...newMatches);
    console.log(
      `📉 月間制限型フィルター: ${filtered.length} → ${matches.length} 件（${
        pref ? `${pref}以上` : "詳細未選択→全monthly型"
      }）`
    );
  }

  // === 3️⃣ ハイブリッド型 ===
  if (selectedTypes.includes("hybrid")) {
    const pref = phase2.hybridCallPreference ?? "";
    const map = {
      "30x10": { count: 30, perCall: 10 },
      "50x10": { count: 50, perCall: 10 },
      unlimited: { count: Infinity, perCall: Infinity },
    };
    const { count, perCall } = map[pref as keyof typeof map] ?? { count: 0, perCall: 0 };

    const newMatches = filtered.filter((p) => {
      const hasUnlimitedOption = hasUnlimited(p);
      const hybridOpts = p.callOptions?.filter((opt) => opt.type === "hybrid") ?? [];

      if (!pref) {
        // ✅ 詳細未選択 → hybrid型すべて＋無制限を通過
        return hasUnlimitedOption || hybridOpts.length > 0;
      }

      const hasHigherTier = hybridOpts.some((opt) => {
        const def = map[opt.id as keyof typeof map] ?? { count: 0, perCall: 0 };
        return def.count >= count && def.perCall >= perCall;
      });

      return hasUnlimitedOption || hasHigherTier;
    });

    matches.push(...newMatches);
    console.log(
      `📉 ハイブリッド型フィルター: ${filtered.length} → ${matches.length} 件（${
        pref ? `${pref}` : "詳細未選択→全hybrid型"
      }）`
    );
  }

  // === 4️⃣ 無制限型 ===
  if (selectedTypes.includes("unlimited")) {
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



// 🌍 国際通話フィルター（日本語キャリア対応版）
if (phase2.needInternationalCallUnlimited === "yes") {
  const selectedCarriers: string[] = Array.isArray(phase2.internationalCallCarrier)
    ? phase2.internationalCallCarrier.map((c: string) => c.toLowerCase())
    : [];

  console.log("🌍 [InternationalFilter] 選択キャリア:", selectedCarriers);

  filtered = filtered.filter((plan) => {
    // --- 海外通話プラン対応チェック ---
    const supportsIntl =
      (plan as any).internationalCallOptions === true ||
      (plan as any).internationalOptions === true;

    if (!supportsIntl) return false;

    // --- キャリア未指定なら残す ---
    if (selectedCarriers.length === 0) return true;

    const carrierName = plan.carrier?.toLowerCase() ?? "";

    // --- マッチ条件を日本語にも対応させる ---
    const match = selectedCarriers.some((c: string) => {
      if (c === "rakuten") {
        return (
          carrierName.includes("rakuten") ||
          carrierName.includes("楽天") ||
          carrierName.includes("楽天モバイル")
        );
      }
      if (c === "au") {
        return carrierName.includes("au");
      }
      if (c === "docomo") {
        return carrierName.includes("docomo") || carrierName.includes("ドコモ");
      }
      if (c === "softbank") {
        return carrierName.includes("softbank") || carrierName.includes("ソフトバンク");
      }
      return false;
    });

    if (match) {
      console.log(`✅ [CarrierMatch] ${plan.planId} (${carrierName})`);
    } else {
      console.log(`❌ [CarrierSkip] ${plan.planId} (${carrierName})`);
    }

    return match;
  });

  console.log(`📉 [InternationalFilter] フィルター後: ${filtered.length} 件`);
}

// ===================================================
// 📞 留守番電話オプションフィルター（「いいえ」は全残し）
// ===================================================
if (phase2.callOptionsNeeded === "yes") {
  const beforeCount = filtered.length;
  console.log("📞 [VoicemailFilter] 留守番電話オプションが必要 → hasVoicemail=true のみ残す");

  filtered = filtered.filter((plan) => {
    const hasFlag =
      plan.hasVoicemail === true ||
      (plan as any)["hasVoicemail,callOptionsNeeded"] === true; // データ誤結合対応
    return hasFlag;
  });

  console.log(`📉 [VoicemailFilter] ${beforeCount} → ${filtered.length} 件（必要のみ）`);

  filtered.forEach((p) => {
    console.log(`   ┗ ${p.planId}: hasVoicemail=${p.hasVoicemail}`);
  });
} else if (phase2.callOptionsNeeded === "no") {
  console.log("📞 [VoicemailFilter] 留守番電話オプション不要 → フィルター適用せず（全残し）");
}






// ===================================================
// 📱 端末フィルター（iPhone / Pixel / Galaxy / Xperia対応）
// ===================================================
if (phase2.devicePreference === "yes") {
  const purchaseMethod = Array.isArray(phase2.devicePurchaseMethods)
    ? phase2.devicePurchaseMethods[0]
    : phase2.devicePurchaseMethods ?? "";

  const selectedModel = phase2.deviceModel?.trim() ?? "";

  if (purchaseMethod === "store_purchase") {
    filtered = filtered.filter((plan) => plan.devicePurchaseRequired !== true);
  } else if (purchaseMethod === "carrier_purchase" || purchaseMethod === "carrier_return") {
    if (selectedModel) {
      const normalizedModel = selectedModel
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/,/g, "")
        .replace(/[（）]/g, "");

      // ✅ シリーズ名抽出（iPhone / Galaxy / Pixel / Xperia）
      const baseSeries =
        normalizedModel.match(/(iphone|galaxy|pixel|xperia)\d+/)?.[0] ??
        normalizedModel;

      // ✅ "Pro" "Plus" "Ultra" "Fold" などを許可
      const seriesRegex = new RegExp(
        `^${baseSeries}(pro|plus|ultra|fold|a|fe|mini)?$`
      );

      filtered = filtered.filter((plan) => {
        const models = (plan.deviceModel ?? "")
          .split(",")
          .map((m: string) =>
            m
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/,/g, "")
              .replace(/[（）]/g, "")
          );

        const match = models.some((m) => seriesRegex.test(m));
        if (match) console.log("✅ Hit:", plan.carrier, plan.planName, plan.deviceModel);
        return match;
      });

      console.log("📊 [Device Filter Result] 絞り込み後:", filtered.length);
    }
  }
}

if (phase2.devicePreference === "no") {
  filtered = filtered.filter((plan) => plan.simOnlyAvailable !== false);
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
