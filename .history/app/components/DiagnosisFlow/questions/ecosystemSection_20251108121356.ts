// app/components/DiagnosisFlow/questions/ecosystemSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const ecosystemQuestions = [
  {
    id: "monthlyBarcodeSpend",
    question:
      "月あたりバーコード決済はいくら使いますか？（PayPay、楽天ペイ、au PAYなど）",
    type: "slider" as const,
    min: 1000,
    max: 200000,
    step: 1000,
    unit: "円",
    options: [],
  },
  {
    id: "shoppingEcosystem",
    question:
      "利用している、または利用してもよい日々のショッピング先を選んでください（複数選択可）",
    type: "checkbox" as const,
    options: [
      {
        label:
          "楽天市場・楽天ブックス・楽天トラベルなど（楽天経済圏）",
        value: "rakuten",
      },
      {
        label:
          "Yahoo!ショッピング・PayPayモール・LOHACOなど（PayPay / ソフトバンク経済圏）",
        value: "paypay",
      },
      {
        label:
          "au PAYマーケット・au Wowma!など（au PAY / Ponta経済圏）",
        value: "aupay",
      },
      {
        label:
          "どれが一番お得か分からないので、すべてのパターンを比較したい",
        value: "compare_all",
      },
      { label: "特になし", value: "none" },
    ],
  },
  {
    id: "monthlyShoppingSpend",
    parentId: "shoppingEcosystem",
    question:
      "選択したショッピング先での月あたりの想定利用額をスライダーで選んでください",
    type: "slider" as const,
    min: 1000,
    max: 200000,
    step: 1000,
    unit: "円",
    options: [],
    condition: (ans: DiagnosisAnswers) =>
      Array.isArray(ans.shoppingEcosystem) &&
      !ans.shoppingEcosystem.includes("none"),
  },
] satisfies {
  id: keyof DiagnosisAnswers;
  question: string;
  type: "slider" | "checkbox";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  parentId?: string;
  options: { label: string; value: string }[];
  condition?: (ans: DiagnosisAnswers) => boolean;
}[];
