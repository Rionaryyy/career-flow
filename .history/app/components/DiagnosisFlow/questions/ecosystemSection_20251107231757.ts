import { DiagnosisAnswers } from "@/types/types";

export const ecosystemQuestions = [
  {
    id: "shoppingEcosystem",
    question: "普段よく利用しているショッピングサイト・経済圏を選択してください（複数選択可）",
    options: [
      "楽天市場・楽天ブックス・楽天トラベルなど（楽天経済圏）",
      "Yahoo!ショッピング・PayPayモール・LOHACOなど（PayPay / ソフトバンク経済圏）",
      "au PAYマーケット・au Wowma!など（au PAY / Ponta経済圏）",
      "どれが一番お得か分からないので、すべてのパターンを比較したい",
      "特になし",
    ],
    type: "checkbox" as const,
  },
  {
    id: "monthlyShoppingSpend",
    parentId: "shoppingEcosystem", // ✅ 追加：親質問を指定
    question: "選択したショッピング先での月間利用額を教えてください（概算）",
    type: "slider" as const,
    min: 0,
    max: 200000,
    step: 1000,
    unit: "円",
    condition: (ans: DiagnosisAnswers) =>
      Array.isArray(ans.shoppingEcosystem) &&
      ans.shoppingEcosystem.length > 0 &&
      !ans.shoppingEcosystem.includes("特になし"),
  },
];
