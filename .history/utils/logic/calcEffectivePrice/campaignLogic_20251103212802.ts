import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * キャリコ用キャンペーン適用ロジック＋初期費用・キャッシュバック算出
 * - 「新規契約」および「他社乗り換え（MNP）」は常に条件を満たす前提で扱う
 * - それ以外（SIMのみ／端末セット／クーポン等）はユーザー回答に基づいて判定
 * - 「比較軸」に応じて初期費用・キャッシュバックを月割りまたは無視
 */
export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  let campaignCashback = 0;
  const matched: string[] = [];

  // === 📦 キャンペーン条件判定 ===
  campaigns.forEach((cp) => {
    const planMatch = cp.targetPlanIds.includes(plan.planId);
    if (!planMatch) return;

    // ✅ キャリコ仕様：新規契約・乗り換えは常に満たす
    const matchMnp = true;
    const matchNew = true;

    // ✅ SIMのみ・端末セット・クーポンなどは回答ベースで判定
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

    const matchSimOnly = !cp.conditions.includes("SIMのみ") || isSimOnly;
    const matchSet = !cp.conditions.includes("端末セット") || isDeviceSet;
    const matchCoupon = !cp.conditions.includes("クーポン入力") || hasCoupon;

    // ✅ 全条件を満たしたキャンペーンを合算
    if (matchMnp && matchNew && matchSimOnly && matchSet && matchCoupon) {
      campaignCashback += cp.cashbackAmount;
      matched.push(cp.campaignId);
    }
  });

  // === 💰 キャッシュバック・初期費用（月換算 or 無視） ===
  let cashback = 0;
  let initialFeeMonthly = 0;

  const cashbackTotal = (plan.cashbackAmount ?? 0) + campaignCashback;
  const initialCostTotal = plan.initialCost ?? 0;

  const compareAxis = answers.phase1?.compareAxis ?? "";
  const comparePeriod = answers.phase1?.comparePeriod ?? "";

  // 期間を月数に変換
  let periodMonths = 12;
  if (comparePeriod.includes("2年")) periodMonths = 24;
  else if (comparePeriod.includes("3年")) periodMonths = 36;

  // === 条件に応じた算出方式 ===
  if (compareAxis.includes("キャッシュバック込みで考えたい")) {
    // 💡 キャッシュバック込みで考える → 月割り算出
    cashback = cashbackTotal / periodMonths;
    initialFeeMonthly = initialCostTotal / periodMonths;
  } else if (compareAxis.includes("実際に支払う金額")) {
    // 💡 実際に支払う金額 → 初期費用もキャッシュバックも考慮しない
    cashback = 0;
    initialFeeMonthly = 0;
  } else {
    // 💡 その他・未設定時 → 月割り（フォールバック）
    cashback = cashbackTotal / periodMonths;
    initialFeeMonthly = initialCostTotal / periodMonths;
  }

  // === 🧾 結果を返す ===
  return {
    campaignCashback,       // 各種キャンペーンの総額
    campaignMatched: matched, // 適用されたキャンペーンID一覧
    cashback,               // 月割り済みキャッシュバック
    cashbackTotal,          // 総キャッシュバック額（プラン＋キャンペーン）
    initialFeeMonthly,      // 月割り初期費用
    initialCostTotal,       // 総初期費用
  };
}
