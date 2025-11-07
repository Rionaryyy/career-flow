"use client";

import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { motion } from "framer-motion";
import { suggestCallPlan } from "@/utils/logic/callPlanAdvisor";
import ReactMarkdown from "react-markdown";
import { callQuestions } from "../questions/callSection";

const outerCard = "bg-sky-50 border border-sky-300 rounded-2xl p-5 space-y-4";
const innerCard = "bg-sky-50 border border-sky-300 rounded-xl p-4";
const bodyText = "text-gray-800 text-sm md:text-base leading-normal font-normal";
const optBtnBase =
  "w-full text-left rounded-xl border px-4 py-3 transition select-none text-sm md:text-base";
const optBtnOn = "bg-sky-100 border-sky-600 text-gray-900 shadow-sm";
const optBtnOff = "bg-white border-sky-400 text-gray-900 hover:border-sky-500";

const isUnknownFollowupId = (id: string) =>
  ["unknownCallUsageDuration", "unknownCallFrequency", "needCallPlanConfirm"].includes(id);
const isYesFollowupId = (id: string) =>
  ["callPlanType", "timeLimitPreference", "monthlyLimitPreference", "hybridCallPreference"].includes(id);

const CallSection = forwardRef(function CallSection(
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
  const [currentIndex, setCurrentIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < callQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= callQuestions.length - 1;
    },
    getCurrentIndex() {
      return currentIndex;
    },
    setCurrentIndex(i: number) {
      setCurrentIndex(i);
    },
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (id: keyof DiagnosisAnswers, value: string | number | string[]) => {
    const updated: Partial<DiagnosisAnswers> = {};

    if (Array.isArray(value)) {
      (updated as Record<string, unknown>)[id as string] = value;
    } else {
      (updated as Record<string, unknown>)[id as string] = value;
    }

    if (id === "needCallPlan" && String(value).includes("いいえ")) {
      updated.callPlanType = [];
      updated.timeLimitPreference = "";
      updated.monthlyLimitPreference = "";
      updated.hybridCallPreference = "";
    }

    if (id === "needCallPlan" && String(value).includes("よくわからない")) {
      updated.unknownCallUsageDuration = "";
      updated.unknownCallFrequency = "";
      updated.needCallPlanConfirm = "";
    }

    if (id === "needInternationalCallUnlimited" && String(value).includes("いいえ")) {
      updated.internationalCallCarrier = [];
    }

    onChange(updated);
  };

  const q = callQuestions[currentIndex];
  const needCallValue = String(answers.needCallPlan || "");
  const confirmValue = String(answers.needCallPlanConfirm || "");

  const showUnknownFollowups =
    q.id === "needCallPlan" && needCallValue.includes("よくわからない");

  // ✅ needCallPlanConfirm もYES判定に含める
  const showYesFollowups =
    (q.id === "needCallPlan" && needCallValue.includes("はい")) ||
    (answers.needCallPlanConfirm && confirmValue.includes("はい"));

  const showAdvice =
    needCallValue.includes("よくわからない") &&
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
    type = "radio",
  }: {
    id: keyof DiagnosisAnswers;
    options: string[];
    type?: "radio" | "checkbox";
  }) => {
    const value = answers[id];
    const arr = Array.isArray(value) ? (value as string[]) : [];
    const onRadio = (opt: string) => handleChange(id, opt);
    const onCheckbox = (opt: string) => {
      const next = arr.includes(opt)
        ? arr.filter((v) => v !== opt)
        : [...arr, opt];
      handleChange(id, next);
    };

    return (
      <div className="space-y-3">
        {options.map((opt) => {
          const checked = type === "radio" ? value === opt : arr.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() =>
                type === "radio" ? onRadio(opt) : onCheckbox(opt)
              }
              className={`${optBtnBase} ${checked ? optBtnOn : optBtnOff}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full py-6 space-y-6">
      {/* === メイン質問 === */}
      <motion.div
        key={q.id}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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

      {/* === 「よくわからない」選択時の追加質問 === */}
      {showUnknownFollowups && (
        <div className={`${outerCard}`}>
          <p className={`${bodyText} mb-3`}>
            「よくわからない（おすすめを知りたい）」に関する追加質問
          </p>

          {/* ✅ 通話時間＋通話頻度を1カードにまとめる */}
          <div className={innerCard}>
            {callQuestions
              .filter(
                (f) =>
                  f.id === "unknownCallUsageDuration" ||
                  f.id === "unknownCallFrequency"
              )
              .map((sub) => (
                <div key={sub.id} className="mb-4">
                  <p className={`${bodyText} mb-2`}>{sub.question}</p>
                  <OptionButtons
                    id={sub.id as keyof DiagnosisAnswers}
                    options={sub.options}
                  />
                </div>
              ))}
          </div>

          {/* ✅ AIアドバイス表示 */}
          {suggestion && (
            <motion.div
              key="call-advice"
              className="bg-white shadow-sm border border-gray-200 rounded-2xl p-5 text-gray-800 space-y-4 mt-4"
            >
              <h3 className="font-semibold text-gray-900">
                📞 通話プランアドバイス
              </h3>
              <ReactMarkdown>{suggestion as string}</ReactMarkdown>
            </motion.div>
          )}

          {/* ✅ 「かけ放題を利用したいですか？」をアドバイスの下に配置 */}
          {answers.unknownCallUsageDuration &&
            answers.unknownCallFrequency && (
              <div className={`${innerCard} mt-4`}>
                {callQuestions
                  .filter((f) => f.id === "needCallPlanConfirm")
                  .map((sub) => (
                    <div key={sub.id}>
                      <p className={`${bodyText} mb-2`}>{sub.question}</p>
                      <OptionButtons
                        id={sub.id as keyof DiagnosisAnswers}
                        options={sub.options}
                      />
                    </div>
                  ))}
              </div>
            )}
        </div>
      )}

      {/* === 「はい」選択時（needCallPlan または needCallPlanConfirm） === */}
      {showYesFollowups && (
        <div className={`${outerCard}`}>
          <p className={`${bodyText} mb-3`}>
            「はい（利用したい）」に関する追加質問
          </p>

          {callQuestions.filter((f) => isYesFollowupId(f.id)).map((sub) => (
            <div key={sub.id} className={innerCard}>
              <p className={`${bodyText} mb-2`}>{sub.question}</p>

              {sub.id === "callPlanType" ? (
                <OptionButtons
                  id={sub.id as keyof DiagnosisAnswers}
                  options={sub.options}
                  type="checkbox"
                />
              ) : (
                <OptionButtons
                  id={sub.id as keyof DiagnosisAnswers}
                  options={sub.options}
                  type="radio"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default CallSection;
