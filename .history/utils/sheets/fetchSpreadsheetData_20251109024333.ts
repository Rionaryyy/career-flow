// utils/sheets/fetchSpreadsheetData.ts
import "dotenv/config";
import { google } from "googleapis";


console.log("🧩 ENV:", process.env.GOOGLE_SHEET_ID);


/**
 * Google スプレッドシートから指定範囲のデータを取得
 * @param sheetId - スプレッドシートID
 * @param sheetName - シート名（例: "plans!A1:Z"）
 * @returns string[][] - ヘッダー＋データ行の2次元配列
 */
export async function fetchSpreadsheetData(sheetId: string, sheetName: string): Promise<string[][]> {
  // === Google API認証設定 ===
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // 🔐 JSON鍵を指定
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"], // ✅ 正しいスコープ
  });

  const sheets = google.sheets({ version: "v4", auth });

  // === 指定シートを取得 ===
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: sheetName,
  });

  const rows = res.data.values;
  if (!rows || rows.length < 2) {
    throw new Error("スプレッドシートにデータがありません。");
  }

  return rows;
}

// === 動作確認用 ===
if (require.main === module) {
  const sheetId = process.env.GOOGLE_SHEET_ID!;
  const sheetName = "プランに依存!A1:ZZ"; // ← シート名をここで指定
  fetchSpreadsheetData(sheetId, sheetName)
    .then((data) => {
      console.log("✅ 取得データ数:", data.length);
      console.log("📋 サンプル:", data.slice(0, 3));
    })
    .catch((err) => {
      console.error("❌ エラー:", err);
    });
}
