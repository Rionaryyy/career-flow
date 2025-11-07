"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { motion } from "framer-motion";
import { suggestCallPlan } from "@/utils/logic/callPlanAdvisor";
import ReactMarkdown from "react-markdown";
import { callQuestions } from "../questions/callSection";

const outerCard =
  "bg-sky-50 border border-sky-300 rounded-2xl p-5 space-y-4 mt-4";
const innerCard =
  "bg-sky-50 border border-sky-300 rounded-xl p-4";
const bodyText =
  "text-gray-800 text-sm md:text-base leading-normal font-normal";
const optBtnBase =
  "w-full text-left rounded-xl border px-4 py-3 transition select-none text-sm md:text-base";
const optBtnOn =
  "bg-sky-100 border-sky-600 text-gray-900 shadow-sm";
const optBtnOff =
  "bg-white border-sky-400 text-gray-900 hover:border-sky-500";

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
  // ページ管理：0=国内通話, 1=海外, 2=留守電
  const [page, setPage] = useState(0);

  // === 外部制御 ===
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
    if (Array.isArray(value)) {
      (updated as Record<string, unknown>)[id as string] = value.filter(
        (v): v is string => typeof v === "string"
      );
    } else {
      (updated as Record<string, unknown>)[id as string] = value;
    }
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

  const OptionButtons = ({
    id,
    options,
  }: {
    id: keyof DiagnosisAnswers;
    options: string[];
  }) => {
    const value = answers[id];
    const onSelect = (opt: string) => handleChange(id, opt);
    return (
      <div className="space-y-3">
        {options.map((opt) => {
          const checked = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={`${optBtnBase} ${checked ? optBtnOn : optBtnOff}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  };

  // === ページ1: 国内通話・かけ放題関連 ===
  const renderPage1 = () => (
    <motion.div
      key="page1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {callQuestions
        .filter(
          (q) =>
            ![
              "needInternationalCallUnlimited",
              "internationalCallCarrier",
              "callOptionsNeeded",
            ].includes(q.id)
        )
        .map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          if (
            ["unknownCallUsageDuration", "unknownCallFrequency", "needCallPlanConfirm"].includes(
              q.id
            )
          ) {
            return (
              <motion.div key={q.id} className={outerCard}>
                <p className={`${bodyText} mb-3`}>{q.question}</p>
                <OptionButtons id={q.id as keyof DiagnosisAnswers} options={q.options} />
                {q.id === "unknownCallFrequency" && suggestion && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 mt-3">
                    <ReactMarkdown>{suggestion}</ReactMarkdown>
                  </div>
                )}
              </motion.div>
            );
          }

          return (
            <motion.div key={q.id} className="mt-2">
              <QuestionCard
                id={q.id}
                question={q.question}
                options={q.options}
                type={q.type}
                value={answers[q.id as keyof DiagnosisAnswers] as string}
                onChange={handleChange}
                answers={answers}
              />
            </motion.div>
          );
        })}
    </motion.div>
  );

  // === ページ2: 海外通話 ===
  const renderPage2 = () => (
    <motion.div
      key="page2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {callQuestions
        .filter((q) =>
          ["needInternationalCallUnlimited", "internationalCallCarrier"].includes(q.id)
        )
        .map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          if (q.id === "internationalCallCarrier") {
            const selected = Array.isArray(answers.internationalCallCarrier)
              ? answers.internationalCallCarrier
              : [];
            return (
              <motion.div key={q.id} className={outerCard}>
                <p className={`${bodyText} mb-3`}>{q.question}</p>
                <div className={innerCard}>
                  {q.options.map((opt) => {
                    const checked = selected.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          const next = checked
                            ? selected.filter((v) => v !== opt)
                            : [...selected, opt];
                          onChange({ internationalCallCarrier: next });
                        }}
                        className={`${optBtnBase} ${checked ? optBtnOn : optBtnOff}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div key={q.id} className={outerCard}>
              <p className={`${bodyText} mb-3`}>{q.question}</p>
              <OptionButtons id={q.id as keyof DiagnosisAnswers} options={q.options} />
            </motion.div>
          );
        })}
    </motion.div>
  );

  // === ページ3: 留守番電話オプション ===
  const renderPage3 = () => (
    <motion.div
      key="page3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {callQuestions
        .filter((q) => q.id === "callOptionsNeeded")
        .map((q) => (
          <motion.div key={q.id} className={outerCard}>
            <p className={`${bodyText} mb-3`}>{q.question}</p>
            <OptionButtons id={q.id as keyof DiagnosisAnswers} options={q.options} />
          </motion.div>
        ))}
    </motion.div>
  );

  return (
    <div className="w-full py-6 space-y-6">
      {page === 0 && renderPage1()}
      {page === 1 && renderPage2()}
      {page === 2 && renderPage3()}
    </div>
  );
});
