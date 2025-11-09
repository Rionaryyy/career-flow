// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { Plan } from "@/types/planTypes";

/**
 * Googleスプレッドシート（行＝プラン構造）を読み込んで
 * 型安全に plans.json を生成
 */
async function main() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE";
    const SHEET_NAME = "プランに依存";
    const RANGE = "A:ZZ"; // ✅ 全列取得

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME, RANGE);

    if (!rows || rows.length < 4) {
      console.warn("⚠️ データが不足しています。");
      return;
    }

    /**
     * === ✅ 行構造 ===
     * 0: 日本語項目名（例: キャリア, プラン名...）
     * 1: 英語項目名（例: carrier, planName...）
     * 2: データ型（例: string, number...）
     * 3以降: 実データ行
     */
    const headerRow = rows[1];
    const dataRows = rows.slice(3); // ✅ ← 修正: データは3行目から開始

    console.log(`🧩 Header (${headerRow.length} cols):`, headerRow.slice(0, 10));
    console.log("🧩 1st Data Row:", dataRows[0]?.slice(0, 10));
    console.log(`📊 取得データ数: ${dataRows.length} 行`);

    // === Plan[] に変換 ===
    const plans: Plan[] = dataRows
      .filter((row) => row.some((cell) => cell && cell !== ""))
      .map((row, i) => {
        const plan: any = {};

        headerRow.forEach((key, colIdx) => {
          if (!key) return;
          let value: any = row[colIdx] ?? "";

          // === 🧠 型自動変換 ===
          if (typeof value === "string") {
            const trimmed = value.trim();
            const lower = trimmed.toLowerCase();

            if (lower === "true") value = true;
            else if (lower === "false") value = false;
            else if (!isNaN(Number(trimmed)) && trimmed !== "") value = Number(trimmed);
            else if (trimmed === "" || trimmed === "undefined" || trimmed === "null") value = "";
          }

          // === 🧩 カンマ区切り処理 ===
          if (
            ["includedSubscriptions", "availableCallOptions", "supportedPaymentMethods"].includes(key) &&
            typeof value === "string"
          ) {
            value = value
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v.length > 0);
          }

          (plan as any)[key] = value;
        });

        // planId 自動補完
        plan["planId"] = plan["planId"] || `plan_${i + 1}`;
        return plan as Plan;
      });

    // === 💾 保存 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    // === 🧾 ログ ===
    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
    if (plans.length > 0) {
      console.log("📘 サンプルプラン:", {
        planId: plans[0].planId,
        carrier: plans[0].carrier,
        planName: plans[0].planName,
        baseMonthlyFee: plans[0].baseMonthlyFee,
        includedSubscriptions: plans[0].includedSubscriptions,
      });
    }
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
