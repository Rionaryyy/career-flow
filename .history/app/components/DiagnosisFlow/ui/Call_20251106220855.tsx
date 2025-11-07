"use client";

import QuestionCard from "../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { suggestCallPlan } from "@/utils/logic/callPlanAdvisor";
import ReactMarkdown from "react-markdown";
import { useMemo, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { FlowSectionProps } from "@/types/flowProps";

/** 枠スタイル（水色／二重枠） */
const outerCard = "bg-sky-50 border border-sky-300 rounded-2xl p-5 space-y-4";
const innerCard = "bg-sky-50 border border-sky-300 rounded-xl p-4";

/** QuestionCard と同じ“本文トーン”に揃える（色・サイズ・太さ） */
const bodyText = "text-gray-800 text-sm md:text-base leading-normal font-normal";

/** 選択肢ボタン（文字サイズもQuestionCardに合わせて text-sm ベース） */
const optBtnBase =
  "w-full text-left rounded-xl border px-4 py-3 transition select-none text-sm md:text-base";
const optBtnOn = "bg-sky-100 border-sky-600 text-gray-900 shadow-sm";
const optBtnOff = "bg-white border-sky-400 text-gray-900 hover:border-sky-500";

/** 追加質問のID分類 */
const isUnknownFollowupId = (id: string) =>
  ["unknownCallUsageDuration", "unknownCallFrequency", "needCallPlanConfirm"].includes(id);
const isYesFollowupId = (id: string) =>
  ["callPlanType", "timeLimitPreference", "monthlyLimitPreference", "hybridCallPreference"].includes(id);

function HeadingRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="text-sm md:text-base leading-none align-middle shrink-0 select-none"
      >
        {emoji}
      </span>
      <span className={bodyText}>{text}</span>
    </div>
  );
}

const Phase2Call = forwardRef(function Phase2Call(
  { answers, onChange, onNext, onBack }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= questions.length - 1;
    },
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const questions = useMemo(
    () => [
      {
        id: "needCallPlan",
        question: "かけ放題オプションを利用したいですか？",
        options: [
          "はい（利用したい）",
          "いいえ（使った分だけ支払いたい）",
          "よくわからない（おすすめを知りたい）",
        ],
        type: "radio" as const,
      },
      {
        id: "unknownCallUsageDuration",
        question: "1回あたりの通話時間に最も近いものを選んでください。",
        options: [
          "ほとんど通話しない（LINEなど中心）",
          "5分以内（短い確認や予約など）",
          "15分以内（家族・友人との通話が多い）",
          "30分以内（仕事や長めの通話が多い）",
          "30分以上（長時間・業務通話など）",
        ],
        type: "radio" as const,
        condition: (ans: DiagnosisAnswers) =>
          ans.needCallPlan === "よくわからない（おすすめを知りたい）",
      },
      {
        id: "unknownCallFrequency",
        question: "1週間あたりどのくらい通話しますか？",
        options: ["週1〜2回程度", "週3〜4回程度", "週5〜6回程度", "ほぼ毎日"],
        type: "radio" as const,
        condition: (ans: DiagnosisAnswers) =>
          ans.needCallPlan === "よくわからない（おすすめを知りたい）" &&
          !!ans.unknownCallUsageDuration,
      },
      {
        id: "needCallPlanConfirm",
        question: "上記アドバイスを参考に、かけ放題を利用したいですか？",
        options: ["はい（利用したい）", "いいえ（使った分だけ支払いたい）"],
        type: "radio" as const,
        condition: (ans: DiagnosisAnswers) =>
          ans.needCallPlan === "よくわからない（おすすめを知りたい）" &&
          !!ans.unknownCallUsageDuration &&
          !!ans.unknownCallFrequency,
      },
      {
        id: "callPlanType",
        question: "検討したいかけ放題タイプを選んでください（複数選択可）",
        options: [
          "1回あたりの通話時間に上限があるプラン（例：5分以内無料）",
          "月内の合計通話時間に上限があるプラン（例：月60分まで無料）",
          "月に決まった回数まで◯分通話できるプラン（例：月30回まで各10分無料）",
          "特にこだわらない（どれでも良い）",
        ],
        type: "checkbox" as const,
        condition: (ans: DiagnosisAnswers) =>
          ans.needCallPlan === "はい（利用したい）" ||
          ans.needCallPlanConfirm === "はい（利用したい）",
      },
      {
        id: "timeLimitPreference",
        question:
          "希望する時間制限型のかけ放題範囲を選んでください（※選択した時間より短いプランは比較対象外になります）",
        options: [
          "5分以内（短時間の通話が多い）",
          "10分以内（軽めの通話が多い）",
          "15分以内（中程度の通話が多い）",
          "30分以内（やや長めの通話）",
          "無制限（制限なくかけ放題）",
        ],
        type: "radio" as const,
        condition: (ans: DiagnosisAnswers) =>
          Array.isArray(ans.callPlanType) &&
          ans.callPlanType.some((t) => t.includes("1回あたり")),
      },
      {
        id: "monthlyLimitPreference",
        question:
          "希望する月間制限型の範囲を選んでください。（※選択した上限より少ない時間のプランは比較対象外になります）",
        options: ["月60分まで無料", "月70分まで無料", "月100分まで無料", "無制限（完全定額）"],
        type: "radio" as const,
        condition: (ans: DiagnosisAnswers) =>
          Array.isArray(ans.callPlanType) &&
          ans.callPlanType.some((t) => t.includes("合計通話時間")),
      },
      {
        id: "hybridCallPreference",
        question:
          "希望する回数＋時間制限型の範囲を選んでください。（※選択した上限より少ないプランは比較対象外になります）",
        options: [
          "月30回まで各10分無料（よくある定番タイプ）",
          "月50回まで各10分無料（通話回数が多い方向け）",
          "無制限（回数制限なし）",
        ],
        type: "radio" as const,
        condition: (ans: DiagnosisAnswers) =>
          Array.isArray(ans.callPlanType) &&
          ans.callPlanType.some((t) => t.includes("回数まで")),
      },
      {
        id: "needInternationalCallUnlimited",
        question: "海外へのかけ放題オプションは必要ですか？",
        options: ["はい", "いいえ"],
        type: "radio" as const,
      },
      {
        id: "internationalCallCarrier",
        question:
          "⚠️ 現在、海外通話かけ放題に対応しているのは以下のキャリアのみです。希望するものを選択してください（複数選択可）\n\n※ここで選択したキャリアのみ、以降のプラン比較に反映されます。",
        options: [
          "楽天モバイル（国際通話かけ放題：¥980/月・65カ国対象）",
          "au（国際通話定額：月900分・23カ国対象）",
        ],
        type: "checkbox" as const,
        condition: (ans: DiagnosisAnswers) => ans.needInternationalCallUnlimited === "はい",
      },
      {
        id: "callOptionsNeeded",
        question: "留守番電話のオプションは必要ですか？",
        options: ["はい（必要）", "いいえ（不要）"],
        type: "radio" as const,
      },
    ],
    []
  );

  const currentQuestion = questions[currentIndex];
  const showAdvice =
    answers.needCallPlan === "よくわからない（おすすめを知りたい）" &&
    answers.unknownCallUsageDuration &&
    answers.unknownCallFrequency;

  const suggestion =
    showAdvice &&
    suggestCallPlan({
      callDuration: answers.unknownCallUsageDuration,
      callFrequencyPerWeek: answers.unknownCallFrequency,
    } as DiagnosisAnswers);

  /** 🔹 単一質問ページ表示（追加質問は同一ページで展開） */
  return (
    <div className="w-full py-6 space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {/* 通常質問を表示 */}
          <QuestionCard
            id={currentQuestion.id}
            question={currentQuestion.question}
            options={currentQuestion.options}
            type={currentQuestion.type}
            value={answers[currentQuestion.id as keyof DiagnosisAnswers] as string}
            onChange={(id, value) => onChange({ [id]: value })}
            answers={answers}
          />

          {/* 条件付き追加質問を同ページ内に展開 */}
          {questions
            .filter((q) => q.condition && q.condition(answers))
            .filter((q) => q.id !== currentQuestion.id)
            .map((q) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-4 pl-4 border-l-4 border-sky-200"
              >
                <QuestionCard
                  id={q.id}
                  question={q.question}
                  options={q.options}
                  type={q.type}
                  value={answers[q.id as keyof DiagnosisAnswers] as string}
                  onChange={(id, value) => onChange({ [id]: value })}
                  answers={answers}
                />
              </motion.div>
            ))}

          {/* アドバイスがある場合のみ同ページで表示 */}
          {suggestion && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-5 text-gray-800 space-y-4 mt-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm md:text-base leading-none align-middle">📞</span>
                <h3 className="font-semibold text-gray-900">通話プランアドバイス</h3>
              </div>
              <ReactMarkdown
                components={{
                  p: (props) => (
                    <p
                      {...props}
                      className="mb-2 leading-relaxed text-gray-800 text-sm md:text-base"
                    />
                  ),
                  strong: (props) => (
                    <strong {...props} className="text-gray-900 font-semibold" />
                  ),
                }}
              >
                {suggestion as string}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {/* 🐾 にゃんこナビゲーション制御へ統合：ページ内ボタン削除 */}
    </div>
  );
});

export default Phase2Call;
