"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Ecosystem({ answers, onChange }: Props) {
  const questions = [
    {
      id: "shoppingList",
      question: "現在よく利用している、または「還元条件が良ければ今後利用してもよい」と思う日々のショッピングはどれですか？",
      options: [
        "楽天市場・楽天ブックス・楽天トラベルなど（楽天経済圏）",
        "Yahoo!ショッピング・PayPayモールなど（PayPay / ソフトバンク経済圏）",
        "LOHACO・au PAY加盟店・au Wowma!など（au PAY / Ponta経済圏）",
        "どれが一番お得か分からないので、すべてのパターンを比較したい",
        "特になし",
      ],
      type: "radio" as const,
    },
    {
      id: "shoppingMonthly",
      question: "現在よく利用している、または「還元条件が良ければ今後利用してもよい」と思う日々の支払い方法はどれですか？",
      options: ["〜5,000円", "5,000〜10,000円", "10,000〜30,000円", "30,000〜50,000円", "50,000円以上", "まだわからない"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) =>
        typeof ans.shoppingList === "string" && ans.shoppingList !== "特になし",
    },
    {
      id: "paymentList",
      question: "3. よく利用している支払い方法は？",
      options: [
        "楽天Pay / 楽天カード（楽天経済圏）",
        "d払い / dカード（dポイント経済圏）",
        "PayPay / ペイペイカード（PayPay経済圏）",
        "au PAY / au PAYカード（Ponta経済圏）",
        "どれが一番お得か分からないので、すべてのパターンを比較したい",
        "特になし",
      ],
      type: "radio" as const,
    },
    {
      id: "paymentMonthly",
      question: "4. 月間利用額は？",
      options: ["〜5,000円", "5,000〜10,000円", "10,000〜30,000円", "30,000〜50,000円", "50,000円以上", "まだわからない"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) =>
        typeof ans.paymentList === "string" && ans.paymentList !== "特になし",
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => {
        if (q.condition && !q.condition(answers)) return null;

        const currentValue = answers[q.id as keyof Phase2Answers] as string | null;

        return (
          <QuestionCard
            key={q.id}
            id={q.id}
            question={q.question}
            options={q.options}
            type={q.type}
            value={currentValue}
            onChange={handleChange}
            answers={answers}
          />
        );
      })}
    </div>
  );
}
