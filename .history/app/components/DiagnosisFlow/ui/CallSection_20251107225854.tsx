"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { motion } from "framer-motion";
import { suggestCallPlan } from "@/utils/logic/callPlanAdvisor";
import ReactMarkdown from "react-markdown";
import { callQuestions } from "../questions/callSection";

const outerCard = "bg-sky-50 border border-sky-300 rounded-2xl p-5 space-y-4 mt-4";
const bodyText = "text-gray-800 text-sm md:text-base leading-normal font-normal";

export default forwardRef(function CallSection(
  { answers, onChange, onNext }: { answers: DiagnosisAnswers; onChange: (updated: Partial<DiagnosisAnswers>) => void; onNext?: () => void },
  ref
) {
  const [page, setPage] = useState(0);

  useImperativeHandle(ref, () => ({
    goNext() {
      if (page === 0) setPage(1);
      else if (page === 1) setPage(2);
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

  const handleChange = (id: keyof DiagnosisAnswers, value: string | number | string[]) => {
    const updated: Partial<DiagnosisAnswers> = {};
    updated[id] = value as any;
    onChange(updated);
  };

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

  /** ===============================
   *   ページごとの質問セット
   * =============================== */
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

  const overseasQuestions = ["needInternationalCallUnlimited", "internationalCallCarrier"];

  const voicemailQuestions = ["callOptionsNeeded"]; // ✅ 明示的に指定

  const currentIds =
    page === 0 ? domesticQuestions : page === 1 ? overseasQuestions : voicemailQuestions;

  const currentQs = callQuestions.filter((q) => currentIds.includes(q.id));

  /** ===============================
   *   ページレンダリング
   * =============================== */
  return (
    <div className="w-full py-6 space-y-6">
      {currentQs.length === 0 && (
        <p className="text-gray-500 text-center mt-6">質問が見つかりません。</p>
      )}

      {currentQs.map((q) => {
        // 条件が false の場合は描画スキップ
        if (q.condition && !q.condition(answers)) return null;

        // 🔹 「わからない」ルートの特別カード
        if (q.id === "unknownCallFrequency" && showAdvice) {
          return (
            <motion.div key={q.id} className={outerCard}>
              <p className={`${bodyText} mb-3`}>{q.question}</p>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  className="block w-full text-left border rounded-lg p-3 my-1"
                  onClick={() => handleChange(q.id as keyof DiagnosisAnswers, opt)}
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

        // 🔹 通常の質問カード
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
