import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";



/**
 * ✅ 統合版フィルター
 * フェーズ1・フェーズ2のロジックを完全統合。
 * すべての回答を DiagnosisAnswers 直下で処理する。
 */
export function filterPlans(plans: Plan[], answers: DiagnosisAnswers): Plan[] {
  let filtered = [...plans];

console.log("🧩 [filterPlans] 受け取った answers:", answers);
console.log("🧩 [filterPlans] keys:", Object.keys(answers));



  // === 📡 キャリアタイプ ===
  if (answers.carrierType) {
    switch (answers.carrierType) {
      case "major_only":
        filtered = filtered.filter((p) => p.planType === "大手");
        break;
      case "include_sub":
        filtered = filtered.filter((p) => ["大手", "サブブランド"].includes(p.planType));
        break;
      case "include_mvno":
        filtered = filtered.filter((p) =>
          ["大手", "サブブランド", "格安SIM"].includes(p.planType)
        );
        break;
    }
  }

  // === ⚡ 通信品質 ===
  if (answers.networkQuality) {
    switch (answers.networkQuality) {
      case "high":
        filtered = filtered.filter((p) => p.networkQuality === "高");
        break;
      case "medium":
        filtered = filtered.filter((p) =>
          ["中", "高"].includes(p.networkQuality)
        );
        break;
    }
  }

  // === 🛒 契約方法 ===
  if (answers.contractMethod) {
    switch (answers.contractMethod) {
      case "store":
        filtered = filtered.filter((p) => ["store", "both"].includes(p.availableMethod));
        break;
      case "online":
        filtered = filtered.filter((p) => ["online", "both"].includes(p.availableMethod));
        break;
    }
  }





  // === 📶 データ使用量フィルター ===
  if (answers.dataUsage) {
    const usage = answers.dataUsage.toLowerCase();
    const map: Record<string, number> = {
      minimal: 0,
      "3gb": 3,
      "5gb": 5,
      "10gb": 10,
      "20gb": 20,
      "30gb": 30,
      "50gb": 50,
      unlimited: 999,
    };
    const minRequired = map[usage] ?? 0;
    const isUnlimited = usage === "unlimited";

    const beforeCount = filtered.length;

    filtered = isUnlimited
      ? filtered.filter((p) => p.maxDataGB >= 999 || p.maxDataGB === Infinity)
      : filtered.filter((p) => p.maxDataGB >= minRequired);

    console.log(
      `📶 [DataUsage] ${isUnlimited ? "無制限" : `${minRequired}GB以上`} → ${
        filtered.length
      } 件（${beforeCount} → ${filtered.length}）`
    );
  }

  // 🚦 速度制限フィルター
  if (answers.speedLimitImportance) {
    const map = { high: 1, medium: 0.5, low: 0 };
    const minSpeed = map[answers.speedLimitImportance as keyof typeof map] ?? 0;
    if (minSpeed > 0) {
      filtered = filtered.filter((p) => (p.speedLimitMbps ?? 0) >= minSpeed);
    }
  }

  // 🟨 テザリングフィルター
  const tetheringNeeded = answers.tetheringNeeded;
  const tetheringUsage = answers.tetheringUsage ?? "";

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
      filtered = filtered.filter((p) => p.tetheringAvailable === true);
    }
  }

  // ===================================================
  // 📞 国内通話プランフィルター（UI質問準拠・上位互換＋無制限対応・最終安定版）
  // ===================================================

  if (
    answers.needCallPlan === "no" ||
    answers.needCallPlanConfirm === "no" ||
    answers.callPlanType === null ||
    (Array.isArray(answers.callPlanType) && answers.callPlanType.length === 0)
  ) {
    console.log("💤 [CallFilter] 『いいえ（使った分だけ支払い）』選択のためスキップ");
  } else if (
    !answers.callPlanType ||
    answers.callPlanType.length === 0 ||
    (answers.callPlanType.length === 1 && answers.callPlanType[0] === "noPreference")
  ) {

  } else {
    const selectedTypes = answers.callPlanType;
    let matches: Plan[] = [];

    console.log("📞 [CallPlanType] 選択:", selectedTypes);
    console.log("🧩 [answers Snapshot]:", {
      callPlanType: answers.callPlanType,
      timeLimitPreference: answers.timeLimitPreference,
      monthlyLimitPreference: answers.monthlyLimitPreference,
      hybridCallPreference: answers.hybridCallPreference,
    });

    const beforeCount = filtered.length;

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
      const pref = answers.timeLimitPreference ?? "";
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

        if (!pref) return hasUnlimitedOption || timeOpts.length > 0;

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
      const pref = answers.monthlyLimitPreference?.trim() ?? "";
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

        if (!pref) return hasUnlimitedOption || monthlyOpts.length > 0;

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
      const pref = answers.hybridCallPreference ?? "";
      const map = {
        "30x10": { count: 30, perCall: 10 },
        "50x10": { count: 50, perCall: 10 },
        unlimited: { count: Infinity, perCall: Infinity },
      };
      const { count, perCall } = map[pref as keyof typeof map] ?? { count: 0, perCall: 0 };

      const newMatches = filtered.filter((p) => {
        const hasUnlimitedOption = hasUnlimited(p);
        const hybridOpts = p.callOptions?.filter((opt) => opt.type === "hybrid") ?? [];

        if (!pref) return hasUnlimitedOption || hybridOpts.length > 0;

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

    const unique = Array.from(new Map(matches.map((p) => [p.planId, p])).values());
    const afterCount = unique.length;
    console.log(`✅ 通話フィルター完了: ${beforeCount} → ${afterCount} 件（重複除外後）`);
    filtered = unique;
  }

  // 🌍 国際通話フィルター
  if (answers.needInternationalCallUnlimited === "yes") {
    const selectedCarriers: string[] = Array.isArray(answers.internationalCallCarrier)
      ? answers.internationalCallCarrier.map((c: string) => c.toLowerCase())
      : [];

    console.log("🌍 [InternationalFilter] 選択キャリア:", selectedCarriers);

    filtered = filtered.filter((plan) => {
      const supportsIntl =
        (plan as any).internationalCallOptions === true ||
        (plan as any).internationalOptions === true;
      if (!supportsIntl) return false;

      if (selectedCarriers.length === 0) return true;

      const carrierName = plan.carrier?.toLowerCase() ?? "";

      const match = selectedCarriers.some((c: string) => {
        if (c === "rakuten")
          return (
            carrierName.includes("rakuten") ||
            carrierName.includes("楽天") ||
            carrierName.includes("楽天モバイル")
          );
        if (c === "au") return carrierName.includes("au");
        if (c === "docomo") return carrierName.includes("docomo") || carrierName.includes("ドコモ");
        if (c === "softbank")
          return carrierName.includes("softbank") || carrierName.includes("ソフトバンク");
        return false;
      });

      return match;
    });

    console.log(`📉 [InternationalFilter] フィルター後: ${filtered.length} 件`);
  }

  // === 🧒 子ども専用プラン（12歳以下） ===
  if (answers.childUnder12Plan === "yes") {
    filtered = filtered.filter((p) => p.planType === "大手");
  }

  // 📞 留守番電話オプションフィルター
  if (answers.callOptionsNeeded === "yes") {
    const beforeCount = filtered.length;
    filtered = filtered.filter((plan) => plan.hasVoicemail === true);
    console.log(`📞 [VoicemailFilter] ${beforeCount} → ${filtered.length} 件（必要のみ）`);
  }

  // 📱 端末フィルター
  if (answers.devicePreference === "yes") {
    const purchaseMethod = Array.isArray(answers.devicePurchaseMethods)
      ? answers.devicePurchaseMethods[0]
      : answers.devicePurchaseMethods ?? "";

    const selectedModel = answers.deviceModel?.trim() ?? "";

    if (!selectedModel || selectedModel === "その他" || selectedModel.toLowerCase().includes("other")) {
      console.log("🟢 [DeviceFilter] その他選択 → 全プラン通過");
    } else {
      if (purchaseMethod === "store_purchase") {
        filtered = filtered.filter((plan) => plan.devicePurchaseRequired !== true);
      } else if (purchaseMethod === "carrier_purchase" || purchaseMethod === "carrier_return") {
        const normalizedModel = selectedModel.toLowerCase().replace(/\s+/g, "");
        filtered = filtered.filter((plan) => {
          const models = (plan.deviceModel ?? "")
            .split(",")
            .map((m: string) => m.trim().toLowerCase().replace(/\s+/g, ""));
          return models.some((m) => m.includes(normalizedModel) || normalizedModel.includes(m));
        });
      }
    }

    console.log("📊 [Device Filter Result] 絞り込み後:", filtered.length);
  }

  if (answers.devicePreference === "no") {
    console.log("🧹 [DeviceFilter] 端末購入なし → 全通過");
  }

  // 🌏 海外利用フィルター
  const overseasValue = (answers.overseasSupport ?? "").toString().trim().toLowerCase();
  if (["yes", "はい", "あり", "有", "true"].includes(overseasValue)) {
    const before = filtered.length;
    filtered = filtered.filter((plan) => {
      const val =
        (plan as any).overseasSupport ??
        (plan as any).OverseasSupport ??
        (plan as any).overseaSupport ??
        (plan as any)["海外対応"] ??
        (plan as any).internationalOptions ??
        (plan as any).internationalCallOptions;

      return val === true || val === "true" || val === 1;
    });
    console.log(`🌍 [OverseasFilter] ${before} → ${filtered.length} 件`);
  }

  // 💳 支払い方法フィルター
  if (Array.isArray(answers.mainCard) && answers.mainCard.length > 0) {
    const selectedMethods = answers.mainCard;
    const methodMap: Record<string, string> = {
      credit: "クレジットカード",
      debit: "デビットカード",
      bank: "銀行口座引き落とし",
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
