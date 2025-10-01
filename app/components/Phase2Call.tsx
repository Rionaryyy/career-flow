"use client";

import QuestionLayout from "./layouts/QuestionLayout";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function Phase2Call({ answers, onChange, onNext, onBack }: Props) {
  const questions = [
    {
      id: "callFrequency",
      question: "1. 通話の頻度はどのくらいですか？",
      options: ["ほとんどしない","時々する（月数回）","よくする（週数回〜毎日）"],
      type: "radio" as const,
    },
    {
      id: "callPriority",
      question: "2. 通話品質の重視度は？",
      options: ["あまり重視しない","ある程度重視","非常に重視"],
      type: "radio" as const,
    },
    {
      id: "callOptionsNeeded",
      question: "3. 通話オプション（かけ放題など）は必要？",
      options: ["特に不要","5分〜10分かけ放題","無制限かけ放題"],
      type: "radio" as const,
    },
    {
      id: "callPurpose",
      question: "4. 主な通話の目的は？",
      options: ["プライベート","仕事","両方"],
      type: "radio" as const,
    },
  ];

  const handleChange = (id: string, value: string) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <QuestionLayout title="② 通話に関する質問" onNext={onNext} onBack={onBack}>
      <div className="w-full px-2 sm:px-4 py-6 space-y-6">
        {questions.map((q) => {
          const currentValue = answers[q.id as keyof Phase2Answers] as string | null;

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
