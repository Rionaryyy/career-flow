import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * 💸 統合型キャリコキャンペーンロジック（ID対応版）
 * ----------------------------------------------------
 * - 契約方法・比較期間・デバイス購入形態・クーポン利用等に対応
 * - comparePeriod の ID ("12m" / "24m" / "36m") に完全対応
 */
export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  let campaignCashback = 0;
  const campaignMatched: string[] = [];

  // === 🎯 対象キャンペーン探索 ===
  for (const cp of campaigns) {
    if (!Array.isArray(cp.targetPlanIds) || !cp.targetPlanIds.includes(plan.planId)) continue;

    const purchaseMethod = Array.isArray(answers.devicePurchaseMethods)
      ? answers.devicePurchaseMethods[0] ?? ""
      : answers.devicePurchaseMethods ?? "";

    // ✅ Phase2形式に対応（yes/no, 英語ID）
    const isSimOnly =
      answers.devicePreference === "no" ||
      answers.devicePreference?.includes("いいえ") ||
      purchaseMethod === "sim_only";

    const isDeviceSet =
      answers.devicePreference === "yes" ||
      answers.devicePreference?.includes("はい") ||
      /(キャリア|返却|家電|ストア)/.test(purchaseMethod ?? "") ||
      ["carrier_purchase", "lease_return", "official_store"].some((k) =>
        purchaseMethod?.includes(k)
      );

    const hasCoupon =
      answers.couponUsed === true ||
      (typeof answers.couponUsed === "string" && ["yes", "はい"].includes(answers.couponUsed));

    // 条件ごとの照合（"〜を含まない"ものは常に通過）
    const okNew = !cp.conditions.includes("新規契約") || true;
    const okMnp = !cp.conditions.includes("MNP") || true;
    const okSimOnly = !cp.conditions.includes("SIMのみ") || isSimOnly;
    const okDeviceSet = !cp.conditions.includes("端末セット") || isDeviceSet;
    const okCoupon = !cp.conditions.includes("クーポン入力") || hasCoupon;

    if (okNew && okMnp && okSimOnly && okDeviceSet && okCoupon) {
      campaignCashback += cp.cashbackAmount ?? 0;
      campaignMatched.push(cp.campaignId);
    }
  }

  // === 💰 初期費用の算出 ===
  const method = answers.contractMethod ?? "";
  const feeStore = plan.initialFee ?? 0;
  const feeOnline = plan.initialFeeOnline ?? 0;
  const feeEsim = plan.esimFee ?? 0;

  let initialCostTotal = 0;
  if (method.includes("店頭") || method === "store") initialCostTotal = feeStore;
  else if (method.includes("オンライン") || method === "online")
    initialCostTotal = feeOnline + feeEsim;
  else if (method.includes("どちらでも") || method === "either")
    initialCostTotal = Math.min(feeStore, feeOnline + feeEsim);
  else initialCostTotal = feeOnline + feeEsim;

  // === 📆 比較期間 ===
  const comparePeriod = answers.comparePeriod ?? answers.phase1?.comparePeriod ?? "";
  let months = 24;

  // ✅ ID ("12m" / "24m" / "36m") に完全対応
  if (["1年", "12m", "12M"].some((k) => comparePeriod.includes(k))) months = 12;
  else if (["2年", "24m", "24M"].some((k) => comparePeriod.includes(k))) months = 24;
  else if (["3年", "36m", "36M"].some((k) => comparePeriod.includes(k))) months = 36;

  // === 📊 比較軸 ===
  const compareAxis = answers.compareAxis ?? "";
  const considerRealPayment =
    compareAxis.includes("実際に支払う金額") ||
    compareAxis.includes("real_payment") ||
    compareAxis === "total";

  // === 💵 月額換算 ===
  const cashbackMonthly = considerRealPayment ? campaignCashback / months : 0;
  const initialFeeMonthly = initialCostTotal / months;
  const effectiveMonthlyAdjustment = (initialCostTotal - campaignCashback) / months;

  // === 🧾 結果返却 ===
  return {
    cashbackMonthly,             // 月あたりキャッシュバック額
    initialFeeMonthly,           // 月あたり初期費用
    campaignCashback,            // 総キャッシュバック額
    cashbackTotal: campaignCashback,
    initialCostTotal,            // 総初期費用
    campaignMatched,             // 適用キャンペーンID配列
    periodMonths: months,        // 比較期間（月）
    effectiveMonthlyAdjustment,  // 実質調整額
  };
}
