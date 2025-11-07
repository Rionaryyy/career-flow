"use client";

import { useState, useEffect } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { deviceList } from "./DeviceList";
import { FlowSectionProps } from "@/types/flowProps";

/**
 * 統合後: 端末購入セクション（旧Phase2Device）
 * - Phase2Answers → DiagnosisAnswers に統一
 * - フェーズ構成廃止後でも独立して動作
 * - 各質問は1カードずつ順番に表示、条件分岐は同ページで展開
 */
export default function DeviceSection({ answers, onChange, onNext, onBack }: FlowSectionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleSection = (series: string) => {
    setOpenSections((prev) => ({ ...prev, [series]: !prev[series] }));
  };

  const handleDeviceChange = (model: string) => {
    onChange({ deviceModel: model, deviceStorage: null });
  };

  const handleStorageChange = (storage: string) => {
    onChange({ deviceStorage: storage });
  };

  const questions = [
    {
      id: "devicePreference",
      question: "新しい端末も一緒に購入する予定ですか？",
      options: ["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"],
      type: "radio" as const,
    },
    {
      id: "devicePurchaseMethods",
      question: "端末の購入方法",
      options: [
        "Appleなど正規ストア・家電量販店で本体のみ購入したい",
        "キャリアで端末を購入したい（通常購入）",
        "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
      ],
      type: "radio" as const,
      condition: (ans: DiagnosisAnswers) =>
        ans.devicePreference === "はい（端末も一緒に購入する）",
    },
    {
      id: "deviceModel",
      question: "購入したい端末を選択してください",
      type: "custom" as const,
      condition: (ans: DiagnosisAnswers) => {
        return (
          ans.devicePreference === "はい（端末も一緒に購入する）" &&
          ans.devicePurchaseMethods &&
          ans.devicePurchaseMethods.length > 0 &&
          ans.devicePurchaseMethods[0] !==
            "Appleなど正規ストア・家電量販店で本体のみ購入したい"
        );
      },
    },
    {
      id: "deviceStorage",
      question: "選んだ端末のストレージ容量を選択してください",
      type: "radio" as const,
      condition: (ans: DiagnosisAnswers) =>
        ans.deviceModel != null && ans.deviceModel !== "その他",
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleNext = () => {
    const next = currentIndex + 1;
    if (next < questions.length) setCurrentIndex(next);
    else onNext && onNext();
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else onBack && onBack();
  };

  const q = questions[currentIndex];

  return (
    <div className="w-full space-y-6 py-6">
      {/* === 現在の質問カード === */}
      {(!q.condition || q.condition(answers)) && q.type !== "custom" && (
        <QuestionCard
          id={q.id}
          question={q.question}
          options={(q as any).options ?? []}
          type={q.type}
          value={answers[q.id as keyof DiagnosisAnswers] ?? null}
          onChange={(id, value) => onChange({ [id]: value })}
          answers={answers}
        />
      )}

      {/* === 端末モデル選択（アコーディオンUI） === */}
      {q.type === "custom" && q.condition?.(answers) && (
        <QuestionCard
          id={q.id}
          question={q.question}
          type={q.type}
          value={answers.deviceModel ?? null}
          onChange={(id, value) => handleDeviceChange(value as string)}
          answers={answers}
          options={[]} // 型対応
        >
          <div className="mt-3 space-y-3">
            {deviceList.map((series) => {
              const isOpen = openSections[series.series] ?? false;
              return (
                <div
                  key={series.series}
                  className="border border-sky-200 rounded-2xl overflow-hidden"
                >
                  {/* シリーズタイトル */}
                  <button
                    onClick={() => toggleSection(series.series)}
                    className="w-full flex justify-between items-center p-4 font-semibold text-sky-900 hover:bg-sky-50"
                  >
                    <span>{series.series}</span>
                    <span
                      className={`ml-2 text-sky-900 text-lg transform transition-transform duration-200 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* モデル一覧 */}
                  {isOpen && (
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {series.models.map((model) => (
                        <div
                          key={model.label}
                          className={`cursor-pointer h-12 flex items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200 select-none ${
                            answers.deviceModel === model.label
                              ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow"
                              : "bg-white border-sky-200 text-sky-900 hover:border-sky-300 hover:shadow-sm"
                          }`}
                          onClick={() => handleDeviceChange(model.label)}
                        >
                          {model.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* その他（タブ外） */}
            <div className="mt-2">
              <div
                className={`cursor-pointer h-12 flex items-center justify-start rounded-lg border text-sm font-medium transition-all duration-200 select-none px-4 ${
                  answers.deviceModel === "その他"
                    ? "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow"
                    : "bg-white border-sky-200 text-sky-900 hover:border-sky-300 hover:shadow-sm"
                }`}
                onClick={() => handleDeviceChange("その他")}
              >
                その他
              </div>
            </div>
          </div>
        </QuestionCard>
      )}

      {/* === 同ページで条件を満たす質問（例：ストレージ選択） === */}
      {questions
        .filter((sub) => sub.condition && sub.condition(answers))
        .filter((sub) => sub.id !== q.id)
        .map((sub) =>
          sub.id === "deviceStorage" ? (
            <div key={sub.id} className="mt-4 pl-4 border-l-4 border-sky-200">
              <QuestionCard
                id={sub.id}
                question={sub.question}
                options={
                  deviceList
                    .flatMap((s) => s.models)
                    .find((m) => m.label === answers.deviceModel)?.storage ?? []
                }
                type={sub.type}
                value={answers.deviceStorage ?? null}
                onChange={(id, value) => handleStorageChange(value as string)}
                answers={answers}
              />
            </div>
          ) : null
        )}

      {/* === ページ操作ボタン === */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-lg text-sm ${
            currentIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-sky-700 hover:text-sky-800"
          }`}
        >
          ← 戻る
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg text-sky-700 hover:text-sky-800 text-sm"
        >
          {currentIndex === questions.length - 1 ? "次へ" : "次へ →"}
        </button>
      </div>
    </div>
  );
}
