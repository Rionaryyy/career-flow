"use client";

import React, { useState, useEffect } from "react";
import { DiagnosisAnswers } from "../../../types/types";
import QuestionCard from "../layouts/QuestionCard";
import { FlowSectionProps } from "@/types/flowProps";

/**
 * 統合後: 基本条件質問セクション（旧Phase1）
 * - compareAxisで「実際に支払う金額」を選ぶと同じページ内でcomparePeriodを展開
 * - にゃんこボタン・進捗バーは上位コンポーネントで制御
 */
const basicQuestions = [
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
    id: "includeSubscription",
    question:
      "契約予定のサブスクリプション料金や割引も“実質料金”に含めて比較しますか？",
    type: "radio",
    options: [
      "はい（通信＋サブスクの実質料金で比較したい）",
      "いいえ（通信料金のみで比較したい）",
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
];

export default function BasicConditions({
  answers,
  onChange,
  onNext,
  onBack,
}: FlowSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (id: string, value: string | number | string[]) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const handleNext = () => {
    const next = currentIndex + 1;
    if (next < basicQuestions.length) {
      setCurrentIndex(next);
    } else {
      onNext && onNext();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else onBack && onBack();
  };

  const q = basicQuestions[currentIndex];

  return (
    <section className="calico-bg rounded-[1.25rem] p-5">
      <div className="space-y-6 w-full">
        <QuestionCard
          key={q.id}
          id={q.id}
          question={q.question}
          options={q.options}
          type={q.type as "radio" | "checkbox"}
          value={answers[q.id as keyof DiagnosisAnswers] as string}
          onChange={handleChange}
        />

        {/* compareAxis のときに comparePeriod を同ページで表示 */}
        {q.id === "compareAxis" &&
          answers.compareAxis?.includes("実際に支払う金額") && (
            <div className="mt-4 pl-4 border-l-4 border-sky-200">
              <QuestionCard
                id="comparePeriod"
                question="比較したい期間を選んでください（初期費用とキャッシュバックを平均化します）"
                type="radio"
                options={["1年（12ヶ月）", "2年（24ヶ月）", "3年（36ヶ月）"]}
                value={answers.comparePeriod ?? ""}
                onChange={handleChange}
              />
            </div>
          )}
      </div>

      {/* 🐾 ページ内ナビゲーション */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-lg text-sm ${
            currentIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-sky-700 hover:text-sky-800"
          }`}
        >
          ← 戻る
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg text-sky-700 hover:text-sky-800 text-sm"
        >
          {currentIndex === basicQuestions.length - 1 ? "次へ" : "次へ →"}
        </button>
      </div>
    </section>
  );
}
