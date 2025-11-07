"use client";

import { forwardRef, useImperativeHandle } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
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
  // === 🔹 DiagnosisFlowから制御されるためのrefメソッド ===
  useImperativeHandle(ref, () => ({
    goNext() {
      onNext && onNext();
    },
    isCompleted() {
      // Q&Aが複数段階構造でないため、常にtrue扱い
      return true;
    },
  }));

  const handleChange = (id: keyof DiagnosisAnswers, value: string | number | string[]) => {
    const updated: Partial<DiagnosisAnswers> = {};

    if (Array.isArray(value)) {
      (updated as Record<string, unknown>)[id as string] = value.filter(
        (v): v is string => typeof v === "string"
      );
      onChange(updated);
      return;
    }

    if (id === "callPlanType") {
      const valArray = Array.isArray(value)
        ? value.filter((v): v is string => typeof v === "string")
        : [value as string];
      updated.callPlanType = valArray;

      if (valArray.length === 0) {
        updated.timeLimitPreference = "";
        updated.monthlyLimitPreference = "";
        updated.hybridCallPreference = "";
      }
      onChange(updated);
      return;
    }

    (updated as Record<string, unknown>)[id as string] =
      typeof value === "number" ? String(value) : value;

    if (id === "needCallPlan" && value === "いいえ（使った分だけ支払いたい）") {
      updated.callPlanType = [];
      updated.timeLimitPreference = "";
      updated.monthlyLimitPreference = "";
      updated.hybridCallPreference = "";
    }

    if (id === "needCallPlan" && value === "よくわからない（おすすめを知りたい）") {
      updated.unknownCallUsageDuration = "";
      updated.unknownCallFrequency = "";
      updated.needCallPlanConfirm = "";
    }

    if (id === "needInternationalCallUnlimited" && value === "いいえ") {
      updated.internationalCallCarrier = [];
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

  const HeadingRow = ({ emoji, text }: { emoji: string; text: string }) => (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm md:text-base leading-none align-middle shrink-0 select-none">
        {emoji}
      </span>
      <span className={bodyText}>{text}</span>
    </div>
  );

  const Options = ({
    id,
    type,
    options,
  }: {
    id: keyof DiagnosisAnswers;
    type: "radio" | "checkbox";
    options: string[];
  }) => {
    const value = answers[id];
    const arr = Array.isArray(value) ? (value as string[]) : [];
    const onRadio = (opt: string) => handleChange(id, opt);
    const onCheckbox = (opt: string) => {
      const next = arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt];
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
              onClick={() => (type === "radio" ? onRadio(opt) : onCheckbox(opt))}
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
      <AnimatePresence>
        {callQuestions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          if (isUnknownFollowupId(q.id)) {
            return (
              <motion.div key={q.id} className={outerCard}>
                <HeadingRow emoji="❓" text="「よくわからない（おすすめを知りたい）」に関する追加質問" />
                <div className={innerCard}>
                  <p className={`${bodyText} mb-3`}>{q.question}</p>
                  <Options id={q.id as keyof DiagnosisAnswers} type={q.type} options={q.options} />
                </div>

                {q.id === "unknownCallFrequency" && suggestion && (
                  <motion.div
                    key="call-advice"
                    className="bg-white shadow-sm border border-gray-200 rounded-2xl p-5 text-gray-800 space-y-4 mt-4"
                  >
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
                  </motion.div>
                )}
              </motion.div>
            );
          }

          if (isYesFollowupId(q.id)) {
            return (
              <motion.div key={q.id} className={outerCard}>
                <HeadingRow emoji="✅" text="「はい（利用したい）」に関する追加質問" />
                <div className={innerCard}>
                  <p className={`${bodyText} mb-3`}>{q.question}</p>
                  <Options id={q.id as keyof DiagnosisAnswers} type={q.type} options={q.options} />
                </div>
              </motion.div>
            );
          }

          if (q.id === "internationalCallCarrier") {
            const selected = Array.isArray(answers.internationalCallCarrier)
              ? answers.internationalCallCarrier
              : [];
            return (
              <motion.div key={q.id} className={outerCard}>
                <HeadingRow emoji="🌍" text="「はい」に関する追加質問" />
                <p className={`${bodyText} whitespace-pre-line`}>
                  ⚠️ 現在、海外通話かけ放題に対応しているのは以下のキャリアのみです。希望するものを選択してください（複数選択可）
                </p>
                <p className="text-red-600 text-xs md:text-sm">
                  ※ここで選択したキャリアのみ、以降のプラン比較に反映されます。
                </p>
                <div className={innerCard}>
                  <div className="grid grid-cols-1 gap-3 w-full">
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
                </div>
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
      </AnimatePresence>
    </div>
  );
});

export default CallSection;
