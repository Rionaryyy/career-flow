// lib/fetchPlans.ts
import Papa from "papaparse";

/**
 * Googleスプレッドシートからキャリアプランを取得し、
 * プランIDをキーとして整形して返す
 */
export async function fetchPlans() {
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm1nPtrcTR1InI8eKap6HQnLNvL7CLy6DpQ4-7MCCNxgrC6nxxUM5hcVzOzs7Srh1kXawoQtO9id2a/pub?gid=172211928&single=true&output=csv";

  try {
    const res = await fetch(CSV_URL);
    const csvText = await res.text();

    // CSVをパース
    const parsed = Papa.parse(csvText, { header: true });
    const rows = parsed.data as Record<string, string>[];

    if (!rows.length) throw new Error("CSVが空です");

    // 1行目のキーを確認（英語項目名などを除いた列がプランID列）
    const headers = Object.keys(rows[0]);
    const planIds = headers.slice(4); // 4列目以降がプランID

    const plans = planIds.map((planId) => {
      const planData: Record<string, string> = { planId };

      rows.forEach((row) => {
        const key = row["英語項目名"];
        const value = row[planId];
        if (key && value) planData[key] = value;
      });

      return planData;
    });

    return plans;
  } catch (error) {
    console.error("❌ fetchPlans error:", error);
    throw error;
  }
}
