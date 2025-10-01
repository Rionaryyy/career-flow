"use client";

import QuestionLayout from "./layouts/QuestionLayout";
import { Phase2Answers } from "@/types/types";
import { useState } from "react";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function Phase2Call({ answers, onChange, onNext, onBack }: Props) {
  const questions = [
    {
      id: "overseasUse",
      question: "1. 海外でスマホを利用する予定はありますか？",
      options: [
        "はい（短期旅行・年数回レベル）",
        "はい（長期滞在・留学・海外出張など）",
        "いいえ（国内利用のみ）",
      ],
      type: "radio" as const,
    },
    {
      id: "overseasPreference",
      question: "2. 海外利用時の希望に近いものを選んでください",
      options: [
        "海外でも日本と同じように通信したい（ローミング含め使い放題が希望）",
        "現地でSNSや地図だけ使えればOK（低速・少量でも可）",
        "必要に応じて現地SIMを使うので、特に希望はない",
      ],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.overseasUse?.startsWith("はい"),
    },
    {
      id: "dualSim",
      question: "3. デュアルSIM（2回線利用）を検討していますか？",
      options: [
        "はい（メイン＋サブで使い分けたい）",
        "はい（海外用と国内用で使い分けたい）",
        "いいえ（1回線のみの予定）",
      ],
      type: "radio" as const,
    },
    {
      id: "specialUses",
      question: "4. 特殊な利用目的がありますか？（複数選択可）",
      options: [
        "副回線として安価なプランを探している（メインとは別）",
        "法人契約または業務用利用を検討している",
        "子ども・高齢者向けなど家族のサブ回線用途",
        "IoT機器・見守り用など特殊用途",
        "特になし",
      ],
      type: "checkbox" as const,
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <QuestionLayout title="⑦ 海外利用・特殊ニーズ" onNext={onNext} onBack={onBack}>
      <div className="w-full px-2 sm:px-4 py-6 space-y-6">
        {questions.map((q) => {
          // 条件付き表示
          if (q.condition && !q.condition(answers)) return null;

          const currentValue = answers[q.id as keyof Phase2Answers];

          if (q.type === "radio") {
            return (
              <div key={q.id} className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
                <p className="font-semibold text-white">{q.question}</p>
                {q.options.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center w-full cursor-pointer py-2 px-2 rounded-lg ${
                      currentValue === option ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      checked={currentValue === option}
                      onChange={() => handleChange(q.id, option)}
                      className="accent-blue-500 mr-2"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            );
          }

          if (q.type === "checkbox") {
            const selected = Array.isArray(currentValue) ? currentValue : [];
            const toggle = (option: string) => {
              if (selected.includes(option)) {
                handleChange(q.id, selected.filter((v) => v !== option));
              } else {
                handleChange(q.id, [...selected, option]);
              }
            };
            return (
              <div key={q.id} className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
                <p className="font-semibold text-white">{q.question}</p>
                <div className="grid grid-cols-1 gap-1">
                  {q.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center w-full cursor-pointer py-2 px-2 rounded-lg ${
                        selected.includes(option) ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => toggle(option)}
                        className="accent-blue-500 mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </QuestionLayout>
  );
}
