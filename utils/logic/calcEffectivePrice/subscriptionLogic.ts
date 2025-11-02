// utils/logic/calcEffectivePrice/subscriptionLogic.ts
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

export function calcSubscription(plan: Plan, answers: DiagnosisAnswers): SubscriptionResult {
  console.log("✅ checkpoint: before subs", plan.carrier);

  const phase2 = answers.phase2 ?? answers;
  const subsSource = phase2 as any;

  // === 初期化 ===
  let subscriptionDiscount = 0;
  let subscriptionReward = 0;
  let subscriptionBaseFee = 0;

  let subscriptionDetails: {
    name: string;
    basePrice: number;
    discount?: number;
    reward?: number;
  }[] = [];

  // === サブスク回答が無ければスキップ ===
  const allSubsRaw = [
    subsSource.subscriptionList,
    subsSource.videoSubscriptions,
    subsSource.musicSubscriptions,
    subsSource.bookSubscriptions,
    subsSource.gameSubscriptions,
    subsSource.cloudSubscriptions,
    subsSource.otherSubscriptions,
  ];

  const allSubs = allSubsRaw
    .flatMap((v) => (Array.isArray(v) ? v : typeof v === "string" ? [v] : []))
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0);

  if (allSubs.length === 0) {
    console.log("⚠️ No subs detected for", plan.carrier, "→ skip subscription calc");
    return { subscriptionBaseFee, subscriptionDiscount, subscriptionReward, subscriptionDetails };
  }

  console.log("🎬 Subscription block START", {
    carrier: plan.carrier,
    selectedSubs: allSubs,
  });

  const carrierKey = plan.carrier.toLowerCase() as
    | "docomo"
    | "au"
    | "softbank"
    | "rakuten";

  // === 名称正規化 ===
  const normalizeSubName = (text: string): string => {
    if (!text) return "";
    let replaced = text
      .toLowerCase()
      .replace(/[（）()【】「」『』［］]/g, "")
      .replace(/（.*?）/g, "")
      .replace(/[\s・]/g, "")
      .replace(/[^a-z0-9ぁ-んァ-ン一-龠]/g, "")
      .trim();

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
      アップルミュージック: "applemusic",
      applemusic: "applemusic",
    };

    for (const [alias, canonical] of Object.entries(aliases)) {
      if (replaced.includes(alias)) return canonical;
    }
    return replaced;
  };

  // === 付帯済みサブスク一覧 ===
  const includedSubs =
    plan.includedSubscriptions
      ?.split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean) ?? [];

  // === 💙 STEP1: 全プランに対してサブスク本体料金を一律加算（付帯除外 + ユニーク化） ===
  const uniqueSubs = Array.from(new Set(allSubs.map((s) => normalizeSubName(s))));

  uniqueSubs.forEach((subName) => {
    const isIncluded = includedSubs.some((inc) => subName.includes(inc));
    const entry = subscriptionData.find((s) =>
      normalizeSubName(s.name).includes(subName)
    );
    const base = entry?.basePrice ?? 0;

    if (!isIncluded && base > 0) {
      subscriptionBaseFee += base;
      subscriptionDetails.push({
        name: entry?.name ?? subName,
        basePrice: base,
        discount: 0,
        reward: 0,
      });
      console.log(`🩵 ${plan.carrier}: ${subName} → 本体料金 +¥${base}`);
    } else if (isIncluded) {
      console.log(`✅ ${plan.carrier}: ${subName} は付帯済み → 加算なし`);
    }
  });

  // === 🧡 STEP2: 割引・還元（キャリア依存） ===
  uniqueSubs.forEach((subName) => {
    const normalizedSub = normalizeSubName(subName);
    const matchedEntries = subscriptionData.filter((s) => {
      const target = normalizeSubName(
        s.name
          .replace(/（セット割）|（本体価格還元）/g, "")
          .replace(/セット割|本体価格還元/g, "")
      );
      return normalizedSub.includes(target) || target.includes(normalizedSub);
    });

    matchedEntries.forEach((entry) => {
      const base = entry.basePrice ?? 0;
      let discountApplied = 0;
      let rewardApplied = 0;

      const isIncluded = includedSubs.some((inc) =>
        entry.name.toLowerCase().includes(inc)
      );
      if (isIncluded) {
        console.log(`⏭ ${entry.name}: ${plan.carrier} 付帯済み → 割引・還元スキップ`);
        return;
      }

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
          console.log(
            `💸 還元: ${plan.carrier} - ${entry.name} (${rate * 100}% → ¥${reward}/月)`
          );
        }
      }

      // --- 統合または追加 ---
      const existing = subscriptionDetails.find(
        (s) => s.name.toLowerCase() === entry.name.toLowerCase()
      );

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

  console.log("🔢 subscriptionBaseFee total:", subscriptionBaseFee);
  console.log("🔢 subscriptionDiscount total:", subscriptionDiscount);
  console.log("🔢 subscriptionReward total:", subscriptionReward);
  console.log("📦 subscriptionDetails:", JSON.stringify(subscriptionDetails, null, 2));

  return {
    subscriptionBaseFee,
    subscriptionDiscount,
    subscriptionReward,
    subscriptionDetails,
  };
}
