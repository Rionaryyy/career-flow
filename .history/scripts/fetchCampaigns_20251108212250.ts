// scripts/fetchCampaigns.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";

async function main() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
    const SHEET_NAME = "キャンペーン"; // シート名を正確に！

    console.log("📥 Google Sheet からキャンペーンデータを取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    if (!rows || rows.length < 3) {
      console.warn("⚠️ データが不足しています。");
      return;
    }

    const headerRow = rows[1]; // 英語キー行
    const dataRows = rows.slice(2);

    const records = dataRows
      .filter((row) => row.some((v) => v && v !== ""))
      .map((row, i) => {
        const obj: Record<string, any> = {};
        headerRow.forEach((key, idx) => {
          if (key) obj[key] = row[idx] ?? "";
        });
        // 表示用の日本語タイトルを保持
        obj["displayName"] = obj["campaignName"];
        obj["id"] = obj["campaignId"] || `campaign_${i + 1}`;
        return obj;
      });

    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "campaigns.json");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), "utf-8");

    console.log(`💾 保存完了: ${outputPath}`);
    console.log(`📊 登録データ数: ${records.length}`);
    console.log("📘 サンプル:", records[0]);
  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
