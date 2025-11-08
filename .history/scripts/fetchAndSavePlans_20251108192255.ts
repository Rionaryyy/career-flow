// scripts/fetchAndSavePlans.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { Plan } from "@/types/planTypes";

/**
 * Googleスプレッドシート（縦定義 × 横データ構造）対応版
 * A〜E列は定義情報、F列以降がプランデータ（1列＝1プラン）
 */
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

    // === 1️⃣ 各行ごとにB列をキー名、F列以降をデータとして抽出 ===
    const englishKeys = rows.map((r) => r[1]);
    const dataMatrix = rows.map((r) => r.slice(5));

    // === 2️⃣ 転置処理（列→行） ===
    const numPlans = dataMatrix[0]?.length || 0;
    const plans: Plan[] = [];

    for (let col = 0; col < numPlans; col++) {
      const plan: Record<string, any> = {};

      for (let row = 0; row < englishKeys.length; row++) {
        const key = englishKeys[row];
        if (!key) continue;
        plan[key] = dataMatrix[row][col] ?? "";
      }

      // planId 自動補完
      plan["planId"] = plan["planId"] || `plan_${col + 1}`;

      plans.push(plan as Plan);
    }

    // === 3️⃣ 保存 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    // === 4️⃣ ログ出力 ===
    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
    if (plans.length > 0) {
      console.log("📘 サンプルプラン:", {
        planId: plans[0].planId,
        carrier: plans[0].carrier,
        planName: plans[0].planName,
        baseMonthlyFee: plans[0].baseMonthlyFee,
      });
    }
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
