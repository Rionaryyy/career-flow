"use client";

import QuestionCard from "../layouts/QuestionCard";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Device({ answers, onChange }: Props) {
  const deviceOptions = [
  { label: "iPhone 17", id: "iphone17", storage: ["256GB", "512GB"] },
  { label: "iPhone 17 Pro", id: "iphone17Pro", storage: ["256GB", "512GB", "1TB"] },
  { label: "iPhone 17 Pro Max", id: "iphone17ProMax", storage: ["256GB", "512GB", "1TB", "2TB"] },
  { label: "iPhone 17 Air", id: "iphone17Air", storage: ["256GB", "512GB", "1TB"] },
  { label: "Pixel 10", id: "pixel10", storage: ["128GB", "256GB"] },
  { label: "Pixel 10 Pro", id: "pixel10Pro", storage: ["128GB", "256GB", "512GB", "1TB"] },
  { label: "Pixel 10 Pro XL", id: "pixel10ProXL", storage: ["128GB", "256GB", "512GB", "1TB"] },
  { label: "Pixel 10 Pro Fold", id: "pixel10ProFold", storage: ["256GB", "512GB", "1TB"] },
  { label: "Xperia 1 VI", id: "xperia1VI", storage: ["256GB", "512GB"] },
  { label: "Galaxy S25", id: "galaxyS25", storage: ["128GB", "256GB", "512GB", "1TB"] },
  { label: "Galaxy S25+", id: "galaxyS25Plus", storage: ["256GB", "512GB"] },
  { label: "Galaxy S25 Ultra", id: "galaxyS25Ultra", storage: ["256GB", "512GB", "1TB"] },
  { label: "Galaxy S25 Edge", id: "galaxyS25Edge", storage: ["256GB", "512GB"] },
  { label: "Galaxy S25 FE", id: "galaxyS25FE", storage: ["128GB", "256GB", "512GB"] },
];

  const questions = [
    {
      id: "devicePreference",
      question: "1. 新しい端末も一緒に購入する予定ですか？",
      options: ["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"],
      type: "radio" as const,
    },
    {
      id: "devicePurchaseMethods",
      question: "2. 端末の購入方法",
      options: [
        "Appleなど正規ストア・家電量販店で本体のみ購入したい",
        "キャリアで端末を購入したい（通常購入）",
        "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
        "どれが最もお得か分からないので、すべてのパターンを比較したい",
      ],
      type: "radio" as const, // ラジオに変更
      condition: (ans: Phase2Answers) =>
        ans.devicePreference === "はい（端末も一緒に購入する）",
    },
    {
      id: "deviceModel",
      question: "3. 購入したい端末を選択してください",
      options: [...deviceOptions.map((d) => d.label), "その他"],
      type: "radio" as const,
      condition: (ans: Phase2Answers) => {
        if (ans.devicePreference !== "はい（端末も一緒に購入する）") return false;
        if (!ans.devicePurchaseMethods || ans.devicePurchaseMethods.length === 0) return false;

        const onlyRegular = (ans.devicePurchaseMethods as string[]).every(
          (m) => m === "Appleなど正規ストア・家電量販店で本体のみ購入したい"
        );
        return !onlyRegular;
      },
    },
    {
      id: "deviceStorage",
      question: "4. 選んだ端末のストレージ容量を選択してください",
      options: [] as string[],
      type: "radio" as const,
      condition: (ans: Phase2Answers) =>
        ans.devicePreference === "はい（端末も一緒に購入する）" &&
        ans.deviceModel != null &&
        ans.deviceModel !== "その他",
    },
  ];

  const handleChange = (id: string, value: string | string[]) => {
    if (id === "devicePurchaseMethods") {
      // ラジオとして単一値を内部的には配列で保持
      onChange({
        devicePurchaseMethods: [value as string],
        deviceModel: null,
        deviceStorage: null,
      } as Partial<Phase2Answers>);
      return;
    }

    if (id === "deviceModel") {
      const selectedDevice = deviceOptions.find((d) => d.label === value);
      if (selectedDevice) {
        onChange({
          deviceModel: value,
          deviceStorage: null,
        } as Partial<Phase2Answers>);
        return;
      }
    }

    onChange({ [id]: value } as Partial<Phase2Answers>);
  };

  return (
    <div className="w-full py-6 space-y-6">
      {questions.map((q) => {
        if (q.condition && !q.condition(answers)) return null;

        let options = q.options;
        if (q.id === "deviceStorage" && answers.deviceModel) {
          const selectedDevice = deviceOptions.find((d) => d.label === answers.deviceModel);
          if (selectedDevice) options = selectedDevice.storage;
        }

        const currentValue =
          q.id === "devicePurchaseMethods"
            ? answers.devicePurchaseMethods?.[0] ?? null
            : (answers[q.id as keyof Phase2Answers] as string | null);

        return (
          <QuestionCard
            key={q.id}
            id={q.id}
            question={q.question}
            options={options}
            type={q.type}
            value={currentValue}
            onChange={handleChange}
            answers={answers}
          />
        );
      })}
    </div>
  );
}
