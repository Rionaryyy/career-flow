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
    // ✅ options はダミー（実際の候補は PaymentSection.tsx 側で上書き）
    options: [],
    type: "checkbox" as const,
    // condition は TSX 側で showCardDetail により制御される
  },
];
