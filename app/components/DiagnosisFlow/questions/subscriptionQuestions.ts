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
  },
  {
    section: "クラウド・ストレージ・オフィス",
    id: "cloudSubscriptions",
    question:
      "契約中または契約予定のクラウド・ストレージ・オフィスサービスを選択（複数可）",
    type: "checkbox",
    options: ["Google One", "Microsoft 365", "iCloud"],
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
  },
];
