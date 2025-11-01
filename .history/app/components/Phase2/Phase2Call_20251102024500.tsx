"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { suggestCallPlan } from "@/utils/logic/callPlanAdvisor";
import ReactMarkdown from "react-markdown";
import { useMemo } from "react";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

/** 枠スタイル（水色／二重枠） */
const outerCard = "bg-sky-50 border border-sky-300 rounded-2xl p-5 space-y-4";
const innerCard = "bg-sky-50 border border-sky-300 rounded-xl p-4";

/** 追加質問文言（赤寄りピンク）と注記（赤） */
const headingText = "text-pink-700 font-semibold text-base";
const descText = "text-pink-700";
const noteText = "text-red-600";

/** 選択肢ボタン（枠は水色、選択時は濃い水色） */
const optBtnBase =
  "w-full text-left rounded-xl border px-4 py-3 transition select-none";
const optBtnOn = "bg-sky-100 border-sky-600 text-gray-900 shadow-sm";
const optBtnOff = "bg-white border-sky-400 text-gray-900 hover:border-sky-500";

/** 追加質問のID分類 */
const isUnknownFollowupId = (id: string) =>
  ["unknownCallUsageDuration", "unknownCallFrequency", "needCallPlanConfirm"].includes(id);
const isYesFollowupId = (id: string) =>
  ["callPlanType", "timeLimitPreference", "monthlyLimitPreference", "hybridCallPreference"].includes(id);

// QuestionCard の value を正規化（boolean を除外）
function getQCValue(
  id: keyof Phase2Answers,
  answers: Phase2Answers
): string | string[] | null | undefined {
  const v = answers[id];
  return typeof v === "boolean"
    ? undefined
    : (v as string | string[] | null | undefined);
}

export default function Phase2Call({ answers, onChange }: Props) {
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
        condition: (ans: Phase2Answers) =>
          ans.needCallPlan === "よくわからない（おすすめを知りたい）",
      },
      {
        id: "unknownCallFrequency",
        question: "1週間あたりどのくらい通話しますか？",
        options: ["週1〜2回程度", "週3〜4回程度", "週5〜6回程度", "ほぼ毎日"],
        type: "radio" as const,
        condition: (ans: Phase2Answers) =>
          ans.needCallPlan === "よくわからない（おすすめを知りたい）" &&
          !!ans.unknownCallUsageDuration,
      },
      {
        id: "needCallPlanConfirm",
        question: "上記アドバイスを参考に、かけ放題を利用したいですか？",
        options: ["はい（利用したい）", "いいえ（使った分だけ支払いたい）"],
        type: "radio" as const,
        condition: (ans: Phase2Answers) =>
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
        condition: (ans: Phase2Answers) =>
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
        condition: (ans: Phase2Answers) =>
          Array.isArray(ans.callPlanType) &&
          ans.callPlanType.some((t) => t.includes("1回あたり")),
      },
      {
        id: "monthlyLimitPreference",
        question:
          "希望する月間制限型の範囲を選んでください。（※選択した上限より少ない時間のプランは比較対象外になります）",
        options: ["月60分まで無料", "月70分まで無料", "月100分まで無料", "無制限（完全定額）"],
        type: "radio" as const,
        condition: (ans: Phase2Answers) =>
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
        condition: (ans: Phase2Answers) =>
          Array.isArray(ans.callPlanType) &&
          ans.callPlanType.some((t) => t.includes("回数まで")),
      },

      // 海外通話かけ放題
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
        condition: (ans: Phase2Answers) => ans.needInternationalCallUnlimited === "はい",
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

const handleChange = (id: keyof Phase2Answers, value: string | number | string[]) => {
  const updated: Partial<Phase2Answers> = {};

  if (Array.isArray(value)) {
    // 🟢 ここを安全キャスト（string[]に限定）
    (updated as Record<string, unknown>)[id as string] = value.filter(
      (v): v is string => typeof v === "string"
    );
    onChange(updated);
    return;
  }

  if (id === "callPlanType") {
    // 🟢 同じく numberを弾いてstringだけ扱う
    const valArray = Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string")
      : [value as string];
    updated.callPlanType = valArray;

    const isEmptyArray = valArray.length === 0;
    if (isEmptyArray) {
      updated.timeLimitPreference = "";
      updated.monthlyLimitPreference = "";
      updated.hybridCallPreference = "";
    }
    onChange(updated);
    return;
  }

  (updated as Record<string, unknown>)[id as string] =
    typeof value === "number" ? String(value) : value;

  // 📞 かけ放題なしの場合
  if (id === "needCallPlan" && value === "いいえ（使った分だけ支払いたい）") {
    updated.callPlanType = [];
    updated.timeLimitPreference = "";
    updated.monthlyLimitPreference = "";
    updated.hybridCallPreference = "";
  }

  // ❓ おまかせ選択時は内部質問をリセット
  if (id === "needCallPlan" && value === "よくわからない（おすすめを知りたい）") {
    updated.unknownCallUsageDuration = "";
    updated.unknownCallFrequency = "";
    updated.needCallPlanConfirm = "";
  }

  // 🌐 海外通話：いいえを選んだらキャリア選択をクリア
  if (id === "needInternationalCallUnlimited") {
    if (value === "いいえ") {
      updated.internationalCallCarrier = [];
    }
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
    } as Phase2Answers);

  /** 選択肢（radio/checkbox） */
  const Options = ({
    id,
    type,
    options,
  }: {
    id: keyof Phase2Answers;
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
        {questions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          /** 「よくわからない」側：外枠＝文言（ピンク文字＋絵文字❓）、内枠＝質問＋選択肢（水色） */
          if (isUnknownFollowupId(q.id)) {
            const title = "❓ 「よくわからない（おすすめを知りたい）」に関する追加質問";

            if (q.id === "unknownCallFrequency") {
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className={outerCard}
                >
                  <h3 className={headingText}>{title}</h3>

                  <div className={innerCard}>
                    <p className="text-gray-800 mb-3">{q.question}</p>
                    <Options id={q.id as keyof Phase2Answers} type={q.type} options={q.options} />
                  </div>

                  {suggestion && (
                    <motion.div
                      key="call-advice"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white shadow-sm border border-gray-200 rounded-2xl p-5 text-gray-800 space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-pink-600 text-xl">📞</span>
                        <h3 className="font-semibold text-gray-900">通話プランアドバイス</h3>
                      </div>
                      <ReactMarkdown
                        components={{
                          p: (props) => <p {...props} className="mb-2 leading-relaxed text-gray-800" />,
                          strong: (props) => <strong {...props} className="text-gray-900 font-semibold" />,
                          h3: (props) => <h3 {...props} className="text-lg font-bold text-gray-800 mt-3" />,
                        }}
                      >
                        {suggestion as string}
                      </ReactMarkdown>
                      <div className="border-t border-gray-100 my-2" />
                      <p className="text-sm text-gray-600">
                        このアドバイスを参考に、「かけ放題を利用したいですか？」の回答を再選択してください。
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              );
            }

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className={outerCard}
              >
                <h3 className={headingText}>{title}</h3>
                <div className={innerCard}>
                  <p className="text-gray-800 mb-3">{q.question}</p>
                  <Options id={q.id as keyof Phase2Answers} type={q.type} options={q.options} />
                </div>
              </motion.div>
            );
          }

          /** 「はい」側：外枠＝文言（ピンク文字＋絵文字✅）、内枠＝質問＋選択肢（水色） */
          if (isYesFollowupId(q.id)) {
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className={outerCard}
              >
                <h3 className={headingText}>✅ 「はい（利用したい）」に関する追加質問</h3>
                <div className={innerCard}>
                  <p className="text-gray-800 mb-3">{q.question}</p>
                  <Options id={q.id as keyof Phase2Answers} type={q.type} options={q.options} />
                </div>
              </motion.div>
            );
          }

          /** 国際通話：外枠＝文言（ピンク文字＋絵文字🌍）＋注記（赤）、内枠＝選択肢（水色） */
          if (q.id === "internationalCallCarrier") {
            const selected = Array.isArray(answers.internationalCallCarrier)
              ? answers.internationalCallCarrier
              : [];

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className={outerCard}
              >
                <h3 className={headingText}>🌍 「はい」に関する追加質問</h3>
                <p className={`${descText} whitespace-pre-line`}>
                  ⚠️ 現在、海外通話かけ放題に対応しているのは以下のキャリアのみです。希望するものを選択してください（複数選択可）
                </p>
                <p className={`${noteText} text-[0.85rem]`}>
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

          /** 通常の質問は既存の QuestionCard のまま（灰系フォントへ統一感） */
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <QuestionCard
  id={q.id}
  question={q.question}
  options={q.options}
  type={q.type}
  value={getQCValue(q.id as keyof Phase2Answers, answers)}
  onChange={handleChange}
  answers={answers}
/>

            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
