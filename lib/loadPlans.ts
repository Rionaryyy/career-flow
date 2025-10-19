// lib/loadPlans.ts
import Papa from "papaparse";

export async function loadPlans() {
  const response = await fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm1nPtrcTR1InI8eKap6HQnLNvL7CLy6DpQ4-7MCCNxgrC6nxxUM5hcVzOzs7Srh1kXawoQtO9id2a/pub?gid=172211928&single=true&output=csv"
  );
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, { header: true });
  const rows = parsed.data as Record<string, string>[];

  // 🔄 縦→横の変換
  const plans: Record<string, Record<string, string>> = {};

  rows.forEach((row) => {
    const key = row["英語項目名"];
    Object.entries(row).forEach(([planId, value]) => {
      if (planId.includes("_")) {
        if (!plans[planId]) plans[planId] = {};
        plans[planId][key] = value;
      }
    });
  });

  // 配列に変換
  const planList = Object.entries(plans).map(([planId, data]) => ({
    planId,
    ...data,
  }));

  console.log("📦 変換後データ", planList);
  console.log("総プラン数:", planList.length);

  return planList;
}
