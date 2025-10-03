"use client";

import QuestionLayout from "../layouts/QuestionLayout";
import QuestionCard from "../layouts/QuestionCard";
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

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  // --- 追加 ---
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const handleNext = () => onNext();
  const handleBack = () => onBack?.();
  // ----------------

  return (
    <QuestionLayout
      pageTitle="📱 フェーズ②：データ条件"
      answeredCount={answeredCount}
      onNext={handleNext}
      onBack={handleBack}
    >
      <div className="w-full py-6 space-y-6">
        {questions.map((q) => {
          if (q.condition && !q.condition(answers)) return null;

          const currentValue = answers[q.id as keyof Phase2Answers] as string | null;

          return (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q.question}
              options={q.options}
              type={q.type}
              value={currentValue}
              onChange={handleChange}
              answers={answers}
            />
          );
        })}
      </div>
    </QuestionLayout>
  );
}
