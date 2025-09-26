"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiagnosisAnswers } from "@/types/types";

type Phase1Props = {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  onNext: () => void;
};

const Phase1: React.FC<Phase1Props> = ({ answers, setAnswers, onNext }) => {
  const questions = [
    {
      id: 1,
      title: "① ポイント還元・経済圏特典の考慮",
      text: "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
      options: [
        "はい（ポイントも含めて最安を知りたい）",
        "いいえ（現金支出だけで比べたい）",
      ],
    },
    {
      id: 2,
      title: "② 通信品質の重視度",
      text: "通信品質（速度・安定性）はどの程度重視しますか？",
      options: [
        "とても重視する（大手キャリア水準が望ましい）",
        "ある程度重視する（格安でも安定していればOK）",
        "こだわらない（コスト最優先）",
      ],
    },
    {
      id: 3,
      title: "③ 希望するキャリア種別",
      text: "キャリアの種類に希望はありますか？",
      options: [
        "大手キャリア（ドコモ / au / ソフトバンク / 楽天）",
        "サブブランド（ahamo / povo / LINEMO / UQなど）もOK",
        "格安SIM（IIJ / mineo / NUROなど）も含めて検討したい",
      ],
    },
    {
      id: 4,
      title: "④ サポート体制の希望",
      text: "契約・サポートはオンライン完結で問題ありませんか？",
      options: ["はい（店舗サポートは不要）", "いいえ（店頭サポートが必要）"],
    },
    {
      id: 5,
      title: "⑤ 契約期間・縛りの許容度",
      text: "契約期間の縛りや解約金について、どの程度気にしますか？",
      options: [
        "絶対に嫌（縛りなしが前提）",
        "できれば避けたいが内容次第",
        "気にしない（条件次第でOK）",
      ],
    },
  ];

  const handleSelect = (id: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: option,
    }));
  };

  return (
    <Card className="w-full max-w-xl bg-slate-800 text-white shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          📍 フェーズ①：前提条件
        </h2>
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-400">{q.title}</h3>
              <p className="text-sm text-gray-300">{q.text}</p>
              <div className="flex flex-col gap-2">
                {q.options.map((option, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={`w-full max-w-[90%] mx-auto text-sm whitespace-normal rounded-lg px-4 py-3 transition
                      ${
                        answers[q.id] === option
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600"
                      }`}
                    onClick={() => handleSelect(q.id, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <Button
            onClick={onNext}
            disabled={Object.keys(answers).length < questions.length}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            次へ →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase1;
