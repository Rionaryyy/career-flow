"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Contract({ answers, onChange }: Props) {
  const questions = [
    {
      id: "familyLines",
      question: "家族割引を適用できる回線数はいくつですか？",
      options: ["1回線", "2回線", "3回線", "4回線以上", "適用できない / わからない"],
      type: "radio" as const,
    },
    {
      id: "studentDiscount",
      question: "学割を適用できますか？（18歳以下）",
      options: ["はい", "いいえ"],
      type: "radio" as const,
    },
    {
      id: "setDiscount",
      question: "キャリア契約時に、新規契約または乗り換え可能なサービスはどれですか？",
      options: [
        "光回線の契約",
        "電気のセット契約",
        "ガスのセット契約",
        "ルーター購入・レンタル",
        "ポケットWi-Fi契約",
      ],
      type: "checkbox" as const,
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  const hasService = (service: string) =>
    Array.isArray(answers.setDiscount) && answers.setDiscount.includes(service);

  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="w-full py-6 space-y-6">
          <QuestionCard
            id={q.id}
            question={q.question}
            options={q.options}
            type={q.type}
            value={answers[q.id as keyof Phase2Answers] as string | string[] | null}
            onChange={handleChange}
            answers={answers}
          />

          {/* ▼ 家族割引詳細 */}
          {q.id === "familyLines" && answers.familyLines === "4回線以上" && (
            <div className="w-full py-6 space-y-6">
              <QuestionCard
                id="familyLinesDetail"
                question="具体的な回線数を教えてください"
                options={["4回線", "5回線", "6回線", "7回線", "8回線", "9回線", "10回線"]}
                type="radio"
                value={answers.familyLinesDetail as string | null}
                onChange={handleChange}
                answers={answers}
              />
            </div>
          )}

          {/* ▼ セット割詳細（電気・ガスを除く） */}
          {q.id === "setDiscount" && (
            <div className="w-full py-6 space-y-6">
              {hasService("光回線の契約") && (
                <div className="w-full py-6 space-y-6">
                  <QuestionCard
                    id="fiberType"
                    question="光回線を契約するご自宅のタイプを教えてください"
                    options={["戸建て", "集合住宅（マンション・アパートなど）"]}
                    type="radio"
                    value={answers.fiberType as string | null}
                    onChange={handleChange}
                    answers={answers}
                  />
                  {answers.fiberType === "戸建て" && (
                    <QuestionCard
                      id="fiberSpeed"
                      question="希望する通信速度を選んでください"
                      options={["1Gps以上","2Gbps以上", "5Gbps以上", "10Gbps以上", "特にこだわらない"]}
                      type="radio"
                      value={answers.fiberSpeed as string | null}
                      onChange={handleChange}
                      answers={answers}
                    />
                  )}
                </div>
              )}

              {hasService("ルーター購入・レンタル") && (
                <div className="w-full py-6 space-y-6">
                  <QuestionCard
                    id="routerCapacity"
                    question="希望するデータ容量を選んでください"
                    options={["〜20GB", "〜50GB", "100GB以上", "無制限", "特にこだわらない"]}
                    type="radio"
                    value={answers.routerCapacity as string | null}
                    onChange={handleChange}
                    answers={answers}
                  />
                  <QuestionCard
                    id="routerSpeed"
                    question="希望する通信速度を選んでください"
                    options={["最大1Gbps", "最大2Gbps", "最大4Gbps", "特にこだわらない"]}
                    type="radio"
                    value={answers.routerSpeed as string | null}
                    onChange={handleChange}
                    answers={answers}
                  />
                </div>
              )}

              {hasService("ポケットWi-Fi契約") && (
                <div className="w-full py-6 space-y-6">
                  <QuestionCard
                    id="pocketWifiCapacity"
                    question="希望するデータ容量を選んでください"
                    options={["〜20GB", "〜50GB", "100GB", "無制限"]}
                    type="radio"
                    value={answers.pocketWifiCapacity as string | null}
                    onChange={handleChange}
                    answers={answers}
                  />
                  <QuestionCard
                    id="pocketWifiSpeed"
                    question="希望する通信速度を選んでください"
                    options={["100Mbps程度", "300Mbps程度", "500Mbps以上", "特にこだわらない"]}
                    type="radio"
                    value={answers.pocketWifiSpeed as string | null}
                    onChange={handleChange}
                    answers={answers}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
