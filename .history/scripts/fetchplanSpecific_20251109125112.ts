import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";
import { Plan } from "@/types/planTypes";

/**
 * Google スプレッドシートから「プランに依存」シートを読み込み、
 * 型安全な JSON（plans.json）を生成するスクリプト
 */
async function main() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
    const SHEET_NAME = "プランに依存";
    const RANGE = "A:ZZ";

    console.log("📥 Google Sheet からデータ取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME, RANGE);

    if (!rows || rows.length < 6) {
      console.warn("⚠️ データが不足しています。");
      return;
    }

    const headerRow = rows[1].map((key) =>
      typeof key === "string"
        ? key.replace(/^\s*"|"\s*$/g, "").replace(/^\s*'|'s*$/g, "")
        : key
    );
    const dataRows = rows.slice(5);

    console.log(`🧩 Header (${headerRow.length} cols):`, headerRow.slice(0, 10));
    console.log("🧩 1st Data Row:", dataRows[0]?.slice(0, 10));
    console.log(`📊 取得データ数: ${dataRows.length} 行`);

    // === 🧩 Plan配列変換 ===
    const plans: Plan[] = dataRows
      .filter((row) => row.some((cell) => cell && cell !== ""))
      .map((row, i) => {
        const plan: Record<string, any> = {};

        headerRow.forEach((key, colIdx) => {
          if (!key || key.trim() === "　") return;
          let value: any = row[colIdx] ?? "";

          // 🧹 クォート・ブラケット除去
          if (typeof value === "string") {
            value = value
              .replace(/^\s*"|"\s*$/g, "")
              .replace(/^\s*'|'s*$/g, "")
              .replace(/^\s*\[|\]\s*$/g, "")
              .trim();
          }

          // 🧠 型変換
          if (typeof value === "string") {
            const lower = value.toLowerCase();
            if (lower === "true") value = true;
            else if (lower === "false") value = false;
            else if (!isNaN(Number(value)) && value !== "") value = Number(value);
            else if (value === "" || value === "undefined" || value === "null") value = "";
          }

          // 📦 カンマ区切り配列処理
          if (
            ["includedSubscriptions", "availableCallOptions", "supportedPaymentMethods"].includes(key) &&
            typeof value === "string"
          ) {
            value = value
              .split(",")
              .map((v) =>
                v
                  .replace(/^\s*"|"\s*$/g, "")
                  .replace(/^\s*'|'s*$/g, "")
                  .replace(/^\s*\[|\]\s*$/g, "")
                  .trim()
              )
              .filter((v) => v.length > 0);
          }

          plan[key] = value;
        });

        // === 🟩 通話オプション定義 ===
        const callOptionIds = [
          "5min",
          "10min",
          "15min",
          "30min",
          "monthly30min",
          "monthly60min",
          "monthly70min",
          "monthly100min",
          "10minX30calls",
          "10minX50calls",
          "5minX30calls",
          "unlimited",
        ];

        const callOptionLabels: Record<string, string> = {
          "5min": "5分かけ放題",
          "10min": "10分かけ放題",
          "15min": "15分かけ放題",
          "30min": "30分かけ放題",
          "monthly30min": "月30分無料",
          "monthly60min": "月60分無料",
          "monthly70min": "月70分無料",
          "monthly100min": "月100分無料",
          "10minX30calls": "月30回×10分かけ放題",
          "10minX50calls": "月50回×10分かけ放題",
          "5minX30calls": "月30回×5分かけ放題",
          "unlimited": "無制限かけ放題",
        };

        // 🟩 タイプ分類マップ
        const callOptionTypes: Record<string, string> = {
          "5min": "time",
          "10min": "time",
          "15min": "time",
          "30min": "time",
          "monthly30min": "monthly",
          "monthly60min": "monthly",
          "monthly70min": "monthly",
          "monthly100min": "monthly",
          "10minX30calls": "hybrid",
          "10minX50calls": "hybrid",
          "5minX30calls": "hybrid",
          "unlimited": "unlimited",
        };


// 🟦 callOptions構築
plan.callOptions = callOptionIds
  .map((id) => {
    const fee = Number(plan[id]) || 0;
    const type = callOptionTypes[id];
    const name = callOptionLabels[id];

 

    return { id, type, name, fee };
  })
  .filter((opt) => opt.fee > 0);


        // planId 補完
        plan["planId"] = plan["planId"] || `plan_${i + 1}`;
        return plan as Plan;
      });

    // === 💾 保存 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "plans.json");

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), "utf-8");

    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録プラン数: ${plans.length}`);
    if (plans.length > 0) {
      console.log("📘 サンプルプラン:", {
        planId: plans[0].planId,
        carrier: plans[0].carrier,
        planName: plans[0].planName,
        baseMonthlyFee: plans[0].baseMonthlyFee,
        callOptions: plans[0].callOptions,
      });
    }
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
