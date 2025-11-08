// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { Plan } from "@/types/planTypes";

/**
 * Googleスプレッドシート（列方向データ構造）対応版
 * A〜E列が定義情報、F列以降がプランデータ。
 */
async function main() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE";
    const SHEET_NAME = "キャリアに依存";

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    if (!rows || rows.length === 0) {
      console.warn("⚠️ データが空です。");
      return;
    }

    // === 1〜5列目まではメタ情報 ===
    const headerKeys = rows.map((r) => r[1]); // B列（英語ID列）をキーに
    const dataColumns = rows.map((r) => r.slice(5)); // F列以降をデータとして取得

    // === 転置: 各列を1件のプランに変換 ===
    const plans: Plan[] = [];
    const numPlans = dataColumns[0]?.length || 0;

    for (let col = 0; col < numPlans; col++) {
      const plan: Record<string, any> = {};
      for (let row = 0; row < headerKeys.length; row++) {
        const key = headerKeys[row];
        if (!key) continue;
        plan[key] = dataColumns[row][col] ?? "";
      }
      plans.push(plan as Plan);
    }

    // === 出力 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
    console.log("📘 サンプルプラン:", plans[0]);
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
