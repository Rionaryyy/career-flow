"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Phase1({ onNext }: { onNext: () => void }) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const questions = [
    {
      id: 1,
      title: "① ポイント還元・経済圏特典の考慮",
      question: "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
      options: [
        "はい（ポイントも含めて最安を知りたい）",
        "いいえ（現金支出だけで比べたい）",
      ],
    },
    {
      id: 2,
      title: "② 通信品質の重視度",
      question: "通信品質（速度・安定性）はどの程度重視しますか？",
      options: [
        "とても重視する（大手キャリア水準が望ましい）",
        "ある程度重視する（格安でも安定していればOK）",
        "こだわらない（コスト最優先）",
      ],
    },
    {
      id: 3,
      title: "③ 希望するキャリア種別",
      question: "キャリアの種類に希望はありますか？",
      options: [
        "大手キャリア（ドコモ / au / ソフトバンク / 楽天）",
        "サブブランド（ahamo / povo / LINEMO / UQなど）もOK",
        "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい",
      ],
    },
    {
      id: 4,
      title: "④ サポート体制の希望",
      question: "契約・サポートはオンライン完結で問題ありませんか？",
      options: [
        "はい（店舗サポートは不要）",
        "いいえ（店頭での手続きや相談が必要）",
      ],
    },
    {
      id: 5,
      title: "⑤ 契約期間・縛りへの許容度",
      question: "契約期間の縛りや解約金について、どの程度気にしますか？",
      options: [
        "絶対に嫌（縛りなしが前提）",
        "できれば避けたいが内容次第",
        "気にしない（条件次第でOK）",
      ],
    },
  ];

  const handleSelect = (qId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const allAnswered = questions.every((q) => answers[q.id]);

  return (
    <div className="w-full max-w-lg mx-auto px-2 py-6"> {/* ← 横幅を広くして余白を少し削減 */}
      <h2 className="text-2xl font-bold mb-6 text-gray-100 text-center">
        📍 フェーズ①：前提条件
      </h2>

      {questions.map((q) => (
        <Card key={q.id} className="mb-6 bg-slate-800 p-4 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-blue-400">{q.title}</h3>
          <p className="text-sm text-gray-300 mb-4">{q.question}</p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <Button
                key={opt}
                variant={answers[q.id] === opt ? "default" : "outline"}
                onClick={() => handleSelect(q.id, opt)}
                className={`w-full text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis transition-colors ${
                  answers[q.id] === opt
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-slate-700 text-gray-200 hover:bg-slate-600"
                }`}
              >
                {opt}
              </Button>
            ))}
          </div>
        </Card>
      ))}

      <div className="text-center mt-8">
        <Button
          onClick={onNext}
          disabled={!allAnswered}
          className={`px-8 py-3 text-lg font-semibold rounded-full transition ${
            allAnswered
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          次へ進む →
        </Button>
      </div>
    </div>
  );
}
