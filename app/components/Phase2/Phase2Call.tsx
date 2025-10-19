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
    {
      id: "overseasCallDuration",
      question: "1回あたりの海外通話時間に最も近いものを選んでください。",
      options: [
        "海外にはほとんど通話しない",
        "5分以内（確認・予約などの短い通話）",
        "10分以内（家族や友人との連絡など）",
        "30分以内（定期的な海外通話）",
        "30分以上（長時間・業務通話）",
      ],
      type: "radio" as const,
    },
    {
      id: "overseasCallFrequencyPerWeek",
      question:
        "上で選んだような海外通話を、1週間あたりどのくらいの頻度で行いますか？",
      options: [
        "週1〜2回程度（たまに通話する）",
        "週3〜4回程度（定期的に通話する）",
        "週5〜6回程度（頻繁に通話する）",
        "毎日のように通話する（長時間・業務用途など）",
      ],
      type: "radio" as const,
      condition: (ans: Phase2Answers) =>
        ans.overseasCallDuration &&
        ans.overseasCallDuration !== "" &&
        ans.overseasCallDuration !== "海外にはほとんど通話しない",
    },
    {
      id: "callOptionsNeeded",
      question: "留守番電話のオプションは必要ですか？",
      options: ["はい（必要）", "いいえ（不要）"],
      type: "radio" as const,
    },
  ];

  // ✅ any削除＆型安全に
  const handleChange = (id: string, value: string | string[]) => {
    const updated: Partial<Phase2Answers> = {};

    if (id === "callPlanType") {
      updated.callPlanType = Array.isArray(value) ? value : [value];
      if (!(value as string[]).length) {
        updated.timeLimitPreference = "";
        updated.monthlyLimitPreference = "";
        updated.hybridCallPreference = "";
      }
      onChange(updated);
      return;
    }

    if (typeof id === "string" && typeof value === "string") {
      (updated as Record<string, unknown>)[id] = value; // ← ✅ any禁止でも動作同じ
    }

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

    if (
      id === "overseasCallDuration" &&
      typeof value === "string" &&
      value.includes("海外にはほとんど通話しない")
    ) {
      updated.overseasCallFrequencyPerWeek = "";
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
                        p: ({ node, ...props }) => (
                          <p {...props} className="mb-3 leading-relaxed text-gray-800" />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong {...props} className="text-sky-900 font-semibold" />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 {...props} className="text-lg font-bold text-sky-700 mt-4" />
                        ),
                      }}
                    >
                      {suggestion}
                    </ReactMarkdown>

                    <div className="border-t border-sky-100 my-3" />
                    <p className="text-sm text-sky-600">
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
