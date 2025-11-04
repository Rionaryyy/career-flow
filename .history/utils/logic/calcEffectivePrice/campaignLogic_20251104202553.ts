import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * キャリコ用キャンペーン適用ロジック
 * ---------------------------------------------------
 * - 未選択時はキャンペーン・初期費用を非表示
 * - 新規契約／MNPは条件に明記されていなければクリア
 * - 比較軸に応じてキャッシュバック・初期費用を月割
 */
export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  // === 🛑 無回答チェック（phase1・phase2とも空ならスキップ） ===
  const hasAnySelection =
    Object.values(answers.phase1 ?? {}).some(Boolean) ||
    Object.values(answers.phase2 ?? {}).some(Boolean);

  if (!hasAnySelection) {
    return {
      cashbackMonthly: 0,
      initialFeeMonthly: 0,
      campaignCashback: 0,
      cashbackTotal: 0,
      initialCostTotal: 0,
      campaignMatched: [],
      periodMonths: 12,
    };
  }

  // === 💰 初期化 ===
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

    // ✅ 条件チェック
    const okNew = !cp.conditions.includes("新規契約"); // 条件に含まれていなければOK
    const okMnp = !cp.conditions.includes("MNP"); // 条件に含まれていなければOK
    const okSimOnly = !cp.conditions.includes("SIMのみ") || isSimOnly;
    const okDeviceSet = !cp.conditions.includes("端末セット") || isDeviceSet;
    const okCoupon = !cp.conditions.includes("クーポン入力") || hasCoupon;

    if (okNew && okMnp && okSimOnly && okDeviceSet && okCoupon) {
      campaignCashback += cp.cashbackAmount;
      campaignMatched.push(cp.campaignId);
    }
  }

  // === 💰 初期費用 ===
  const initialCostTotal = plan.initialCost ?? 0;

  // === 📅 比較期間（月数換算） ===
  const comparePeriod = answers.phase1?.comparePeriod ?? "";
  let months = 12;
  if (comparePeriod.includes("2年")) months = 24;
  else if (comparePeriod.includes("3年")) months = 36;
  else if (!comparePeriod) months = 24; // ← 未選択時は24ヶ月で換算（参考用）

  // === 🧭 比較軸に応じた反映 ===
  const compareAxis = answers.phase1?.compareAxis ?? "";

  let cashbackMonthly = 0;
  let initialFeeMonthly = 0;

  if (compareAxis.includes("実際に支払う金額")) {
    // 💡 実際の支払額で比べたい → 両方月割で反映
    cashbackMonthly = campaignCashback / months;
    initialFeeMonthly = initialCostTotal / months;
  } else {
    // 💡 未選択 or 「毎月の支払い額だけ」 → どちらも反映しない
    cashbackMonthly = 0;
    initialFeeMonthly = 0;
  }

  // === 📦 最終返却 ===
  return {
    // 💸 月額反映用
    cashbackMonthly,
    initialFeeMonthly,

    // 💰 表示用（総額）
    campaignCashback,
    cashbackTotal: campaignCashback,
    initialCostTotal,

    // 🧩 参照用
    campaignMatched,
    periodMonths: months,
  };
}
