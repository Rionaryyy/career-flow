import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * キャリコ用キャンペーン適用ロジック
 * ---------------------------------------------------
 * - Phase①の契約方法に応じて初期費用を動的決定
 * - 新規契約／MNPは常に条件クリア（キャリコ仕様）
 * - 比較軸に応じてキャッシュバック・初期費用を月割
 */
export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  let campaignCashback = 0;
  const campaignMatched: string[] = [];

  // === 📦 対象キャンペーン探索 ===
  for (const cp of campaigns) {
    if (!cp.targetPlanIds.includes(plan.planId)) continue;

    const purchaseMethod = answers.phase2?.devicePurchaseMethods?.[0] ?? "";
    const isSimOnly =
      answers.phase2?.devicePreference === "いいえ（SIMのみ契約する予定）";
    const isDeviceSet =
      answers.phase2?.devicePreference === "はい（端末も一緒に購入する）" &&
      (purchaseMethod.includes("キャリア") ||
        purchaseMethod.includes("返却") ||
        purchaseMethod.includes("家電") ||
        purchaseMethod.includes("ストア"));
    const hasCoupon = !!answers.phase2?.couponUsed;

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

  // === 💰 初期費用の算出（Phase①の契約方法によって分岐） ===
  const method = answers.phase1?.contractMethod ?? "";

  // データベース由来の値（0はundefined対策）
  const feeStore = plan.initialFee ?? 0;        // 契約事務手数料（店頭）
  const feeOnline = plan.initialFeeOnline ?? 0; // 契約事務手数料（オンライン）
  const feeEsim = plan.esimFee ?? 0;            // eSIM発行料（なければ0）

  let initialCostTotal = 0;

  if (method.includes("店頭")) {
    // 店頭申し込み
    initialCostTotal = feeStore;
  } else if (method.includes("オンライン")) {
    // オンライン申し込み（eSIM発行料を加算）
    initialCostTotal = feeOnline + feeEsim;
  } else if (method.includes("どちらでも")) {
    // どちらでも構わない → 安い方を採用
    initialCostTotal = Math.min(feeStore, feeOnline + feeEsim);
  } else {
    // 未選択など → 0円扱い
    initialCostTotal = 0;
  }

  // === 📅 比較期間（月数換算） ===
  const comparePeriod = answers.phase1?.comparePeriod ?? "";
  let months = 12;
  if (comparePeriod.includes("2年")) months = 24;
  else if (comparePeriod.includes("3年")) months = 36;
  else if (!comparePeriod) months = 24;

  // === 🧭 比較軸に応じた反映 ===
  const compareAxis = answers.phase1?.compareAxis ?? "";

  let cashbackMonthly = 0;
  let initialFeeMonthly = 0;

  if (compareAxis.includes("実際に支払う金額")) {
    cashbackMonthly = campaignCashback / months;
    initialFeeMonthly = initialCostTotal / months;
  } else {
    cashbackMonthly = 0;
    initialFeeMonthly = 0;
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
  };
}
