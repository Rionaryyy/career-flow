// app/components/DiagnosisFlow/questions/overseasSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const overseasQuestions = [
  {
    id: "overseasSupport",
    question:
      "海外でスマホを使うことがある場合、ローミングプランが用意されているキャリアを希望しますか？",
    options: [
      "はい（海外旅行・出張などでも使いたい）",
      "いいえ（国内利用がメイン）",
    ],
    type: "radio" as const,
    note: "※「はい」を選ぶと、ローミングプランを提供していないキャリアは除外されます。",
  },
];
