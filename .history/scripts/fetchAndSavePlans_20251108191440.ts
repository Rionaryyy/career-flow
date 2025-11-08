// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { transformSheetToPlans } from "../utils/sheets/transformSheetToPlans";
import { Plan } from "@/types/planTypes";

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

    // ✅ 「英語項目名（プログラム上のID）」の行をヘッダーとして利用
    const headerRowIndex = 1; // 2行目が英語ID
    const header = rows[headerRowIndex];
    const dataRows = rows.slice(headerRowIndex + 1);

    console.log("🧩 Header (used as keys):", header.slice(0, 10));
    console.log("🧩 First Data Row:", dataRows[0]?.slice(0, 10));

    // ✅ transform 関数に再構築した配列を渡す
    const normalizedRows = [header, ...dataRows];
    const plans: Plan[] = transformSheetToPlans(normalizedRows);

    // === 保存 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
    if (plans.length > 0) console.log("📘 サンプルプラン:", plans[0]);
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
