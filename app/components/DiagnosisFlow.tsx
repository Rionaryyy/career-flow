"use client";

import React, { useState } from "react";
import Phase2Data from "./Phase2Data";
import Phase2Call from "./Phase2Call";
import Phase2Contract from "./Phase2Contract";
import Phase2Ecosystem from "./Phase2Ecosystem";
import Phase2Subscription from "./Phase2Subscription";
import Phase2Device from "./Phase2Device";
import Phase2Payment from "./Phase2Payment";
import { Phase2Answers } from "@/types/types";

interface Phase2Props {
  defaultValues: Phase2Answers;
  onSubmit: (answers: Phase2Answers) => void;
}

export default function Phase2({ defaultValues, onSubmit }: Phase2Props) {
  const [answers, setAnswers] = useState<Phase2Answers>(defaultValues);

  const handleChange = (updated: Partial<Phase2Answers>) => {
    setAnswers((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="w-full max-w-none px-0 space-y-8"> {/* 画面端まで広げる */}
      <Phase2Data answers={answers} onChange={handleChange} />
      <Phase2Call answers={answers} onChange={handleChange} />
      <Phase2Contract answers={answers} onChange={handleChange} />
      <Phase2Ecosystem answers={answers} onChange={handleChange} />
      <Phase2Subscription answers={answers} onChange={handleChange} />
      <Phase2Device answers={answers} onChange={handleChange} />
      <Phase2Payment answers={answers} onChange={handleChange} />

      <div className="text-center mt-6">
        <button
          onClick={() => onSubmit(answers)}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-2xl shadow-lg transition-all"
        >
          フェーズ②を完了する
        </button>
      </div>
    </div>
  );
}
