// app/components/DiagnosisFlow/questions/deviceSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const deviceQuestions = [
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
      // ✅ 値が配列でも単一文字列でも対応
      const methodValue = Array.isArray(ans.devicePurchaseMethods)
        ? ans.devicePurchaseMethods[0]
        : ans.devicePurchaseMethods ?? "";

      // ✅ 正規店購入は除外、それ以外は表示
      return (
        ans.devicePreference === "はい（端末も一緒に購入する）" &&
        methodValue !== "" &&
        methodValue !== "Appleなど正規ストア・家電量販店で本体のみ購入したい"
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
