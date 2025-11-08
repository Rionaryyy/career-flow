// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { transformSheetToPlans } from "../utils/sheets/transformSheetToPlans";
import { Plan } from "@/types/planTypes";

/**
 * Googleスプレッドシートからプランデータを取得して
 * Plan[] に変換し、data/plans.json に保存するスクリプト
 */
async function main() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE";
    const SHEET_NAME = "キャリアに依存";

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    if (!rows || rows.length < 3) {
      console.warn("⚠️ データが不足しています。");
      return;
    }

    // === 1行目：日本語項目名 / 2行目：英語項目名 / 3行目以降：実データ ===
    const japaneseHeader = rows[0];
    const header = rows[1];
    const dataRows = rows.slice(2);

    console.log("🧩 Japanese Header:", japaneseHeader.slice(0, 10));
    console.log("🧩 Header (used as keys):", header.slice(0, 10));
    console.log("🧩 First Data Row:", dataRows[0]?.slice(0, 10));

    // === transform用に正規化 ===
    const normalizedRows = [header, ...dataRows];
    const plans: Plan[] = transformSheetToPlans(normalizedRows);

    // === 保存先設定 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
    if (plans.length > 0) console.log("📘 サンプルプラン:", plans[0]);
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
