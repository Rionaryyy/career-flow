// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { Plan } from "@/types/planTypes";

async function main() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE";
    const SHEET_NAME = "キャリアに依存";

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    if (!rows || rows.length < 2) {
      console.warn("⚠️ データが不足しています。");
      return;
    }

    // === 1️⃣ ヘッダー行を探す（2行目が英語項目名） ===
    const headerRow = rows[1];
    const dataRows = rows.slice(2); // 3行目以降がデータ

    console.log("🧩 Header:", headerRow.slice(0, 10));
    console.log("🧩 1st Data Row:", dataRows[0]?.slice(0, 10));

    // === 2️⃣ Plan[] に整形 ===
    const plans: Plan[] = dataRows.map((row, i) => {
      const plan: any = {};
      headerRow.forEach((key, colIdx) => {
        if (!key) return;
        plan[key] = row[colIdx] ?? "";
      });

      // planId が空なら自動補完
      plan["planId"] = plan["planId"] || `plan_${i + 1}`;
      return plan as Plan;
    });

    // === 3️⃣ 保存 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    // === 4️⃣ ログ ===
    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
    console.log("📘 サンプルプラン:", plans[0]);
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
