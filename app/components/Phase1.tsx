"use client";
import React from "react";
import { DiagnosisAnswers } from "../types/types";

type Phase1Props = {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  nextPhase: () => void;
};

export default function Phase1({ answers, setAnswers, nextPhase }: Phase1Props) {
  const questions = [
    {
      key: "includePoints",
      title: "① ポイント還元・経済圏特典の考慮",
      question: "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
      options: [
        "はい（ポイントも含めて最安を知りたい）",
        "いいえ（現金支出だけで比べたい）",
      ],
    },
    {
      key: "qualityPriority",
      title: "② 通信品質の重視度",
      question: "通信品質（速度・安定性）はどの程度重視しますか？",
      options: [
        "とても重視する（大手キャリア水準が望ましい）",
        "ある程度重視する（格安でも安定していればOK）",
        "こだわらない（コスト最優先）",
      ],
    },
    {
      key: "carrierType",
      title: "③ 希望するキャリア種別",
      question: "キャリアの種類に希望はありますか？",
      options: [
        "大手キャリア（ドコモ / au / ソフトバンク / 楽天）",
        "サブブランド（ahamo / povo / LINEMO / UQなど）もOK",
        "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい",
      ],
    },
    {
      key: "supportPreference",
      title: "④ サポート体制の希望",
      question: "契約・サポートはオンライン完結で問題ありませんか？",
      options: [
        "はい（店舗サポートは不要）",
        "いいえ（店頭での手続きや相談が必要）",
      ],
    },
    {
      key: "contractLockPreference",
      title: "⑤ 契約期間・縛りへの許容度",
      question: "契約期間の縛りや解約金について、どの程度気にしますか？",
      options: [
        "絶対に嫌（縛りなしが前提）",
        "できれば避けたいが内容次第",
        "気にしない（条件次第でOK）",
      ],
    },
  ];

  const handleSelect = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const allAnswered = questions.every((q) => answers[q.key as keyof DiagnosisAnswers] !== "");

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6">
        📍 フェーズ①：前提条件
      </h2>

      {questions.map((q) => (
        <div key={q.key} className="bg-gray-800 p-5 sm:p-6 rounded-xl shadow">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-400">
            {q.title}
          </h3>
          <p className="text-sm sm:text-base mb-4 leading-snug">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt) => {
              const selected = answers[q.key as keyof DiagnosisAnswers] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(q.key, opt)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm sm:text-base transition 
                    ${
                      selected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                    } 
                    whitespace-normal leading-snug text-left`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={nextPhase}
          disabled={!allAnswered}
          className={`w-full sm:w-auto px-8 py-3 rounded-lg text-lg font-semibold transition ${
            allAnswered
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          次へ進む
        </button>
      </div>
    </div>
  );
}
