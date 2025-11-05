import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  let campaignCashback = 0;
  const campaignMatched: string[] = [];

  // 対象キャンペーン探索（ターゲットプラン一致＆条件一致）
  for (const cp of campaigns) {
    if (!cp.targetPlanIds.includes(plan.planId)) continue;

    // 条件マッチロジック（新規/MNPは自動クリア、それ以外は回答で判定）
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

    const okNew = !cp.conditions.includes("新規契約") || true;        // 常に満たす
    const okMnp = !cp.conditions.includes("MNP") || true;           // 常に満たす
    const okSimOnly = !cp.conditions.includes("SIMのみ") || isSimOnly;
    const okDeviceSet = !cp.conditions.includes("端末セット") || isDeviceSet;
    const okCoupon = !cp.conditions.includes("クーポン入力") || hasCoupon;

    if (okNew && okMnp && okSimOnly && okDeviceSet && okCoupon) {
      campaignCashback += cp.cashbackAmount;
      campaignMatched.push(cp.campaignId);
    }
  }

  // 初期費用総額（プラン定義から）
  const initialCostTotal = plan.initialCost ?? 0;

  // 比較期間（月数）
  const comparePeriod = answers.phase1?.comparePeriod ?? "";
  let periodMonths = 12;
  if (comparePeriod.includes("2年")) periodMonths = 24;
  else if (comparePeriod.includes("3年")) periodMonths = 36;

  // 比較軸
  const compareAxis = answers.phase1?.compareAxis ?? "";

  // 反映する月額値（ここが UI/合算にそのまま乗る）
  const cashbackMonthly =
    compareAxis.includes("キャッシュバック込みで考えたい")
      ? campaignCashback / periodMonths
      : 0;

  const initialFeeMonthly =
    compareAxis.includes("実際に支払う金額")
      ? initialCostTotal / periodMonths
      : 0;

  return {
    // 月額に反映する値
    cashbackMonthly,      // ← 月割済/適用判定済み（未適用なら 0）
    initialFeeMonthly,    // ← 月割済/適用判定済み（未適用なら 0）

    // 表示用（総額）
    campaignCashback,     // 総還元額（表示用）
    cashbackTotal: campaignCashback, // 同上（互換）
    initialCostTotal,     // 初期費用総額

    // デバッグ/根拠
    campaignMatched,
    periodMonths,
  };
}
