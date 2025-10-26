"use client";

import React from "react";
import { Phase1Answers } from "@/types/types";
import QuestionLayout from "../layouts/QuestionLayout";
import QuestionCard from "../layouts/QuestionCard";

export interface Phase1Props {
  defaultValues: Phase1Answers;
  onSubmit: (answers: Phase1Answers) => void;
  onBack?: () => void;
}

const phase1Questions = [
  {
    id: "carrierType",
    question: "キャリアの種類に希望はありますか？",
    type: "radio",
    options: [
      "大手キャリアのみで検討したい（ドコモ / au / ソフトバンク / 楽天）",
      "サブブランドも含めて検討したい（ahamo / povo / LINEMO / UQなど）",
      "格安SIMも含めて検討したい（IIJ / mineo / NUROなど）",
    ],
  },
  {
    id: "networkQuality",
    question: "通信品質（速度・安定性）はどの程度重視しますか？",
    type: "radio",
    options: [
      "とても重視する（大手キャリア水準）",
      "ある程度重視する（サブブランド水準以上）",
      "こだわらない（コスト最優先）",
    ],
  },
  {
    id: "includePoints",
    question: "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
    type: "radio",
    options: [
      "はい（ポイントも含めて最安を知りたい）",
      "いいえ（現金支出だけで比べたい）",
    ],
  },
  {
    id: "considerCardAndPayment",
    question:
      "お得になるなら、専用クレジットカードの発行や特定の支払い方法の利用も検討しますか？",
    type: "radio",
    options: [
      "はい（条件次第でカード発行・支払い方法の変更もOK）",
      "いいえ（今ある支払い方法の範囲で考えたい）",
    ],
  },
  {
    id: "appCallUnlimited",
    question:
      "各社提供の通話アプリ経由の通話も、かけ放題の対象に含めてよいですか？（例：楽天リンク）",
    type: "radio",
    options: [
      "はい（アプリ経由ならかけ放題として扱う）",
      "いいえ（通常プランのかけ放題のみを考慮する）",
    ],
  },
  {
    id: "contractMethod",
    question: "契約はどの方法で行いたいですか？",
    type: "radio",
    options: [
      "店頭で申し込みたい（店舗スタッフに相談しながら）",
      "オンラインで申し込みたい（Web手続きで完結したい）",
      "どちらでも構わない（条件が良い方を優先）",
    ],
  },
  {
    id: "compareAxis",
    question: "料金を比べるとき、どんな基準で比べたいですか？",
    type: "radio",
    options: [
      "毎月の支払い額だけで比べたい\n　（初期費用やキャッシュバックは含めず、毎月の料金をシンプルに比較します。）",
      "実際に支払う金額で比べたい\n　（初期費用やキャッシュバックも含めて、トータルの支出を月あたりで平均化して比べます。）",
    ],
  },
  // 分岐表示：compareAxis が「実際に支払う金額」を含むとき
  {
    id: "comparePeriod",
    question:
      "比較したい期間を選んでください（初期費用とキャッシュバックを平均化します）",
    type: "radio",
    options: ["1年（12ヶ月）", "2年（24ヶ月）", "3年（36ヶ月）"],
    condition: (answers: Phase1Answers) =>
      answers.compareAxis?.includes("実際に支払う金額"),
  },
];

export default function Phase1({ defaultValues, onSubmit, onBack }: Phase1Props) {
  const [answers, setAnswers] = React.useState<Phase1Answers>(defaultValues);

  const handleChange = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value as string }));
  };

  const answeredCount = 1;
  const totalCount = 9;

  return (
    <QuestionLayout answeredCount={answeredCount} totalCount={totalCount}>
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">基本条件</h1>

      <div className="space-y-6 w-full">
        {phase1Questions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          // 参考コードと同じ構成：外枠ボックス内に見出し(h3)＋QuestionCard
          if (q.id === "comparePeriod") {
            return (
              <div
                key={q.id}
                className="w-full bg-sky-50 border border-sky-200 rounded-2xl p-5 space-y-4"
              >
                <h3 className="text-sky-700 font-semibold text-base">
                  「実際に支払う金額で比べたい」に関する追加質問
                </h3>
                <QuestionCard
                  id={q.id}
                  question={q.question}
                  options={q.options}
                  type={q.type as "radio" | "checkbox"}
                  value={answers[q.id as keyof Phase1Answers] as string}
                  onChange={handleChange}
                />
              </div>
            );
          }

          return (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q.question}
              options={q.options}
              type={q.type as "radio" | "checkbox"}
              value={answers[q.id as keyof Phase1Answers] as string}
              onChange={handleChange}
            />
          );
        })}
      </div>

      <div className="flex justify-end pt-6 w-full max-w-4xl">
        <button
          onClick={() => onSubmit(answers)}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-lg font-semibold text-white shadow-md transition-all duration-200"
        >
          次へ →
        </button>
      </div>
    </QuestionLayout>
  );
}
