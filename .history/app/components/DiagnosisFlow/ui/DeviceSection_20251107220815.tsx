"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { deviceList } from "@/data/DeviceList";
import { FlowSectionProps } from "@/types/flowProps";
import { deviceQuestions } from "../questions/deviceSection";

const DeviceSection = forwardRef(function DeviceSection(
  { answers, onChange, onNext }: FlowSectionProps,
  ref
) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 DiagnosisFlow から制御されるためのメソッド定義
  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < deviceQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= deviceQuestions.length - 1;
    },
    // 🧭 戻る時の位置復元用
    getCurrentIndex() {
      return currentIndex;
    },
    setCurrentIndex(i: number) {
      setCurrentIndex(i);
    },
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  // === セクション開閉処理 ===
  const toggleSection = (series: string) => {
    setOpenSections((prev) => ({ ...prev, [series]: !prev[series] }));
  };

  // === デバイス関連の回答処理 ===
  const handleDeviceChange = (model: string) => {
    onChange({ deviceModel: model, deviceStorage: null });
  };

  const handleStorageChange = (storage: string) => {
    onChange({ deviceStorage: storage });
  };

  const q = deviceQuestions[currentIndex];

  return (
    <div className="w-full space-y-6 py-6">
      {/* === 通常質問カード === */}
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
          options={[]}
        >
          <div className="mt-3 space-y-3">
            {deviceList.map((series) => {
              const isOpen = openSections[series.series] ?? false;
              return (
                <div
                  key={series.series}
                  className="border border-sky-200 rounded-2xl overflow-hidden"
                >
                  {/* ▼ シリーズ名ボタン */}
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

                  {/* ▼ モデル一覧 */}
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

            {/* ▼ その他 */}
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

      {/* === ストレージ選択 === */}
      {deviceQuestions
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
    </div>
  );
});

export default DeviceSection;
