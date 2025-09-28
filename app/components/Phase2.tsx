"use client";

import { Phase2Answers } from "@/types/types";
import Phase2Data from "./Phase2Data";
import Phase2Call from "./Phase2Call";
import Phase2Contract from "./Phase2Contract";
// ✅ ファイル名修正：存在するファイル名に合わせて "Phase2Economy" → "Phase2Ecosystem" に変更（存在しないなら作るかコメントアウト）
import Phase2Ecosystem from "./Phase2Ecosystem";
import Phase2Subscription from "./Phase2Subscription";
import Phase2Device from "./Phase2Device";
import Phase2Overseas from "./Phase2Overseas";
import Phase2Payment from "./Phase2Payment";
import { useState } from "react";

interface Phase2Props {
  answers: Phase2Answers;
  setAnswers: (
    updater:
      | Partial<Phase2Answers>
      | ((prev: Phase2Answers) => Phase2Answers)
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

const steps = [
  Phase2Data,
  Phase2Call,
  Phase2Contract,
  Phase2Ecosystem, // ✅ 修正済み
  Phase2Subscription,
  Phase2Device,
  Phase2Overseas,
  Phase2Payment,
];

export default function Phase2({
  answers,
  setAnswers,
  onNext,
  onBack,
}: Phase2Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const StepComponent = steps[stepIndex];

  const goNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onNext();
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      onBack();
    }
  };

  return (
    <StepComponent
      defaultValues={answers}
      // ✅ 型指定を追加して「暗黙的 any」エラーを解消
      onAnswer={(partial: Partial<Phase2Answers>) =>
        setAnswers((prev) => ({ ...prev, ...partial }))
      }
      onNext={goNext}
      onBack={goBack}
    />
  );
}
