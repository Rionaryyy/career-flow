
// scripts/fetchCarrierSpecific.ts
import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";

async function main() {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID || "YOUR_SHEET_ID_HERE";
    const SHEET_NAME = "キャリアに依存"; // ← 対象のシート名をここに！

    console.log("📥 Google Sheet からキャリア依存データを取得中...");
    const rows = await fetchSpreadsheetData(SHEET_ID, SHEET_NAME);

    if (!rows || rows.length < 3) {
      console.warn("⚠️ データが不足しています。");
      return;
    }

    // === 行構造 ===
    // 0: 日本語ヘッダー
    // 1: 英語ヘッダー（キー）
    // 2以降: 実データ
    const headerRow = rows[1];
    const dataRows = rows.slice(4);

    console.log("🧩 Header:", headerRow.slice(0, 10));
    console.log("🧩 1st Row:", dataRows[0]?.slice(0, 10));

    // === オブジェクト配列に変換 ===
    const records = dataRows
      .filter((row) => row.some((v) => v && v !== ""))
      .map((row, i) => {
        const obj: Record<string, any> = {};
        headerRow.forEach((key, idx) => {
          if (key) obj[key] = row[idx] ?? "";
        });
        obj["id"] = obj["id"] || `carrier_specific_${i + 1}`;
        return obj;
      });

    // === 保存 ===
    const outputDir = path.join(process.cwd(), "data");
    const outputPath = path.join(outputDir, "carrierSpecific.json");
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
