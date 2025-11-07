// app/components/DiagnosisFlow/questions/paymentSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const paymentQuestions = [
  {
    id: "mainCard",
    question:
      "通信料金の支払いに利用できる方法を教えてください（複数選択可）\n※割引はクレジットカードまたは銀行口座引き落としが対象です",
    options: ["クレジットカード", "デビットカード", "銀行口座引き落とし"],
    type: "checkbox" as const,
  },
  {
    id: "cardDetail",
    question:
      "通信料金の支払いに利用できるカード・銀行を選んでください（複数選択可）",
    options: [
      "dカード",
      "dカード GOLD",
      "au PAYカード",
      "au PAYカード GOLD",
      "ソフトバンクカード",
      "ソフトバンクカード GOLD",
      "楽天カード",
      "楽天カード GOLD",
      "PayPayカード",
      "三井住友カード",
      "IIJmioクレジットカード",
      "mineoクレジットカード",
      "UQカード",
      "NUROモバイルクレジットカード",
      "その他",
      "みずほ銀行",
      "三井住友銀行",
      "三菱UFJ銀行",
      "その他",
    ],
    type: "checkbox" as const,
    // condition は TSX 側で showCardDetail により制御される
  },
];
