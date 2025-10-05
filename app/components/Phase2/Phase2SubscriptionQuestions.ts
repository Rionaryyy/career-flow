// app/components/Phase2SubscriptionQuestions.ts
import { Phase2Answers } from "@/types/types";
import { Question } from "../layouts/types";

export const phase2SubscriptionQuestions: Question<Phase2Answers>[] = [
  {
    section: "動画配信サービス",
    id: "subscriptionServices",
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
      "特になし",
    ],
  },
  {
    section: "音楽配信サービス",
    id: "subscriptionServices",
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
      "特になし",
    ],
  },
  {
    section: "書籍・マンガ・雑誌",
    id: "subscriptionServices",
    question: "契約中または契約予定の書籍・雑誌サービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Kindle Unlimited",
      "dマガジン",
      "楽天マガジン",
      "LINEマンガ",
      "BookLive!",
      "特になし",
    ],
  },
  {
    section: "ゲーム・アニメ",
    id: "subscriptionServices",
    question: "契約中または契約予定のゲーム・アニメサービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Nintendo Switch Online",
      "PlayStation Plus",
      "dアニメストア",
      "Rakuten TV",
      "特になし",
    ],
  },
  {
    section: "クラウド・ストレージ・オフィス",
    id: "subscriptionServices",
    question: "契約中または契約予定のクラウド・ストレージ・オフィスサービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Google One",
      "Microsoft 365",
      "iCloud",
      "特になし",
    ],
  },
  {
    section: "その他のサービス",
    id: "subscriptionServices",
    question: "契約中または契約予定のその他サービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Adobe Creative Cloud",
      "Evernote Premium",
      "Dropbox Plus",
      "特になし",
    ],
  },
  {
    id: "subscriptionMonthly",
    question: "契約している（予定の）サブスクはキャリアセットでの割引を希望しますか？",
    type: "radio",
    options: [
      "はい（割引対象のキャリア・プランがあれば優先したい）",
      "いいえ（サブスクは別で契約する予定）",
    ],
    condition: (ans: Phase2Answers) => {
      const selected = ans.subscriptionServices;
      return Array.isArray(selected) && selected.length > 0 && !selected.includes("特になし");
    },
  },
];
