// app/components/DiagnosisFlow/questions/subscriptionSection.ts
import { DiagnosisAnswers, Question } from "@/types/types";

/**
 * Phase2: サブスクリプション関連質問一覧
 * SubscriptionAccordion と SubscriptionSection 共通利用
 */
export const subscriptionQuestions: Question<DiagnosisAnswers>[] = [
  {
    section: "動画配信サービス",
    id: "videoSubscriptions",
    question: "契約中または契約予定の動画サービスを選択（複数可）",
    type: "checkbox",
    options: [
      { label: "Netflix", value: "netflix" },
      { label: "Amazon Prime Video", value: "prime_video" },
      { label: "dTV", value: "dtv" },
      { label: "Hulu", value: "hulu" },
      { label: "U-NEXT", value: "unext" },
      { label: "Paravi", value: "paravi" },
      { label: "TELASA（テラサ）", value: "telasa" },
      { label: "FOD Premium", value: "fod" },
      { label: "ABEMA プレミアム", value: "abema" },
      { label: "DMM TV / DMMプレミアム", value: "dmm" },
    ],
  },
  {
    section: "音楽配信サービス",
    id: "musicSubscriptions",
    question: "契約中または契約予定の音楽サービスを選択（複数可）",
    type: "checkbox",
    options: [
      { label: "Apple Music", value: "apple_music" },
      { label: "Spotify", value: "spotify" },
      { label: "LINE MUSIC", value: "line_music" },
      { label: "Amazon Music Unlimited", value: "amazon_music" },
      { label: "YouTube Music Premium", value: "youtube_music" },
      { label: "AWA", value: "awa" },
      { label: "Rakuten Music", value: "rakuten_music" },
    ],
  },
  {
    section: "書籍・マンガ・雑誌",
    id: "bookSubscriptions",
    question: "契約中または契約予定の書籍・雑誌サービスを選択（複数可）",
    type: "checkbox",
    options: [
      { label: "Kindle Unlimited", value: "kindle" },
      { label: "dマガジン", value: "dmagazine" },
      { label: "楽天マガジン", value: "rakuten_magazine" },
      { label: "LINEマンガ", value: "line_manga" },
      { label: "BookLive!", value: "booklive" },
    ],
  },
  {
    section: "ゲーム・アニメ",
    id: "gameSubscriptions",
    question: "契約中または契約予定のゲーム・アニメサービスを選択（複数可）",
    type: "checkbox",
    options: [
      { label: "Nintendo Switch Online", value: "switch_online" },
      { label: "PlayStation Plus", value: "ps_plus" },
      { label: "dアニメストア", value: "danime" },
      { label: "Rakuten TV", value: "rakuten_tv" },
    ],
  },
  {
    section: "クラウド・ストレージ・オフィス",
    id: "cloudSubscriptions",
    question:
      "契約中または契約予定のクラウド・ストレージ・オフィスサービスを選択（複数可）",
    type: "checkbox",
    options: [
      { label: "Google One", value: "google_one" },
      { label: "Microsoft 365", value: "microsoft_365" },
      { label: "iCloud", value: "icloud" },
    ],
  },
  {
    section: "その他のサービス",
    id: "otherSubscriptions",
    question: "契約中または契約予定のその他サービスを選択（複数可）",
    type: "checkbox",
    options: [
      { label: "Adobe Creative Cloud", value: "adobe" },
      { label: "Evernote Premium", value: "evernote" },
      { label: "Dropbox Plus", value: "dropbox" },
    ],
  },
];
