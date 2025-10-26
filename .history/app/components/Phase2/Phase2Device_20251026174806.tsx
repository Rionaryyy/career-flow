"use client";

import { useState } from "react";
import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";
import { deviceList } from "./phase2DeviceList";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Device({ answers, onChange }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (series: string) => {
    setOpenSections((prev) => ({ ...prev, [series]: !prev[series] }));
  };

  const handleDeviceChange = (model: string) => {
    onChange({ deviceModel: model, deviceStorage: null });
  };

  const handleStorageChange = (storage: string) => {
    onChange({ deviceStorage: storage });
  };

  const devicePreferenceQuestion = {
    id: "devicePreference",
    question: "新しい端末も一緒に購入する予定ですか？",
    options: ["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"],
    type: "radio" as const,
  };

  const devicePurchaseMethodsQuestion = {
    id: "devicePurchaseMethods",
    question: "端末の購入方法",
    options: [
      "Appleなど正規ストア・家電量販店で本体のみ購入したい",
      "キャリアで端末を購入したい（通常購入）",
      "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
    ],
    type: "radio" as const,
    condition: (ans: Phase2Answers) => ans.devicePreference === "はい（端末も一緒に購入する）",
  };

  const deviceModelQuestion = {
    id: "deviceModel",
    question: "購入したい端末を選択してください",
    type: "custom" as const,
    condition: (ans: Phase2Answers) => {
      return (
        ans.devicePreference === "はい（端末も一緒に購入する）" &&
        ans.devicePurchaseMethods &&
        ans.devicePurchaseMethods.length > 0 &&
        ans.devicePurchaseMethods[0] !== "Appleなど正規ストア・家電量販店で本体のみ購入したい"
      );
    },
  };

  const deviceStorageQuestion = {
    id: "deviceStorage",
    question: "選んだ端末のストレージ容量を選択してください",
    type: "radio" as const,
    condition: (ans: Phase2Answers) =>
      ans.deviceModel != null && ans.deviceModel !== "その他",
  };

  return (
    <div className="w-full space-y-6 py-6">
      {/* 1. 端末購入の有無 */}
      <QuestionCard
        id={devicePreferenceQuestion.id}
        question={devicePreferenceQuestion.question}
        options={devicePreferenceQuestion.options}
        type={devicePreferenceQuestion.type}
        value={answers.devicePreference ?? null}
        onChange={(id, value) => onChange({ [id]: value })}
        answers={answers}
      />

      {/* 2. 端末購入方法 */}
      {devicePurchaseMethodsQuestion.condition?.(answers) && (
        <QuestionCard
          id={devicePurchaseMethodsQuestion.id}
          question={devicePurchaseMethodsQuestion.question}
          options={devicePurchaseMethodsQuestion.options}
          type={devicePurchaseMethodsQuestion.type}
          value={answers.devicePurchaseMethods?.[0] ?? null}
          onChange={(id, value) =>
            onChange({ [id]: [value as string], deviceModel: null, deviceStorage: null })
          }
          answers={answers}
        />
      )}

      {/* 3. 端末モデル選択 (サブスク風アコーディオン UI) */}
      {deviceModelQuestion.condition?.(answers) && (
        <QuestionCard
          id={deviceModelQuestion.id}
          question={deviceModelQuestion.question}
          type={deviceModelQuestion.type}
          value={answers.deviceModel ?? null}
          onChange={(id, value) => handleDeviceChange(value as string)}
          answers={answers}
          options={[]} // 型を満たすために空配列
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

      {/* 4. ストレージ選択 */}
      {deviceStorageQuestion.condition?.(answers) && (
        <QuestionCard
          id={deviceStorageQuestion.id}
          question={deviceStorageQuestion.question}
          options={
            deviceList
              .flatMap((s) => s.models)
              .find((m) => m.label === answers.deviceModel)?.storage ?? []
          }
          type={deviceStorageQuestion.type}
          value={answers.deviceStorage ?? null}
          onChange={(id, value) => handleStorageChange(value as string)}
          answers={answers}
        />
      )}
    </div>
  );
}
