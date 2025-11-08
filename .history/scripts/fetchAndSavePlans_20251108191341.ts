// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { transformSheetToPlans } from "../utils/sheets/transformSheetToPlans";
import { Plan } from "@/types/planTypes";

/**
 * Google スプレッドシートからデータを取得し、
 * Plan[] に変換して JSON ファイルとして保存するスクリプト
 */
async function main() {
  try {
    // === 設定 ===
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE";
    const SHEET_NAME = "キャリアに依存";

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    if (!rows || rows.length === 0) {
      console.warn("⚠️ シートにデータがありません。");
      return;
    }

    console.log(`✅ ${rows.length - 1} 件のデータを取得`);

    // === デバッグ: ヘッダーと1行目を確認 ===
    console.log("🧩 Header:", rows[0]);
    console.log("🧩 First Row:", rows[1]);

    // === Plan 配列に変換 ===
    const plans: Plan[] = transformSheetToPlans(rows);

    // === 保存先設定 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // === JSON ファイルとして保存 ===
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);

    // === 確認ログ（サンプル） ===
    if (plans.length > 0) {
      console.log("📘 サンプルプラン:", plans[0]);
    }
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
