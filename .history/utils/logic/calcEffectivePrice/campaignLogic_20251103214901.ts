import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * キャリコ用キャンペーン適用ロジック＋初期費用算出（キャッシュバックは別DB想定）
 * ---------------------------------------------------------------
 * - 「新規契約」および「他社乗り換え（MNP）」は常に条件を満たす前提で扱う
 * - それ以外（SIMのみ／端末セット／クーポン等）はユーザー回答に基づいて判定
 * - 比較軸:
 *   ① 毎月の支払い額だけで比べたい → 初期費用を考慮しない
 *   ② 実際に支払う金額で比べたい → 初期費用を月割りで反映
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

  // === 💰 初期費用の取得（DBから）
  const initialCostTotal = plan.initialCost ?? 0; // ← ✅ ここが生きてる
  const compareAxis = answers.phase1?.compareAxis ?? "";
  const comparePeriod = answers.phase1?.comparePeriod ?? "";

  // 🗓️ 比較期間を月数に変換
  let periodMonths = 12;
  if (comparePeriod.includes("2年")) periodMonths = 24;
  else if (comparePeriod.includes("3年")) periodMonths = 36;

  // === 💵 実質料金算出用
  let cashback = 0; // ← 今はキャンペーンDBからだけ
  let initialFeeMonthly = 0;
  let actualMonthly = 0;
  let referenceMonthly = 0;

  if (compareAxis.includes("実際に支払う金額で比べたい")) {
    // 💡 実際に支払う金額 → 初期費用を月割で反映
    initialFeeMonthly = initialCostTotal / periodMonths;
    actualMonthly = initialFeeMonthly; // 今はキャッシュバック差引なし
  } else if (compareAxis.includes("毎月の支払い額だけで比べたい")) {
    // 💡 毎月の支払い額だけ → 初期費用を無視
    initialFeeMonthly = 0;
    actualMonthly = 0;
  } else {
    // 💡 未設定時フォールバック
    initialFeeMonthly = initialCostTotal / periodMonths;
    actualMonthly = initialFeeMonthly;
  }

  return {
    campaignCashback,          // 現在はキャンペーンDB分のみ
    campaignMatched: matched,  // 適用されたキャンペーンID一覧
    initialFeeMonthly,         // 初期費用（月割）
    initialCostTotal,          // 初期費用総額
    actualMonthly,             // 実際に支払う金額（月平均）
    referenceMonthly,          // 将来UIで参考表示用
  };
}
