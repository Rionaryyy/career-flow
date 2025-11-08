// app/components/DiagnosisFlow/questions/callSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const callQuestions = [
  {
    id: "needCallPlan",
    question: "かけ放題オプションを利用したいですか？",
    type: "radio" as const,
    options: [
      { label: "はい（利用したい）", value: "yes" },
      { label: "いいえ（使った分だけ支払いたい）", value: "no" },
      { label: "よくわからない（おすすめを知りたい）", value: "unknown" },
    ],
  },
  {
    id: "unknownCallUsageDuration",
    question: "1回あたりの通話時間に最も近いものを選んでください。",
    type: "radio" as const,
    options: [
      { label: "ほとんど通話しない（LINEなど中心）", value: "none" },
      { label: "5分以内（短い確認や予約など）", value: "5min" },
      { label: "15分以内（家族・友人との通話が多い）", value: "15min" },
      { label: "30分以内（仕事や長めの通話が多い）", value: "30min" },
      { label: "30分以上（長時間・業務通話など）", value: "over30min" },
    ],
    condition: (ans: DiagnosisAnswers) => ans.needCallPlan === "unknown",
  },
  {
    id: "unknownCallFrequency",
    question: "1週間あたりどのくらい通話しますか？",
    type: "radio" as const,
    options: [
      { label: "週1〜2回程度", value: "1to2" },
      { label: "週3〜4回程度", value: "3to4" },
      { label: "週5〜6回程度", value: "5to6" },
      { label: "ほぼ毎日", value: "everyday" },
    ],
    condition: (ans: DiagnosisAnswers) =>
      ans.needCallPlan === "unknown" && !!ans.unknownCallUsageDuration,
  },
  {
    id: "needCallPlanConfirm",
    question: "上記アドバイスを参考に、かけ放題を利用したいですか？",
    type: "radio" as const,
    options: [
      { label: "はい（利用したい）", value: "yes" },
      { label: "いいえ（使った分だけ支払いたい）", value: "no" },
    ],
    condition: (ans: DiagnosisAnswers) =>
      ans.needCallPlan === "unknown" &&
      !!ans.unknownCallUsageDuration &&
      !!ans.unknownCallFrequency,
  },
  {
    id: "callPlanType",
    question: "検討したいかけ放題タイプを選んでください（複数選択可）",
    type: "checkbox" as const,
    options: [
      {
        label: "1回あたりの通話時間に上限があるプラン（例：5分以内無料）",
        value: "timeLimit",
      },
      {
        label: "月内の合計通話時間に上限があるプラン（例：月60分まで無料）",
        value: "monthlyLimit",
      },
      {
        label: "月に決まった回数まで◯分通話できるプラン（例：月30回まで各10分無料）",
        value: "hybrid",
      },
      { label: "特にこだわらない（どれでも良い）", value: "noPreference" },
    ],
    condition: (ans: DiagnosisAnswers) =>
      ans.needCallPlan === "yes" || ans.needCallPlanConfirm === "yes",
  },
  {
    id: "timeLimitPreference",
    question:
      "希望する時間制限型のかけ放題範囲を選んでください（※選択した時間より短いプランは比較対象外になります）",
    type: "radio" as const,
    options: [
      { label: "5分以内（短時間の通話が多い）", value: "5min" },
      { label: "10分以内（軽めの通話が多い）", value: "10min" },
      { label: "15分以内（中程度の通話が多い）", value: "15min" },
      { label: "30分以内（やや長めの通話）", value: "30min" },
      { label: "無制限（制限なくかけ放題）", value: "unlimited" },
    ],
    condition: (ans: DiagnosisAnswers) =>
      Array.isArray(ans.callPlanType) &&
      ans.callPlanType.includes("timeLimit"),
  },
  {
    id: "monthlyLimitPreference",
    question:
      "希望する月間制限型の範囲を選んでください。（※選択した上限より少ない時間のプランは比較対象外になります）",
    type: "radio" as const,
    options: [
      { label: "月60分まで無料", value: "60min" },
      { label: "月70分まで無料", value: "70min" },
      { label: "月100分まで無料", value: "100min" },
      { label: "無制限（完全定額）", value: "unlimited" },
    ],
    condition: (ans: DiagnosisAnswers) =>
      Array.isArray(ans.callPlanType) &&
      ans.callPlanType.includes("monthlyLimit"),
  },
  {
    id: "hybridCallPreference",
    question:
      "希望する回数＋時間制限型の範囲を選んでください。（※選択した上限より少ないプランは比較対象外になります）",
    type: "radio" as const,
    options: [
      { label: "月30回まで各10分無料（よくある定番タイプ）", value: "30x10" },
      { label: "月50回まで各10分無料（通話回数が多い方向け）", value: "50x10" },
      { label: "無制限（回数制限なし）", value: "unlimited" },
    ],
    condition: (ans: DiagnosisAnswers) =>
      Array.isArray(ans.callPlanType) &&
      ans.callPlanType.includes("hybrid"),
  },
  {
    id: "needInternationalCallUnlimited",
    question: "海外へのかけ放題オプションは必要ですか？",
    type: "radio" as const,
    options: [
      { label: "はい", value: "yes" },
      { label: "いいえ", value: "no" },
    ],
  },
  {
    id: "internationalCallCarrier",
    question:
      "⚠️ 現在、海外通話かけ放題に対応しているのは以下のキャリアのみです。希望するものを選択してください（複数選択可）\n\n※ここで選択したキャリアのみ、以降のプラン比較に反映されます。",
    type: "checkbox" as const,
    options: [
      {
        label:
          "楽天モバイル（国際通話かけ放題：¥980/月・65カ国対象）",
        value: "rakuten",
      },
      {
        label: "au（国際通話定額：月900分・23カ国対象）",
        value: "au",
      },
    ],
    condition: (ans: DiagnosisAnswers) =>
      ans.needInternationalCallUnlimited === "yes",
  },
  {
    id: "callOptionsNeeded",
    question: "留守番電話のオプションは必要ですか？",
    type: "radio" as const,
    options: [
      { label: "はい（必要）", value: "yes" },
      { label: "いいえ（不要）", value: "no" },
    ],
  },
] satisfies {
  id: keyof DiagnosisAnswers;
  question: string;
  type: "radio" | "checkbox";
  options: { label: string; value: string }[];
  condition?: (ans: DiagnosisAnswers) => boolean;
}[];
