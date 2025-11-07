import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * 💸 統合型キャリコキャンペーンロジック
 * ----------------------------------------
 * - 契約方法・比較期間・デバイス購入形態・クーポン利用等に対応
 * - キャッシュバックと初期費用を月額換算して実質料金を算出
 */
export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  let campaignCashback = 0;
  const campaignMatched: string[] = [];

  // === 📦 対象キャンペーン探索 ===
  for (const cp of campaigns) {
    if (!cp.targetPlanIds.includes(plan.planId)) continue;

    const purchaseMethod = answers.devicePurchaseMethods?.[0] ?? "";
    const isSimOnly = answers.devicePreference === "いいえ（SIMのみ契約する予定）";
    const isDeviceSet =
      answers.devicePreference === "はい（端末も一緒に購入する）" &&
      (purchaseMethod.includes("キャリア") ||
        purchaseMethod.includes("返却") ||
        purchaseMethod.includes("家電") ||
        purchaseMethod.includes("ストア"));
    const hasCoupon = !!answers.couponUsed;

    // 新規・MNPは常にクリア（キャリコ仕様）
    const okNew = !cp.conditions.includes("新規契約") || true;
    const okMnp = !cp.conditions.includes("MNP") || true;
    const okSimOnly = !cp.conditions.includes("SIMのみ") || isSimOnly;
    const okDeviceSet = !cp.conditions.includes("端末セット") || isDeviceSet;
    const okCoupon = !cp.conditions.includes("クーポン入力") || hasCoupon;

    if (okNew && okMnp && okSimOnly && okDeviceSet && okCoupon) {
      campaignCashback += cp.cashbackAmount;
      campaignMatched.push(cp.campaignId);
    }
  }

  // === 💰 初期費用の算出 ===
  const method = answers.contractMethod ?? "";
  const feeStore = plan.initialFee ?? 0;
  const feeOnline = plan.initialFeeOnline ?? 0;
  const feeEsim = plan.esimFee ?? 0;

  let initialCostTotal = 0;
  if (method.includes("店頭")) initialCostTotal = feeStore;
  else if (method.includes("オンライン")) initialCostTotal = feeOnline + feeEsim;
  else if (method.includes("どちらでも"))
    initialCostTotal = Math.min(feeStore, feeOnline + feeEsim);
  else initialCostTotal = feeOnline + feeEsim;

  // === 📅 比較期間 ===
  const comparePeriod = answers.comparePeriod ?? "";
  let months = 12;
  if (comparePeriod.includes("2年")) months = 24;
  else if (comparePeriod.includes("3年")) months = 36;
  else months = 24;

  // === 🧭 比較軸 ===
  const compareAxis = answers.compareAxis ?? "";
  let cashbackMonthly = 0;
  let initialFeeMonthly = 0;
  let effectiveMonthlyAdjustment = 0;

  if (compareAxis.includes("実際に支払う金額")) {
    cashbackMonthly = campaignCashback / months;
    initialFeeMonthly = initialCostTotal / months;
    effectiveMonthlyAdjustment = (initialCostTotal - campaignCashback) / months;
  } else {
    cashbackMonthly = 0;
    initialFeeMonthly = initialCostTotal / months;
    effectiveMonthlyAdjustment = (initialCostTotal - campaignCashback) / months;
  }

  // === 📦 最終返却 ===
  return {
    cashbackMonthly,
    initialFeeMonthly,
    campaignCashback,
    cashbackTotal: campaignCashback,
    initialCostTotal,
    campaignMatched,
    periodMonths: months,
    effectiveMonthlyAdjustment,
  };
}
