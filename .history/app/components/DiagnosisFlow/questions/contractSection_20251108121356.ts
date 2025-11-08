// app/components/DiagnosisFlow/questions/contractSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const contractQuestions = [
  {
    id: "familyLines",
    question: "家族割引を適用できる回線数はいくつですか？",
    type: "radio" as const,
    options: [
      { label: "2回線(本人＋家族1人)", value: "2lines" },
      { label: "3回線(本人＋家族2人)", value: "3lines" },
      { label: "4回線以上", value: "4plus" },
      { label: "適用できない/わからない", value: "unknown" },
    ],
  },
  {
    id: "ageGroup",
    question: "年齢を教えてください",
    type: "radio" as const,
    options: [
      { label: "18歳以下", value: "under18" },
      { label: "25歳以下", value: "under25" },
      { label: "30歳以下", value: "under30" },
      { label: "60歳以上", value: "over60" },
      { label: "該当しない", value: "none" },
    ],
  },
  {
    id: "setDiscount",
    question:
      "キャリア契約時に、新規契約または乗り換え可能なサービスはありますか？（複数選択可）",
    type: "checkbox" as const,
    options: [
      { label: "光回線の契約", value: "fiber" },
      { label: "電気のセット契約", value: "electric" },
      { label: "ガスのセット契約", value: "gas" },
      { label: "ルーター購入・レンタル", value: "router" },
      { label: "ポケットWi-Fi契約", value: "pocketwifi" },
    ],
  },
  {
    id: "childUnder12Plan",
    question:
      "追加で、12歳以下向け子ども専用プランでスマホ契約をする予定はありますか？",
    type: "radio" as const,
    options: [
      { label: "はい", value: "yes" },
      { label: "いいえ", value: "no" },
    ],
    note: "※ 子ども専用プランは大手キャリアのみ提供されます",
  },
] satisfies {
  id: keyof DiagnosisAnswers;
  question: string;
  type: "radio" | "checkbox";
  options: { label: string; value: string }[];
  note?: string;
}[];
