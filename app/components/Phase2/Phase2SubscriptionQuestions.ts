// app/components/Phase2SubscriptionQuestions.ts
import { Phase2Answers } from "@/types/types";
import { Question } from "../layouts/types";

export const phase2SubscriptionQuestions: Question<Phase2Answers>[] = [
  {
    id: "subscriptionServices",
    question: "契約中または契約予定のサブスクサービスを選択（複数可）",
    type: "checkbox",
    options: [
      "Netflix",
      "Amazon Prime",
      "YouTube Premium",
      "Apple Music",
      "Disney+",
      "LINE MUSIC",
      "DAZN",
      "DMM TV / DMMプレミアム",
      "Spotify",
      "ABEMA プレミアム",
      "U-NEXT",
      "TELASA（テラサ）",
      "特になし",
    ],
  },
  {
    id: "subscriptionMonthly",
    question: "Q9-2. 契約している（予定の）サブスクはキャリアセットでの割引を希望しますか？",
    type: "radio",
    options: [
      "はい（割引対象のキャリア・プランがあれば優先したい）",
      "いいえ（サブスクは別で契約する予定）",
    ],
    condition: (ans: Phase2Answers) =>
      !!ans.subscriptionServices &&
      ans.subscriptionServices.length > 0 &&
      !ans.subscriptionServices.includes("特になし"),
  },
];
