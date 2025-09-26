"use client";
import { DiagnosisAnswers } from "../types/types";
import { useState } from "react";

interface Phase1Props {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  onNext: () => void;
}

export default function Phase1({ answers, setAnswers, onNext }: Phase1Props) {
  const handleSelect = (key: keyof DiagnosisAnswers, option: string) => {
    setAnswers((prev) => ({ ...prev, [key]: option }));
  };

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
  ] as const;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
        📍 フェーズ①：前提条件
      </h2>

      {questions.map((q) => (
        <div
          key={q.key}
          className="bg-slate-800 p-4 rounded-2xl shadow-md w-[92%] mx-auto"
        >
          <h3 className="text-lg font-semibold mb-2 text-blue-400 text-center">
            {q.title}
          </h3>
          <p className="text-sm text-gray-300 mb-4 text-center">{q.question}</p>

          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(q.key, opt)}
                className={`w-full text-sm md:text-base whitespace-nowrap text-ellipsis overflow-hidden rounded-lg px-3 py-2 transition-colors ${
                  answers[q.key] === opt
                    ? "bg-blue-500 text-white"
                    : "bg-slate-700 text-gray-200 hover:bg-slate-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-6">
        <button
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          次へ進む →
        </button>
      </div>
    </div>
  );
}
