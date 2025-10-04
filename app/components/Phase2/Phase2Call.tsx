"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Call({ answers, onChange }: Props) {
  const questions = [
    { id: "callFrequency", question: "1. 通話の頻度は？", options: ["ほとんど通話しない（LINEなどが中心）","月に数回だけ短い通話をする（1〜5分程度）","毎週何度か短い通話をする（5分以内が多い）","月に数回〜十数回、10〜20分程度の通話をする","毎日のように長時間の通話をする（20分以上・仕事など）"], type: "radio" as const },
    { id: "callPriority", question: "2. 通話品質の重視度は？", options: ["あまり重視しない","ある程度重視","非常に重視"], type: "radio" as const },
    { id: "callOptionsNeeded", question: "3. 通話オプションは必要？", options: ["不要","5分かけ放題","無制限かけ放題"], type: "radio" as const },
    { id: "callPurpose", question: "4. 主な通話の目的は？", options: ["プライベート","仕事","両方"], type: "radio" as const },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          id={q.id}
          question={q.question}
          options={q.options}
          type={q.type}
          value={answers[q.id as keyof Phase2Answers]}
          onChange={handleChange}
          answers={answers}
        />
      ))}
    </div>
  );
}
