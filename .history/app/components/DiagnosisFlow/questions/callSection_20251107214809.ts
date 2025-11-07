// app/components/DiagnosisFlow/questions/callSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const callQuestions = [
  {
    id: "needCallPlan",
    question: "かけ放題オプションを利用したいですか？",
    options: [
      "はい（利用したい）",
      "いいえ（使った分だけ支払いたい）",
      "よくわからない（おすすめを知りたい）",
    ],
    type: "radio" as const,
  },
  {
    id: "unknownCallUsageDuration",
    question: "1回あたりの通話時間に最も近いものを選んでください。",
    options: [
      "ほとんど通話しない（LINEなど中心）",
      "5分以内（短い確認や予約など）",
      "15分以内（家族・友人との通話が多い）",
      "30分以内（仕事や長めの通話が多い）",
      "30分以上（長時間・業務通話など）",
    ],
    type: "radio" as const,
    condition: (ans: DiagnosisAnswers) =>
      ans.needCallPlan === "よくわからない（おすすめを知りたい）",
  },
  {
    id: "unknownCallFrequency",
    question: "1週間あたりどのくらい通話しますか？",
    options: ["週1〜2回程度", "週3〜4回程度", "週5〜6回程度", "ほぼ毎日"],
    type: "radio" as const,
    condition: (ans: DiagnosisAnswers) =>
      ans.needCallPlan === "よくわからない（おすすめを知りたい）" &&
      !!ans.unknownCallUsageDuration,
  },
  {
    id: "needCallPlanConfirm",
    question: "上記アドバイスを参考に、かけ放題を利用したいですか？",
    options: ["はい（利用したい）", "いいえ（使った分だけ支払いたい）"],
    type: "radio" as const,
    condition: (ans: DiagnosisAnswers) =>
      ans.needCallPlan === "よくわからない（おすすめを知りたい）" &&
      !!ans.unknownCallUsageDuration &&
      !!ans.unknownCallFrequency,
  },
  {
    id: "callPlanType",
    question: "検討したいかけ放題タイプを選んでください（複数選択可）",
    options: [
      "1回あたりの通話時間に上限があるプラン（例：5分以内無料）",
      "月内の合計通話時間に上限があるプラン（例：月60分まで無料）",
      "月に決まった回数まで◯分通話できるプラン（例：月30回まで各10分無料）",
      "特にこだわらない（どれでも良い）",
    ],
    type: "checkbox" as const,
    condition: (ans: DiagnosisAnswers) =>
      ans.needCallPlan === "はい（利用したい）" ||
      ans.needCallPlanConfirm === "はい（利用したい）",
  },
  {
    id: "timeLimitPreference",
    question:
      "希望する時間制限型のかけ放題範囲を選んでください（※選択した時間より短いプランは比較対象外になります）",
    options: [
      "5分以内（短時間の通話が多い）",
      "10分以内（軽めの通話が多い）",
      "15分以内（中程度の通話が多い）",
      "30分以内（やや長めの通話）",
      "無制限（制限なくかけ放題）",
    ],
    type: "radio" as const,
    condition: (ans: DiagnosisAnswers) =>
      Array.isArray(ans.callPlanType) &&
      ans.callPlanType.some((t) => t.includes("1回あたり")),
  },
  {
    id: "monthlyLimitPreference",
    question:
      "希望する月間制限型の範囲を選んでください。（※選択した上限より少ない時間のプランは比較対象外になります）",
    options: ["月60分まで無料", "月70分まで無料", "月100分まで無料", "無制限（完全定額）"],
    type: "radio" as const,
    condition: (ans: DiagnosisAnswers) =>
      Array.isArray(ans.callPlanType) &&
      ans.callPlanType.some((t) => t.includes("合計通話時間")),
  },
  {
    id: "hybridCallPreference",
    question:
      "希望する回数＋時間制限型の範囲を選んでください。（※選択した上限より少ないプランは比較対象外になります）",
    options: [
      "月30回まで各10分無料（よくある定番タイプ）",
      "月50回まで各10分無料（通話回数が多い方向け）",
      "無制限（回数制限なし）",
    ],
    type: "radio" as const,
    condition: (ans: DiagnosisAnswers) =>
      Array.isArray(ans.callPlanType) &&
      ans.callPlanType.some((t) => t.includes("回数まで")),
  },
  {
    id: "needInternationalCallUnlimited",
    question: "海外へのかけ放題オプションは必要ですか？",
    options: ["はい", "いいえ"],
    type: "radio" as const,
  },
  {
    id: "internationalCallCarrier",
    question:
      "⚠️ 現在、海外通話かけ放題に対応しているのは以下のキャリアのみです。希望するものを選択してください（複数選択可）\n\n※ここで選択したキャリアのみ、以降のプラン比較に反映されます。",
    options: [
      "楽天モバイル（国際通話かけ放題：¥980/月・65カ国対象）",
      "au（国際通話定額：月900分・23カ国対象）",
    ],
    type: "checkbox" as const,
    condition: (ans: DiagnosisAnswers) => ans.needInternationalCallUnlimited === "はい",
  },
  {
    id: "callOptionsNeeded",
    question: "留守番電話のオプションは必要ですか？",
    options: ["はい（必要）", "いいえ（不要）"],
    type: "radio" as const,
  },
];
