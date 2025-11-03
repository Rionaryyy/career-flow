import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

/**
 * 💡 汎用キャンペーン判定ロジック
 * -------------------------------------------------------
 * - DBの conditions と ユーザー回答の特徴タグを照合
 * - 「新規契約」「MNP」「他社から乗り換え」は自動クリア
 * - DBを変えれば新しい条件も柔軟に対応
 */
export function calcCampaigns(plan: Plan, answers: DiagnosisAnswers) {
  let campaignCashback = 0;
  const matched: string[] = [];

  // === ① 回答から「特徴タグ」を抽出 ===
  const tags: string[] = [];

  const devicePref = answers.phase2?.devicePreference ?? "";
  const purchaseMethod = answers.phase2?.devicePurchaseMethods?.[0] ?? "";
  const hasCoupon = !!answers.phase2?.couponUsed;
  const compareAxis = answers.phase1?.compareAxis ?? "";

  // --- SIM/端末 ---
  if (devicePref.includes("SIMのみ")) tags.push("SIMのみ");
  if (devicePref.includes("購入")) tags.push("端末セット");
  if (purchaseMethod.includes("キャリア")) tags.push("キャリア購入");
  if (purchaseMethod.includes("返却")) tags.push("返却プログラム");
  if (purchaseMethod.includes("ストア")) tags.push("正規店購入");

  // --- クーポン ---
  if (hasCoupon) tags.push("クーポン入力");

  // --- 契約タイプ ---
  tags.push("新規契約"); // 全体的に常に有効（他の条件が付くと上書き）
  tags.push("MNP");       // 仮に常に許可
  tags.push("オンライン申込"); // キャリコはオンライン前提

  // --- 表示用デバッグ ---
  console.log("🧩 userTags:", tags);

  // === ② 各キャンペーンを評価 ===
  for (const cp of campaigns) {
    if (!cp.targetPlanIds.includes(plan.planId)) continue;

    const required = cp.conditions ?? [];

    // 「新規契約」「MNP」「他社から乗り換え」は常に満たす扱い
    const isMatch = required.every((cond) => {
      if (["新規契約", "MNP", "他社から乗り換え"].includes(cond)) return true;
      return tags.some((t) => t.includes(cond));
    });

    if (isMatch) {
      campaignCashback += cp.cashbackAmount ?? 0;
      matched.push(cp.campaignId);
    }

    console.log("🎯", cp.campaignName, "→", isMatch ? "✅ HIT" : "❌ no match");
  }

  // === ③ 初期費用関連 ===
  const initialCostTotal = plan.initialCost ?? 0;
  const comparePeriod = answers.phase1?.comparePeriod ?? "";

  let months = 12;
  if (comparePeriod.includes("2年")) months = 24;
  else if (comparePeriod.includes("3年")) months = 36;

  const initialFeeMonthly =
    compareAxis.includes("実際に支払う金額") ? initialCostTotal / months : 0;

  return {
    campaignCashback,
    campaignMatched: matched,
    initialFeeMonthly,
    initialCostTotal,
  };
}
