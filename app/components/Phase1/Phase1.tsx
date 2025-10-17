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
      "大手キャリア（ドコモ / au / ソフトバンク / 楽天）",
      "サブブランド（ahamo / povo / LINEMO / UQなど）もOK",
      "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい",
    ],
  },
  {
    id: "networkQuality",
    question: "通信品質（速度・安定性）はどの程度重視しますか？",
    type: "radio",
    options: [
      "とても重視する（大手キャリア水準が望ましい）",
      "ある程度重視する（格安でも安定していればOK）",
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
      "キャリアの通話アプリ（例：楽天リンクなど）を使った通話も、“かけ放題”に含めてよいですか？",
    type: "radio",
    options: [
      "はい（アプリ経由ならかけ放題として扱う）",
      "いいえ（通常プランのかけ放題のみを考慮する）",
    ],
  },
  // 🟦 新質問：契約方法（店頭 or オンライン）
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
  // 🟦 料金比較基準
  {
    id: "compareAxis",
    question: "料金を比べるとき、どんな基準で比べたいですか？",
    type: "radio",
    options: [
      " 毎月の支払い額だけで比べたい\n　（初期費用やキャッシュバックは含めず、毎月の料金をシンプルに比較します。）",
      " 実際に支払う金額で比べたい\n　（初期費用やキャッシュバックも含めて、トータルの支出を月あたりで平均化して比べます。）",
    ],
  },
  // 🟦 分岐質問：実質月額を選んだ場合のみ表示
  {
    id: "comparePeriod",
    question:
      "比較したい期間を選んでください（初期費用とキャッシュバックを平均化します）",
    type: "radio",
    options: ["1年（12ヶ月）", "2年（24ヶ月）", "3年（36ヶ月）"],
    condition: (answers: Phase1Answers) =>
      answers.compareAxis?.startsWith("💰 実際に支払う金額"),
  },
];

export default function Phase1({ defaultValues, onSubmit, onBack }: Phase1Props) {
  const [answers, setAnswers] = React.useState<Phase1Answers>(defaultValues);

  const handleChange = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value as string }));
  };

  // --- 進捗カウント ---
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const totalCount = phase1Questions.length;
  // -------------------

  return (
    <QuestionLayout answeredCount={answeredCount} totalCount={totalCount}>
      {/* 画面上部にタイトル */}
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">
        基本条件
      </h1>

      {/* 質問リスト */}
      <div className="space-y-6 w-full">
        {phase1Questions.map((q) => {
          // 分岐条件ありの場合、表示を制御
          if (q.condition && !q.condition(answers)) return null;

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

      {/* 次へボタン */}
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
