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
    const SHEET_NAME = "キャリアに依存";

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    if (!rows || rows.length < 4) {
      console.warn("⚠️ データが不足しています。");
      return;
    }

    // === ✅ 行構造 ===
    // 0: 日本語項目名
    // 1: 英語項目名（←これを header に使う）
    // 2: データ型
    // 3以降: 実データ行
    const headerRow = rows[1];
    const dataRows = rows.slice(3);

    console.log("🧩 Header:", headerRow.slice(0, 10));
    console.log("🧩 1st Data Row:", dataRows[0]?.slice(0, 10));

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

            // boolean 判定
            if (lower === "true") value = true;
            else if (lower === "false") value = false;

            // number 判定
            else if (!isNaN(Number(trimmed)) && trimmed !== "") {
              value = Number(trimmed);
            }

            // 空文字対策
            else if (trimmed === "" || trimmed === "undefined" || trimmed === "null") {
              value = "";
            }
          }

          // === 🧩 特殊処理: カンマ区切り系 ===
          if (key === "includedSubscriptions" && typeof value === "string") {
            value = value
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v.length > 0);
          }

          if (key === "availableCallOptions" && typeof value === "string") {
            value = value
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v.length > 0);
          }

          if (key === "supportedPaymentMethods" && typeof value === "string") {
            value = value
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v.length > 0);
          }

          // === ✅ 型安全に代入 ===
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
