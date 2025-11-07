"use client";

import { forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { callQuestions } from "../questions/callSection";
import { suggestCallPlan } from "@/utils/logic/callPlanAdvisor";

const outerCard = "bg-sky-50 border border-sky-300 rounded-2xl p-5 space-y-4";
const innerCard = "bg-sky-50 border border-sky-300 rounded-xl p-4";
const bodyText = "text-gray-800 text-sm md:text-base leading-normal font-normal";
const optBtnBase =
  "w-full text-left rounded-xl border px-4 py-3 transition select-none text-sm md:text-base";
const optBtnOn = "bg-sky-100 border-sky-600 text-gray-900 shadow-sm";
const optBtnOff = "bg-white border-sky-400 text-gray-900 hover:border-sky-500";

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
  useImperativeHandle(ref, () => ({
    goNext() {
      onNext && onNext();
    },
    isCompleted() {
      return true;
    },
  }));

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

  const needCallValue = String(answers.needCallPlan || "");
  const confirmValue = String(answers.needCallPlanConfirm || "");
  const showUnknown = needCallValue.includes("よくわからない");
  const showYes = needCallValue.includes("はい") || confirmValue.includes("はい");

  const showAdvice =
    showUnknown &&
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
    <div className="w-full py-6 space-y-8">
      {/* === 🟦 通話プラン（かけ放題） === */}
      <QuestionCard
        id="needCallPlan"
        question="通話プラン（かけ放題）を利用したいですか？"
        options={[
          "はい（よく通話を利用する）",
          "いいえ（使った分だけ支払いたい）",
          "よくわからない（おすすめを知りたい）",
        ]}
        type="radio"
        value={answers.needCallPlan ?? ""}
        onChange={handleChange}
        answers={answers}
      />

      {/* よくわからない → 通話時間＋頻度＋AI提案 */}
      {showUnknown && (
        <div className={outerCard}>
          <p className={`${bodyText} mb-3`}>
            「よくわからない（おすすめを知りたい）」に関する追加質問
          </p>

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

          {suggestion && (
            <motion.div
              key="call-advice"
              className="bg-white shadow-sm border border-gray-200 rounded-2xl p-5 text-gray-800 space-y-4 mt-4"
            >
              <h3 className="font-semibold text-gray-900">📞 通話プランアドバイス</h3>
              <ReactMarkdown>{suggestion as string}</ReactMarkdown>
            </motion.div>
          )}

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

      {/* はい → 詳細選択 */}
      {showYes && (
        <div className={outerCard}>
          <p className={`${bodyText} mb-3`}>
            「はい（利用したい）」に関する追加質問
          </p>
          {callQuestions
            .filter((f) =>
              ["callPlanType", "timeLimitPreference", "monthlyLimitPreference", "hybridCallPreference"].includes(f.id)
            )
            .map((sub) => (
              <div key={sub.id} className={innerCard}>
                <p className={`${bodyText} mb-2`}>{sub.question}</p>
                <OptionButtons
                  id={sub.id as keyof DiagnosisAnswers}
                  options={sub.options}
                  type={sub.id === "callPlanType" ? "checkbox" : "radio"}
                />
              </div>
            ))}
        </div>
      )}

      {/* === 🌍 海外通話オプション（独立）=== */}
      <div className={outerCard}>
        <p className={`${bodyText} mb-3`}>
          海外通話かけ放題オプションを利用しますか？
        </p>
        {callQuestions
          .filter((f) => f.id === "needInternationalCallUnlimited")
          .map((q) => (
            <OptionButtons
              key={q.id}
              id={q.id as keyof DiagnosisAnswers}
              options={q.options}
            />
          ))}

        {/* 「はい」選択時のみキャリア選択を表示 */}
        {answers.needInternationalCallUnlimited === "はい" &&
          callQuestions
            .filter((f) => f.id === "internationalCallCarrier")
            .map((s) => (
              <div key={s.id} className={`${innerCard} mt-4`}>
                <p className={`${bodyText} mb-2`}>{s.question}</p>
                <OptionButtons
                  id={s.id as keyof DiagnosisAnswers}
                  options={s.options}
                  type="checkbox"
                />
              </div>
            ))}
      </div>

      {/* === 📞 留守番電話オプション（独立）=== */}
      <div className={outerCard}>
        {callQuestions
          .filter((f) => f.id === "voicemailOption")
          .map((q) => (
            <div key={q.id}>
              <p className={`${bodyText} mb-2`}>{q.question}</p>
              <OptionButtons
                id={q.id as keyof DiagnosisAnswers}
                options={q.options}
              />
            </div>
          ))}
      </div>
    </div>
  );
});
