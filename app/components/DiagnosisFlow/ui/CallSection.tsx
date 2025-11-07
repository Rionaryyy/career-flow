"use client";

import { useState, forwardRef, useImperativeHandle, useMemo, useEffect } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { motion } from "framer-motion";
import { suggestCallPlan } from "@/utils/logic/callPlanAdvisor";
import ReactMarkdown from "react-markdown";
import { callQuestions } from "../questions/callSection";

const outerCard =
  "bg-sky-50 border border-sky-300 rounded-2xl p-5 space-y-4 mt-4";
const bodyText =
  "text-gray-800 text-sm md:text-base leading-normal font-normal";

export default forwardRef(function CallSection(
  {
    answers,
    onChange,
    onNext,
  }: {
    answers: DiagnosisAnswers;
    onChange: (updated: Partial<DiagnosisAnswers>) => void;
    onNext?: () => void;
  },
  ref
) {
  const [page, setPage] = useState(0);

  // 🔹 デバッグログ（どの質問を読み込んでいるか確認用）
  console.log("🧩 callQuestions 読み込み確認:", callQuestions.map((q) => q.id));

  // === 🔹 外部制御用（DiagnosisFlowから呼ばれる） ===
  useImperativeHandle(ref, () => ({
    goNext() {
      if (page < 2) setPage((p) => p + 1);
      else onNext && onNext();
    },
    isCompleted() {
      return page >= 2;
    },
    getCurrentIndex() {
      return page;
    },
    setCurrentIndex(i: number) {
      setPage(i);
    },
  }));

  // === 質問変更時 ===
  const handleChange = (
    id: keyof DiagnosisAnswers,
    value: string | number | string[]
  ) => {
    const updated: Partial<DiagnosisAnswers> = {};
    updated[id] = value as any;
    onChange(updated);
  };

  // === アドバイス表示判定 ===
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

  // === ページごとの質問セット ===
  const domesticQuestions = [
    "needCallPlan",
    "unknownCallUsageDuration",
    "unknownCallFrequency",
    "needCallPlanConfirm",
    "callPlanType",
    "timeLimitPreference",
    "monthlyLimitPreference",
    "hybridCallPreference",
  ];

  const overseasQuestions = [
    "needInternationalCallUnlimited",
    "internationalCallCarrier",
  ];

  const voicemailQuestions = ["callOptionsNeeded"];

  // === ページ切り替えに応じて対象IDを選択 ===
  const currentQuestions = useMemo(() => {
    const set =
      page === 0
        ? domesticQuestions
        : page === 1
        ? overseasQuestions
        : voicemailQuestions;

    console.log("📄 現在のページ:", page, " / 表示対象ID:", set);
    return set.map((s) => s.trim());
  }, [page]);

  // === 質問抽出（全角・半角スペースを無視して一致判定） ===
  const currentQs = callQuestions.filter((q) =>
    currentQuestions.some(
      (id) =>
        q.id.replace(/\s+/g, "") === id.replace(/\s+/g, "")
    )
  );

  console.log("🎯 現在の質問リスト:", currentQs.map((q) => q.id));

  // === ページ遷移時にスクロールトップへ ===
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="w-full py-6 space-y-6">
      {/* === デバッグ時: 質問が見つからない場合 === */}
      {currentQs.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          ❗質問が見つかりません（page: {page} / targetIds:{" "}
          {currentQuestions.join(", ")}）
        </p>
      )}

      {/* === 各質問を描画 === */}
      {currentQs.map((q) => {
        if (q.condition && !q.condition(answers)) return null;

        // --- よくわからないルート + アドバイス表示 ---
        if (q.id === "unknownCallFrequency" && showAdvice) {
          return (
            <motion.div key={q.id} className={outerCard}>
              <p className={`${bodyText} mb-3`}>{q.question}</p>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  className="block w-full text-left border rounded-lg p-3 my-1"
                  onClick={() =>
                    handleChange(q.id as keyof DiagnosisAnswers, opt)
                  }
                >
                  {opt}
                </button>
              ))}
              <div className="bg-white border border-gray-200 rounded-xl p-4 mt-3">
                <ReactMarkdown>{suggestion}</ReactMarkdown>
              </div>
            </motion.div>
          );
        }

        // --- 通常カード ---
        return (
          <motion.div key={q.id} className="mt-2">
            <QuestionCard
              id={q.id}
              question={q.question}
              options={q.options}
              type={q.type}
              value={
                (answers[q.id as keyof DiagnosisAnswers] as string | null) ?? ""
              }
              onChange={handleChange}
              answers={answers}
            />
          </motion.div>
        );
      })}
    </div>
  );
});
