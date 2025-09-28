"use client";
import { useState } from "react";
import { Phase2Answers } from "@/types/types";

interface Phase2CallProps {
  defaultValues?: Partial<Phase2Answers>;
  onAnswer: (answers: Partial<Phase2Answers>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Phase2Call({ defaultValues, onAnswer, onNext, onBack }: Phase2CallProps) {
  const [callFrequency, setCallFrequency] = useState<string | null>(defaultValues?.callFrequency || null);
  const [callPriority, setCallPriority] = useState<string | null>(defaultValues?.callPriority || null);
  const [callOptionsNeeded, setCallOptionsNeeded] = useState<string | null>(defaultValues?.callOptionsNeeded || null);
  const [callPurpose, setCallPurpose] = useState<string | null>(defaultValues?.callPurpose || null);

  const handleNext = () => {
    onAnswer({
      callFrequency,
      callPriority,
      callOptionsNeeded,
      callPurpose,
    });
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">② 通話に関する質問</h2>
      {/* UIはここに配置 */}
      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">戻る</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">次へ</button>
      </div>
    </div>
  );
}
