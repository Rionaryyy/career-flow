// app/components/DiagnosisFlow/questions/contractSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const contractQuestions = [
  {
    id: "familyLines",
    question: "家族割引を適用できる回線数はいくつですか？",
    options: [
      "2回線(本人＋家族1人)",
      "3回線(本人＋家族2人)",
      "4回線以上",
      "適用できない/わからない",
    ],
    type: "radio" as const,
  },
  {
    id: "ageGroup",
    question: "年齢を教えてください",
    options: ["18歳以下", "25歳以下", "30歳以下", "60歳以上", "該当しない"],
    type: "radio" as const,
  },
  {
    id: "setDiscount",
    question:
      "キャリア契約時に、新規契約または乗り換え可能なサービスはありますか？（複数選択可）",
    options: [
      "光回線の契約",
      "電気のセット契約",
      "ガスのセット契約",
      "ルーター購入・レンタル",
      "ポケットWi-Fi契約",
    ],
    type: "checkbox" as const,
  },
  {
    id: "childUnder12Plan",
    question:
      "追加で、12歳以下向け子ども専用プランでスマホ契約をする予定はありますか？",
    options: ["はい", "いいえ"],
    type: "radio" as const,
    note: "※ 子ども専用プランは大手キャリアのみ提供されます",
  },
];
