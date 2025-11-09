// utils/sheets/fetchSpreadsheetData.ts
import "dotenv/config";
import { google } from "googleapis";

console.log("🧩 ENV:", process.env.GOOGLE_SHEET_ID);

/**
 * ========================================================
 * 📊 Google スプレッドシートからデータを取得
 * --------------------------------------------------------
 * @param sheetId - スプレッドシートID
 * @param sheetName - シート名（例: "plans"）
 * @param range - 取得範囲（例: "A:ZZ"）※省略時は全列取得
 * @returns string[][] - ヘッダー＋データ行の2次元配列
 * ========================================================
 */
export async function fetchSpreadsheetData(
  sheetId: string,
  sheetName: string,
  range: string = "A:ZZ"
): Promise<string[][]> {
  try {
    // === Google API認証設定 ===
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // 🔐 サービスアカウント鍵
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // === 範囲指定 ===
    const fullRange = `${sheetName}!${range}`;
    console.log(`📥 Google Sheet 取得範囲: ${fullRange}`);

    // === データ取得 ===
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: fullRange,
    });

    const rows = res.data.values;

    if (!rows || rows.length < 2) {
      throw new Error("❌ スプレッドシートにデータがありません。");
    }

    console.log(`🧩 Header (${rows[0].length} cols):`, rows[0]);
    console.log(`🧩 Data rows: ${rows.length - 1} 件`);

    return rows;
  } catch (error: any) {
    console.error("❌ Google Sheets API エラー:", error.message);
    if (error.errors) console.error(error.errors);
    throw error;
  }
}

// === 💡 単体実行テスト ===
// node または ts-node で直接実行した場合にのみ走る
if (require.main === module) {
  const sheetId = process.env.GOOGLE_SHEET_ID!;
  const sheetName = "プランに依存"; // 👈 シート名（タブ名）を明示
  const range = "A:ZZ"; // ✅ 全列取得！

  fetchSpreadsheetData(sheetId, sheetName, range)
    .then((data) => {
      console.log("✅ データ取得成功:", data.length, "行");
      console.log("📋 1st row sample:", data[1]);
    })
    .catch((err) => {
      console.error("❌ データ取得失敗:", err);
    });
}
