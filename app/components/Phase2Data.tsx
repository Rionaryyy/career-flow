"use client";

import QuestionLayout from "./layouts/QuestionLayout";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function Phase2Data({ answers, onChange, onNext, onBack }: Props) {
  const questions = [
    {
      id: "dataUsage",
      question: "1. 毎月のデータ利用量は？",
      options: ["～5GB","5GB～20GB","20GB以上","無制限が理想"],
      type: "radio" as const,
    },
    {
      id: "speedLimitImportance",
      question: "2. 速度制限後の速度の重要性は？",
      options: ["あまり気にしない","ある程度重要","非常に重要"],
      type: "radio" as const,
    },
    {
      id: "tetheringNeeded",
      question: "3. テザリング機能は必要？",
      options: ["不要","必要"],
      type: "radio" as const,
    },
    {
      id: "tetheringUsage",
      question: "4. テザリングの主な用途は？",
      options: ["PC作業","タブレット","その他"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => ans.tetheringNeeded === "必要",
    },
  ];

  const handleChange = (id: string, value: string) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <QuestionLayout title="① データ通信に関する質問" onNext={onNext} onBack={onBack}>
      <div className="w-full px-2 sm:px-4 py-6 space-y-6">
        {questions.map((q) => {
          const currentValue = answers[q.id as keyof Phase2Answers] as string | null;

          // 条件付き質問は条件を満たさない場合はスキップ
          if (q.condition && !q.condition(answers)) return null;

          return (
            <div key={q.id} className="w-full bg-slate-800/90 p-4 rounded-xl border border-slate-600 space-y-2">
              <p className="text-xl font-semibold text-white text-center">{q.question}</p>
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleChange(q.id, option)}
                  className={`w-full py-3 rounded-lg border transition ${
                    currentValue === option
                      ? "bg-blue-600 border-blue-400 text-white"
                      : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </QuestionLayout>
  );
}
