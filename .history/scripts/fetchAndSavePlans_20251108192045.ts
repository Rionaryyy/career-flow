import fs from "fs";
import path from "path";
import { fetchSpreadsheetData } from "../utils/sheets/fetchSpreadsheetData";

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

    console.log("🧩 rows.length:", rows.length);
    console.log("🧩 1行目のセル数:", rows[0].length);
    console.log("🧩 1行目:", rows[0]);
    console.log("🧩 2行目:", rows[1]);
    console.log("🧩 3行目:", rows[2]);
    console.log("🧩 4行目:", rows[3]);
    console.log("🧩 最終行:", rows[rows.length - 1]);

  } catch (err) {
    console.error("❌ エラー:", err);
  }
}

main();
