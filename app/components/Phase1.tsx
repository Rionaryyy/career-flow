"use client";
import { useState } from "react";

export default function Phase1({ onNext }: { onNext: () => void }) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const questions = [
    {
      id: 1,
      question: "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
      options: [
        "はい（ポイントも含めて最安を知りたい）",
        "いいえ（現金支出だけで比べたい）",
      ],
    },
    {
      id: 2,
      question: "通信品質（速度・安定性）はどの程度重視しますか？",
      options: [
        "とても重視する（大手キャリア水準が望ましい）",
        "ある程度重視する（格安でも安定していればOK）",
        "こだわらない（コスト最優先）",
      ],
    },
    {
      id: 3,
      question: "希望するキャリアの種類は？",
      options: ["大手キャリア", "サブブランド", "格安SIM（MVNO）"],
    },
    {
      id: 4,
      question: "サポート体制はどの程度重視しますか？",
      options: [
        "手厚いサポートが必要（店舗相談など）",
        "オンライン中心で十分",
      ],
    },
    {
      id: 5,
      question: "契約期間の縛りについてどう思いますか？",
      options: ["縛りなしが良い", "多少の縛りがあってもOK"],
    },
  ];

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-16 px-4 bg-gradient-to-b from-[#0a0f24] to-[#0f162f] text-white">
      <h1 className="text-3xl font-bold mb-10 text-blue-400">📍 フェーズ①：前提条件</h1>

      <div className="w-full max-w-3xl space-y-8">
        {questions.map((q) => (
          <div
            key={q.id}
            className="rounded-2xl p-6 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg w-[98%] mx-auto transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              {q.question}
            </h2>
            <div className="space-y-3">
              {q.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(q.id, option)}
                  className={`w-full text-base text-white py-3 px-4 rounded-xl transition-all duration-300 ${
                    answers[q.id] === option
                      ? "bg-blue-600 shadow-lg scale-[1.02]"
                      : "bg-slate-700/80 hover:bg-slate-600/90"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!allAnswered}
        className={`mt-10 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
          allAnswered
            ? "bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        次へ進む
      </button>
    </div>
  );
}
