import { Phase2Answers } from "@/types/types";
import { Question } from "../layouts/types";

export const phase2SubscriptionQuestions: Question<Phase2Answers>[] = [
  // 🧭 サブスク比較方針を冒頭で確認
 {
  section: "比較設定",
  id: "subscriptionMode",
  question: "診断ではサブスク料金や割引も含めて比較しますか？",
  type: "radio",
  options: [
    "はい（通信＋サブスクの実質料金で比較する）",
    "いいえ（通信料金だけを比較する）",
  ],
},


  // === 各カテゴリのサブスク選択 ===
  {
    section: "動画配信サービス",
    id: "videoSubscriptions",
    question: "契約中または契約予定の動画サービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Netflix",
      "Amazon Prime Video",
      "dTV",
      "Hulu",
      "U-NEXT",
      "Paravi",
      "TELASA（テラサ）",
      "FOD Premium",
      "ABEMA プレミアム",
      "DMM TV / DMMプレミアム",
    ],
    condition: (ans) => ans.subscriptionMode === "はい",
  },
  {
    section: "音楽配信サービス",
    id: "musicSubscriptions",
    question: "契約中または契約予定の音楽サービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Apple Music",
      "Spotify",
      "LINE MUSIC",
      "Amazon Music Unlimited",
      "YouTube Music Premium",
      "AWA",
      "Rakuten Music",
    ],
    condition: (ans) => ans.subscriptionMode === "はい",
  },
  {
    section: "書籍・マンガ・雑誌",
    id: "bookSubscriptions",
    question: "契約中または契約予定の書籍・雑誌サービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Kindle Unlimited",
      "dマガジン",
      "楽天マガジン",
      "LINEマンガ",
      "BookLive!",
    ],
    condition: (ans) => ans.subscriptionMode === "はい",
  },
  {
    section: "ゲーム・アニメ",
    id: "gameSubscriptions",
    question: "契約中または契約予定のゲーム・アニメサービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Nintendo Switch Online",
      "PlayStation Plus",
      "dアニメストア",
      "Rakuten TV",
    ],
    condition: (ans) => ans.subscriptionMode === "はい",
  },
  {
    section: "クラウド・ストレージ・オフィス",
    id: "cloudSubscriptions",
    question:
      "契約中または契約予定のクラウド・ストレージ・オフィスサービスを選択（複数可）",
    type: "checkbox",
    options: ["Google One", "Microsoft 365", "iCloud"],
    condition: (ans) => ans.subscriptionMode === "はい",
  },
  {
    section: "その他のサービス",
    id: "otherSubscriptions",
    question: "契約中または契約予定のその他サービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Adobe Creative Cloud",
      "Evernote Premium",
      "Dropbox Plus",
    ],
    condition: (ans) => ans.subscriptionMode === "はい",
  },
];
