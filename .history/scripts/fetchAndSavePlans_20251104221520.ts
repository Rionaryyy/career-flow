// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "@/utils/sheets/fetchSpreadsheetData";
import { transformSheetToPlans } from "@/utils/sheets/transformSheetToPlans";

async function main() {
  try {
    // === 環境変数 or 直書き設定 ===
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE";
    const SHEET_NAME = "plan"; // シート名

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    console.log(`✅ ${rows.length - 1} 件のデータを取得`);

    // === Plan 配列に変換 ===
    const plans = transformSheetToPlans(rows);

    // === 保存先パス設定 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");

    // dataフォルダがなければ作成
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // === JSONファイルとして書き出し ===
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
