// app/components/DiagnosisFlow/questions/overseasSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const overseasQuestions = [
  {
    id: "overseasSupport",
    question:
      "海外でスマホを使うことがある場合、ローミングプランが用意されているキャリアを希望しますか？",
    type: "radio" as const,
    options: [
      { label: "はい（海外旅行・出張などでも使いたい）", value: "yes" },
      { label: "いいえ（国内利用がメイン）", value: "no" },
    ],
    note: "※「はい」を選ぶと、ローミングプランを提供していないキャリアは除外されます。",
  },
] satisfies {
  id: keyof DiagnosisAnswers;
  question: string;
  type: "radio";
  options: { label: string; value: string }[];
  note?: string;
}[];
