// app/components/DiagnosisFlow/questions/deviceSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const deviceQuestions = [
  {
    id: "devicePreference",
    question: "新しい端末も一緒に購入する予定ですか？",
    type: "radio" as const,
    options: [
      { label: "はい（端末も一緒に購入する）", value: "yes" },
      { label: "いいえ（SIMのみ契約する予定）", value: "no" },
    ],
  },
  {
    id: "devicePurchaseMethods",
    question: "端末の購入方法",
    type: "radio" as const,
    options: [
      {
        label: "Appleなど正規ストア・家電量販店で本体のみ購入したい",
        value: "store_purchase",
      },
      {
        label: "キャリアで端末を購入したい（通常購入）",
        value: "carrier_purchase",
      },
      {
        label: "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
        value: "carrier_return",
      },
    ],
    condition: (ans: DiagnosisAnswers) => ans.devicePreference === "yes",
  },
  {
    id: "deviceModel",
    question: "購入したい端末を選択してください",
    type: "custom" as const,
    condition: (ans: DiagnosisAnswers) => {
      const methodValue = Array.isArray(ans.devicePurchaseMethods)
        ? ans.devicePurchaseMethods[0]
        : ans.devicePurchaseMethods ?? "";

      if (!methodValue) return false;

      return ans.devicePreference === "yes" && methodValue !== "store_purchase";
    },
  },
  {
    id: "deviceStorage",
    question: "選んだ端末のストレージ容量を選択してください",
    type: "radio" as const,
    options: [
      { label: "64GB", value: "64" },
      { label: "128GB", value: "128" },
      { label: "256GB", value: "256" },
      { label: "512GB", value: "512" },
      { label: "1TB", value: "1024" },
    ],
    condition: (ans: DiagnosisAnswers) =>
      ans.deviceModel != null && ans.deviceModel !== "その他",
  },
] satisfies {
  id: keyof DiagnosisAnswers;
  question: string;
  type: "radio" | "custom";
  options?: { label: string; value: string }[];
  condition?: (ans: DiagnosisAnswers) => boolean;
}[];
