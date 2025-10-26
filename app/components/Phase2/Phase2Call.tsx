"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { suggestCallPlan } from "@/utils/logic/callPlanAdvisor";
import ReactMarkdown from "react-markdown";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Call({ answers, onChange }: Props) {
  const questions = [
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
        "30分以内（仕事や長めの会話が多い）",
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
      options: [
        "月60分まで無料",
        "月70分まで無料",
        "月100分まで無料",
        "無制限（完全定額）",
      ],
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
      condition: (ans: Phase2Answers) =>
        ans.needInternationalCallUnlimited === "はい",
    },

    {
      id: "callOptionsNeeded",
      question: "留守番電話のオプションは必要ですか？",
      options: ["はい（必要）", "いいえ（不要）"],
      type: "radio" as const,
    },
  ];

  const handleChange = (id: keyof Phase2Answers, value: string | string[]) => {
    const updated: Partial<Phase2Answers> = {};

    if (Array.isArray(value)) {
      (updated as Record<string, unknown>)[id] = value as unknown;
      onChange(updated);
      return;
    }

    if (id === "callPlanType") {
      updated.callPlanType = Array.isArray(value) ? value : [value];
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      if (isEmptyArray) {
        updated.timeLimitPreference = "";
        updated.monthlyLimitPreference = "";
        updated.hybridCallPreference = "";
      }
      onChange(updated);
      return;
    }

    (updated as Record<string, unknown>)[id] = value as unknown;

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

  const toggleInternationalCarrier = (opt: string) => {
    const current = Array.isArray(answers.internationalCallCarrier)
      ? answers.internationalCallCarrier
      : [];
    const next = current.includes(opt)
      ? current.filter((o: string) => o !== opt)
      : [...current, opt];
    onChange({ internationalCallCarrier: next });
  };

  return (
    <div className="w-full py-6 space-y-6">
      <AnimatePresence>
        {questions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          if (q.id === "unknownCallFrequency") {
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
                  value={answers[q.id as keyof Phase2Answers]}
                  onChange={handleChange}
                  answers={answers}
                />

                {suggestion && (
                  <motion.div
                    key="call-advice"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white shadow-sm border border-sky-200 rounded-2xl p-5 mt-6 text-sky-800 space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sky-500 text-xl">📞</span>
                      <h3 className="font-semibold text-sky-900">通話プランアドバイス</h3>
                    </div>

                    <ReactMarkdown
                      components={{
                        p: (props) => (
                          <p {...props} className="mb-2 leading-relaxed text-gray-800" />
                        ),
                        strong: (props) => (
                          <strong {...props} className="text-sky-900 font-semibold" />
                        ),
                        h3: (props) => (
                          <h3 {...props} className="text-lg font-bold text-sky-700 mt-3" />
                        ),
                      }}
                    >
                      {suggestion}
                    </ReactMarkdown>

                    <div className="border-t border-sky-100 my-2" />
                    <p className="text-sm text-sky-600">
                      このアドバイスを参考に、「かけ放題を利用したいですか？」の回答を再選択してください。
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          }

          // 国際通話キャリアカード：上の空白を詰め、注意文を内枠の外へ
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
              >
                <QuestionCard
                  id={q.id}
                  question=""
                  options={[]}
                  type="custom"
                  value={selected}
                  onChange={handleChange}
                  answers={answers}
                >
                  {/* 上の余白を軽く詰める */}
                  <div className="-mt-2">
                    <h3 className="text-sky-900 font-semibold text-base mb-2">
                      「はい」に関する追加質問
                    </h3>

                    {/* 選択肢の内枠 */}
                    <div className="rounded-2xl border border-sky-300 bg-sky-50 p-3 space-y-3">
                      <p className="text-sky-900 font-semibold text-center">
                        ⚠️ 現在、海外通話かけ放題に対応しているのは以下のキャリアのみです。希望するものを選択してください（複数選択可）
                      </p>

                      <div className="grid grid-cols-1 gap-3 w-full">
                        {[
                          "楽天モバイル（国際通話かけ放題：¥980/月・65カ国対象）",
                          "au（国際通話定額：月900分・23カ国対象）",
                        ].map((opt) => {
                          const checked = selected.includes(opt);
                          return (
                            <div
                              key={opt}
                              onClick={() => toggleInternationalCarrier(opt)}
                              className={`flex items-center w-full cursor-pointer h-14 px-4 rounded-xl border text-sm font-medium select-none transition-all duration-200 ${
                                checked
                                  ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow ring-1 ring-sky-600 border-sky-600"
                                  : "bg-white border-sky-500 text-sky-900 hover:border-sky-600 hover:shadow-sm"
                              }`}
                            >
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 注意文：内枠の外に出し、少し小さく */}
                    <p className="mt-2 text-[0.8rem] text-pink-600">
                      ※ここで選択したキャリアのみ、以降のプラン比較に反映されます。
                    </p>
                  </div>
                </QuestionCard>
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
            >
              <QuestionCard
                id={q.id}
                question={q.question}
                options={q.options}
                type={q.type}
                value={answers[q.id as keyof Phase2Answers]}
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
