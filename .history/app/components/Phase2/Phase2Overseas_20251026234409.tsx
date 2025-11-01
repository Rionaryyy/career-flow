"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Overseas({ answers, onChange }: Props) {
  const questions = [
    {
      id: "overseasSupport",
      question:
        "海外でスマホを使うことがある場合、ローミングプランが用意されているキャリアを希望しますか？",
      options: [
        "はい（海外旅行・出張などでも使いたい）",
        "いいえ（国内利用がメイン）",
      ],
      type: "radio" as const,
      note: "※「はい」を選ぶと、ローミングプランを提供していないキャリアは除外されます。",
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => {
        const currentValue = answers[q.id as keyof Phase2Answers] as
          | string
          | string[]
          | null;

        return (
          <div key={q.id}>
            <QuestionCard
              id={q.id}
              question={q.question}
              options={q.options}
              type={q.type}
              value={currentValue}
              onChange={handleChange}
              answers={answers}
            />
            {q.note && (
              <p className="text-sm text-gray-500 mt-2">{q.note}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
