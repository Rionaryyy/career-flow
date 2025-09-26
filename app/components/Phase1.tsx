"use client";
import React from "react";

type DiagnosisAnswers = {
  [key: string]: string;
};

type Phase1Props = {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  onNext: () => void;
};

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
    question: "キャリアの種類に希望はありますか？",
    options: [
      "大手キャリア（ドコモ / au / ソフトバンク / 楽天）",
      "サブブランド（ahamo / povo / LINEMO / UQなど）もOK",
      "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい",
    ],
  },
  {
    id: 4,
    question: "契約・サポートはオンライン完結で問題ありませんか？",
    options: ["はい（店舗サポートは不要）", "いいえ（店頭での手続きや相談が必要）"],
  },
  {
    id: 5,
    question: "契約期間の縛りや解約金について、どの程度気にしますか？",
    options: [
      "絶対に嫌（縛りなしが前提）",
      "できれば避けたいが内容次第",
      "気にしない（条件次第でOK）",
    ],
  },
];

export default function Phase1({ answers, setAnswers, onNext }: Phase1Props) {
  return (
    <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-2xl shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-center text-white">
        📍 フェーズ①：前提条件
      </h2>

      {questions.map((q) => (
        <div key={q.id} className="space-y-3">
          <p className="font-semibold text-lg text-gray-100 text-center">{q.question}</p>
          <div className="flex flex-col items-center space-y-2">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [String(q.id)]: option, // ← ✅ 型安全のため String() に変換
                  }))
                }
                className={`w-full max-w-[95%] mx-auto text-base whitespace-normal rounded-xl px-5 py-3 transition-all border 
                  ${
                    answers[String(q.id)] === option
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center pt-6">
        <button
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl text-lg transition"
        >
          次へ進む ▶
        </button>
      </div>
    </div>
  );
}
