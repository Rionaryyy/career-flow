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

export default function Phase2Device({ answers, onChange, onNext, onBack }: Props) {
  const [buyingDevice, setBuyingDevice] = useState<string | null>(answers.devicePreference || null);
  const [devicePurchaseMethods, setDevicePurchaseMethods] = useState<string[]>(answers.oldDevicePlan ? [answers.oldDevicePlan] : []);

  const toggleMethod = (method: string) => {
    if (devicePurchaseMethods.includes(method)) {
      setDevicePurchaseMethods(devicePurchaseMethods.filter((m) => m !== method));
    } else {
      setDevicePurchaseMethods([...devicePurchaseMethods, method]);
    }
  };

  const questions = [
    {
      id: "devicePreference",
      question: "1. 新しい端末も一緒に購入する予定ですか？",
      options: ["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"],
      type: "radio" as const,
    },
    {
      id: "oldDevicePlan",
      question: "2. 端末の購入方法（複数選択可）",
      options: [
        "Appleなど正規ストア・家電量販店で本体のみ購入したい",
        "キャリアで端末を購入したい（通常購入）",
        "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
        "どれが最もお得か分からないので、すべてのパターンを比較したい",
      ],
      type: "checkbox" as const,
      condition: (ans: Phase2Answers) => ans.devicePreference === "はい（端末も一緒に購入する）",
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    if (id === "oldDevicePlan") {
      onChange({ oldDevicePlan: (value as string[]).join(", ") });
    } else {
      onChange({ [id]: value } as Partial<Phase2Answers>);
    }
  };

  return (
    <QuestionLayout title="⑥ 端末・購入形態" onNext={onNext} onBack={onBack}>
      <div className="w-full px-2 sm:px-4 py-6 space-y-4">
        {questions.map((q) => {
          const currentValue = answers[q.id as keyof Phase2Answers];

          if (q.condition && !q.condition(answers)) return null;

          return (
            <div key={q.id} className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
              <p className="text-xl font-semibold text-white text-center mb-2">{q.question}</p>
              <div className={q.type === "checkbox" ? "grid grid-cols-1 md:grid-cols-2 gap-2" : ""}>
                {q.options.map((option) => {
                  const checked = q.type === "checkbox"
                    ? (currentValue ? (currentValue as string).split(", ").includes(option) : false)
                    : currentValue === option;
                  return (
                    <label
                      key={option}
                      className={`flex items-center w-full cursor-pointer py-2 px-3 rounded-lg ${
                        checked ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      <input
                        type={q.type}
                        value={option}
                        checked={checked}
                        onChange={() => {
                          if (q.type === "checkbox") toggleMethod(option);
                          else handleChange(q.id, option);
                        }}
                        className="accent-blue-500 mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </QuestionLayout>
  );
}
