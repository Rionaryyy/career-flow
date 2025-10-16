// app/components/Phase2SubscriptionQuestions.ts
import { Phase2Answers } from "@/types/types";
import { Question } from "../layouts/types";

export const phase2SubscriptionQuestions: Question<Phase2Answers>[] = [
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
    question: "契約中または契約予定のクラウド・ストレージ・オフィスサービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Google One",
      "Microsoft 365",
      "iCloud",
    ],
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
  {
    id: "subscriptionMonthly",
    question: "選択したサブスクリプションに対して、キャリアセット割引を希望しますか？",
    type: "radio",
    options: [
      "はい（割引対象のキャリア・プランがあれば適用したい）",
      "いいえ（サブスクは別で契約する予定）",
    ],
    condition: (ans: Phase2Answers) => {
      const allSelected = [
        ans.videoSubscriptions,
        ans.musicSubscriptions,
        ans.bookSubscriptions,
        ans.gameSubscriptions,
        ans.cloudSubscriptions,
        ans.otherSubscriptions,
      ].flatMap((v) => (Array.isArray(v) ? v : []));
      // 「特になし」がないので単純に1つでも選択されていれば表示
      return allSelected.length > 0;
    },
  },
];
