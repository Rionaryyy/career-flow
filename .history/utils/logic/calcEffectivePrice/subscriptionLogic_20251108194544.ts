import { subscriptionData } from "@/data/subscriptionData";
import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface SubscriptionResult {
  subscriptionBaseFee: number;
  subscriptionDiscount: number;
  subscriptionReward: number;
  subscriptionDetails: {
    name: string;
    basePrice: number;
    discount?: number;
    reward?: number;
  }[];
}

/**
 * 🎬 サブスク割・還元ロジック（Phase2 ID対応）
 * ---------------------------------------------------
 * - 英語ID（例: "netflix", "amazonprime", "spotify"）を正規化して判定
 * - plan.includedSubscriptions による付帯判定
 * - subscriptionData の discounts / rewards に基づき自動計算
 */
export function calcSubscription(plan: Plan, answers: DiagnosisAnswers): SubscriptionResult {
  console.log("✅ [calcSubscription] start", plan.carrier);

  let subscriptionDiscount = 0;
  let subscriptionReward = 0;
  let subscriptionBaseFee = 0;
  let subscriptionDetails: {
    name: string;
    basePrice: number;
    discount?: number;
    reward?: number;
  }[] = [];

  // === 🟦 回答統合（Phase2 ID構造） ===
  const allSubsRaw = [
    answers.subscriptionList,
    answers.videoSubscriptions,
    answers.musicSubscriptions,
    answers.bookSubscriptions,
    answers.gameSubscriptions,
    answers.cloudSubscriptions,
    answers.otherSubscriptions,
  ];

  const allSubs = allSubsRaw
    .flatMap((v) => (Array.isArray(v) ? v : typeof v === "string" ? [v] : []))
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0);

  if (allSubs.length === 0) {
    console.log("⚠️ No subs detected for", plan.carrier);
    return { subscriptionBaseFee, subscriptionDiscount, subscriptionReward, subscriptionDetails };
  }

  const carrierKey = plan.carrier.toLowerCase() as "docomo" | "au" | "softbank" | "rakuten";

  // === 名称正規化 ===
  const normalizeSubName = (text: string): string => {
    if (!text) return "";
    const base = text.toLowerCase().trim();
    const aliases: Record<string, string> = {
      ネトフリ: "netflix",
      netflix: "netflix",
      アマプラ: "amazonprime",
      アマゾンプライム: "amazonprime",
      amazonprimevideo: "amazonprime",
      primevideo: "amazonprime",
      ディズニープラス: "disney",
      disneyplus: "disney",
      ディズニー: "disney",
      spotify: "spotify",
      スポティファイ: "spotify",
      applemusic: "applemusic",
      アップルミュージック: "applemusic",
      youtube: "youtube",
      youtube_premium: "youtube",
    };
    for (const [alias, canonical] of Object.entries(aliases)) {
      if (base.includes(alias)) return canonical;
    }
    return base;
  };

  // === 付帯済みサブスク ===
  const includedSubs: string[] = Array.isArray(plan.includedSubscriptions)
    ? plan.includedSubscriptions.map((s: string) => s.trim().toLowerCase())
    : (plan.includedSubscriptions ?? "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

  // === 💙 STEP1: サブスク基本料金加算 ===
  const uniqueSubs = Array.from(new Set(allSubs.map((s) => normalizeSubName(s))));

  uniqueSubs.forEach((subName: string) => {
    const entry = subscriptionData.find((s) => normalizeSubName(s.name) === subName);
    const base = entry?.basePrice ?? 0;
    const isIncluded = includedSubs.some((inc: string) => subName.includes(inc));

    if (!isIncluded && base > 0) {
      subscriptionBaseFee += base;
      subscriptionDetails.push({ name: entry?.name ?? subName, basePrice: base });
      console.log(`🩵 ${plan.carrier}: ${subName} → +¥${base}`);
    } else if (isIncluded) {
      console.log(`✅ ${plan.carrier}: ${subName} 付帯済み → 加算なし`);
    }
  });

  // === 🧡 STEP2: 割引・還元（キャリア依存） ===
  uniqueSubs.forEach((subName: string) => {
    const normalized = normalizeSubName(subName);
    const matched = subscriptionData.filter((s) =>
      normalizeSubName(s.name).includes(normalized)
    );

    matched.forEach((entry) => {
      const base = entry.basePrice ?? 0;
      let discountApplied = 0;
      let rewardApplied = 0;

      // --- セット割 ---
      if (entry.key.endsWith("_set")) {
        const discount = Number(entry.discounts?.[carrierKey] ?? 0);
        if (discount > 0) {
          subscriptionDiscount += discount;
          discountApplied = discount;
          console.log(`🎬 セット割: ${plan.carrier} - ${entry.name} (-¥${discount}/月)`);
        }
      }

      // --- 還元 ---
      if (entry.key.endsWith("_reward")) {
        const rate = Number(entry.rewards?.[carrierKey]);
        if (!isNaN(rate) && rate > 0) {
          const reward = Math.round(base * rate);
          subscriptionReward += reward;
          rewardApplied = reward;
          console.log(`💸 還元: ${plan.carrier} - ${entry.name} (${rate * 100}% → ¥${reward})`);
        }
      }

      // --- 統合 or 新規追加 ---
      const existing = subscriptionDetails.find((s) => s.name === entry.name);
      if (existing) {
        existing.discount = Math.max(existing.discount ?? 0, discountApplied);
        existing.reward = (existing.reward ?? 0) + rewardApplied;
      } else {
        subscriptionDetails.push({
          name: entry.name,
          basePrice: base,
          discount: discountApplied,
          reward: rewardApplied,
        });
      }
    });
  });

  return {
    subscriptionBaseFee,
    subscriptionDiscount,
    subscriptionReward,
    subscriptionDetails,
  };
}
