// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { transformSheetToPlans } from "../utils/sheets/transformSheetToPlans";
import { Plan } from "@/types/planTypes"; // ✅ 追加

async function main() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE";
    const SHEET_NAME = "キャリアに依存";

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    console.log(`✅ ${rows.length - 1} 件のデータを取得`);

    // ✅ 戻り値を Plan[] 型として明示
    const plans: Plan[] = transformSheetToPlans(rows);

    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
