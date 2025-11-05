import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * キャリコ用キャンペーン適用ロジック＋初期費用算出
 * ---------------------------------------------------------------
 * - 「新規契約」「他社乗り換え（MNP）」は常に満たす扱い
 * - SIMのみ／端末セット／クーポン入力などは回答内容で判定
 * - 比較軸に応じてキャッシュバック・初期費用を月換算 or 無視
 */
export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  let campaignCashback = 0;
  const matched: string[] = [];

  // === 📦 キャンペーン条件判定 ===
  campaigns.forEach((cp) => {
    const planMatch =
      cp.targetPlanIds.includes(plan.planId) ||
      plan.carrier.includes(cp.carrier.replace(/[（(].*?[）)]/g, "").trim());
    if (!planMatch) return;

    const purchaseMethod = answers.phase2?.devicePurchaseMethods?.[0] ?? "";
    const isSimOnly = answers.phase2?.devicePreference === "いいえ（SIMのみ契約する予定）";
    const isDeviceSet =
      answers.phase2?.devicePreference === "はい（端末も一緒に購入する）" &&
      (purchaseMethod.includes("キャリア") ||
        purchaseMethod.includes("返却") ||
        purchaseMethod.includes("家電") ||
        purchaseMethod.includes("ストア"));
    const hasCoupon = answers.phase2?.couponUsed === true;

    const matchSimOnly = !cp.conditions.includes("SIMのみ") || isSimOnly;
    const matchSet = !cp.conditions.includes("端末セット") || isDeviceSet;
    const matchCoupon = !cp.conditions.includes("クーポン入力") || hasCoupon;

    if (matchSimOnly && matchSet && matchCoupon) {
      campaignCashback += cp.cashbackAmount;
      matched.push(cp.campaignId);
    }
  });

  // === 💰 キャッシュバック・初期費用（月換算 or 無視） ===
  const compareAxis = answers.phase1?.compareAxis ?? "";
  const comparePeriod = answers.phase1?.comparePeriod || "";
  const planCashback = plan.cashbackAmount ?? 0;
  const cashbackTotal = planCashback + campaignCashback;
  const initialCostTotal = plan.initialCost ?? 0;

  // 📅 比較期間（月換算）
  let months: number | null = null;
  if (comparePeriod.includes("1年")) months = 12;
  else if (comparePeriod.includes("2年")) months = 24;
  else if (comparePeriod.includes("3年")) months = 36;

  // 💸 月換算処理
  let cashback = 0;
  let initialFeeMonthly = 0;

  if (compareAxis.includes("実際に支払う金額")) {
    cashback = months ? cashbackTotal / months : cashbackTotal;
    initialFeeMonthly = months ? initialCostTotal / months : initialCostTotal;
  } else if (compareAxis.includes("毎月の支払い額だけ")) {
    cashback = 0;
    initialFeeMonthly = 0;
  } else {
    cashback = months ? cashbackTotal / months : cashbackTotal;
    initialFeeMonthly = months ? initialCostTotal / months : initialCostTotal;
  }

  return {
    campaignCashback,
    campaignMatched: matched,
    cashbackTotal,
    cashback,
    initialCostTotal,
    initialFeeMonthly,
  };
}
