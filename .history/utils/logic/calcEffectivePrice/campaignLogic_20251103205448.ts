import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * キャリコ用キャンペーン適用ロジック
 * - 「新規契約」および「他社乗り換え（MNP）」は常に条件を満たす前提で扱う
 * - それ以外（SIMのみ／端末セット／クーポン等）はユーザー回答に基づいて判定
 */
export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  let campaignCashback = 0;
  const matched: string[] = [];

  campaigns.forEach((cp) => {
    // === 対象プランID一致 ===
    const planMatch = cp.targetPlanIds.includes(plan.planId);
    if (!planMatch) return;

    // === キャリコ仕様：新規契約・乗り換えは常に満たす ===
    const matchMnp = true;
    const matchNew = true;

    // === SIMのみ・端末セット・クーポンなどは回答ベースで判定 ===
    const purchaseMethod = answers.phase2?.devicePurchaseMethods?.[0] ?? "";

    const isSimOnly =
      answers.phase2?.devicePreference === "いいえ（SIMのみ契約する予定）";

    const isDeviceSet =
      answers.phase2?.devicePreference === "はい（端末も一緒に購入する）" &&
      (purchaseMethod.includes("キャリア") ||
        purchaseMethod.includes("返却") ||
        purchaseMethod.includes("家電") ||
        purchaseMethod.includes("ストア"));

    const hasCoupon = answers.phase2?.couponUsed === true;

    // === 条件マッチング ===
    const matchSimOnly = !cp.conditions.includes("SIMのみ") || isSimOnly;
    const matchSet = !cp.conditions.includes("端末セット") || isDeviceSet;
    const matchCoupon = !cp.conditions.includes("クーポン入力") || hasCoupon;

    // === 全条件を満たしたキャンペーンを加算 ===
    if (matchMnp && matchNew && matchSimOnly && matchSet && matchCoupon) {
      campaignCashback += cp.cashbackAmount;
      matched.push(cp.campaignId);
    }
  });

  return {
    campaignCashback,
    campaignMatched: matched,
  };
}
