"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { deviceList } from "@/data/DeviceList";
import { deviceQuestions } from "../questions/deviceSection";

interface Props {
  answers: DiagnosisAnswers;
  onChange: (updated: Partial<DiagnosisAnswers>) => void;
  onNext?: () => void;
}

const DeviceSection = forwardRef(function DeviceSection(
  { answers, onChange, onNext }: Props,
  ref
) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // 🔹 にゃんこボタン対応
  useImperativeHandle(ref, () => ({
    goNext() {
      onNext && onNext();
    },
    isCompleted() {
      return true;
    },
  }));

  // ✅ 追加：端末を「いいえ」にしたときにリセット
  useEffect(() => {
    if (answers.devicePreference === "no") {
      console.log("🧹 端末関連入力をリセット（いいえ選択時）");
      onChange({
        deviceModel: null,
        deviceStorage: null,
        devicePurchaseMethods: null,
      });
    }
  }, [answers.devicePreference, onChange]);

  // ===== ユーティリティ関数 =====
  const toggleSection = (series: string) =>
    setOpenSections((prev) => ({ ...prev, [series]: !prev[series] }));

  const handleDeviceChange = (model: string) => {
    onChange({ deviceModel: model, deviceStorage: null });
  };

  const handleStorageChange = (storage: string) => {
    onChange({ deviceStorage: storage });
  };

  // ===== メイン描画 =====
  return (
    <div className="w-full space-y-6 py-6">
      {deviceQuestions.map((q) => {
        if (q.condition && !q.condition(answers)) return null;
        if (q.id === "deviceStorage") return null;

        if (q.type !== "custom") {
          const normalizedOptions = (q as any).options?.map((opt: any) =>
            typeof opt === "string" ? { label: opt, value: opt } : opt
          );

          return (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q.question}
              options={normalizedOptions}
              type={q.type}
              value={answers[q.id as keyof DiagnosisAnswers] ?? null}
              onChange={(id: string, value: string | number | string[]) =>
                onChange({ [id]: value })
              }
              answers={answers}
            />
          );
        }

        // === カスタム質問（端末モデル選択） ===
        return (
          <QuestionCard
            key={q.id}
            id={q.id}
            question={q.question}
            type={q.type}
            value={answers.deviceModel ?? null}
            onChange={(id: string, value: string | number | string[]) =>
              handleDeviceChange(value as string)
            }
            answers={answers}
            options={[]}
          >
            <div className="mt-3 space-y-3">
              {deviceList.map(
                (series: {
                  series: string;
                  models: { label: string; storage: string[] }[];
                }) => {
                  const isOpen = openSections[series.series] ?? false;
                  return (
                    <div
                      key={series.series}
                      className="border border-sky-200 rounded-2xl overflow-hidden"
                    >
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
                }
              )}

              {/* その他 */}
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
        );
      })}

      {/* === ストレージ選択 === */}
      {(() => {
        const storageQuestion = deviceQuestions.find(
          (q) => q.id === "deviceStorage"
        );
        if (!storageQuestion?.condition?.(answers)) return null;

        const selectedModel = deviceList
          .flatMap((s) => s.models)
          .find((m) => m.label === answers.deviceModel);

        if (!selectedModel || !selectedModel.storage) return null;

        const normalizedStorageOptions = selectedModel.storage.map((s) => ({
          label: s,
          value: s,
        }));

        return (
          <QuestionCard
            id="deviceStorage"
            question={storageQuestion.question}
            options={normalizedStorageOptions}
            type="radio"
            value={answers.deviceStorage ?? null}
            onChange={(id: string, value: string | number | string[]) =>
              handleStorageChange(value as string)
            }
            answers={answers}
          />
        );
      })()}
    </div>
  );
});

export default DeviceSection;
