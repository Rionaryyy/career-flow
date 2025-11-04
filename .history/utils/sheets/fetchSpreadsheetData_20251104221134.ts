// utils/sheets/fetchSpreadsheetData.ts
import { google } from "googleapis";

/**
 * Google スプレッドシートから指定範囲のデータを取得
 * @param sheetId - スプレッドシートID
 * @param sheetName - シート名
 * @returns string[][] - ヘッダー＋データ行の2次元配列
 */
export async function fetchSpreadsheetData(sheetId: string, sheetName: string): Promise<string[][]> {
  // === Google API認証設定 ===
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://docs.google.com/spreadsheets/d/e/2PACX-1vTm1nPtrcTR1InI8eKap6HQnLNvL7CLy6DpQ4-7MCCNxgrC6nxxUM5hcVzOzs7Srh1kXawoQtO9id2a/pubhtml"],
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
