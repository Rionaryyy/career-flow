// app/components/DiagnosisFlow/questions/paymentSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const paymentQuestions = [
  {
    id: "mainCard",
    question:
      "通信料金の支払いに利用できる方法を教えてください（複数選択可）\n※割引はクレジットカードまたは銀行口座引き落としが対象です",
    type: "checkbox" as const,
    options: [
      { label: "クレジットカード", value: "credit" },
      { label: "デビットカード", value: "debit" },
      { label: "銀行口座引き落とし", value: "bank" },
    ],
  },
  {
    id: "cardDetail",
    question:
      "通信料金の支払いに利用できるカード・銀行を選んでください（複数選択可）",
    type: "checkbox" as const,
    // ✅ options はダミー（実際は PaymentSection.tsx 側で上書き）
    options: [] as { label: string; value: string }[],
    // condition は TSX 側の showCardDetail ロジックで制御
  },
] satisfies {
  id: keyof DiagnosisAnswers;
  question: string;
  type: "checkbox";
  options: { label: string; value: string }[];
}[];
