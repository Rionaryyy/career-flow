// app/components/DiagnosisFlow/questions/dataSection.ts
import { DiagnosisAnswers } from "@/types/types";

export const dataQuestions = [
  {
    id: "dataUsage",
    question: "月にどのくらいのデータ通信量が必要ですか？",
    type: "radio" as const,
    options: [
      { label: "できるだけ安く使いたい（容量は少なくてOK）", value: "minimal" },
      { label: "3GB以上（Wi-Fiメイン・通話専用など）", value: "3gb" },
      { label: "5GB以上（ライトユーザー・SNS中心）", value: "5gb" },
      { label: "10GB以上（標準的な利用・動画も少し）", value: "10gb" },
      { label: "20GB以上（外出時もよく使う）", value: "20gb" },
      { label: "30GB以上（大容量ユーザー・動画中心）", value: "30gb" },
      { label: "50GB以上（モバイル中心・高頻度利用）", value: "50gb" },
      { label: "無制限（上限なしで使いたい）", value: "unlimited" },
    ],
  },
  {
    id: "speedLimitImportance",
    question: "速度制限後の通信速度について、どの程度の快適さを求めますか？",
    type: "radio" as const,
    options: [
      { label: "大手キャリア水準以上（1〜3Mbps・YouTube低画質も可）", value: "high" },
      { label: "サブブランド水準以上（0.5〜1Mbps・SNSやWeb閲覧は可）", value: "medium" },
      { label: "格安SIM水準でも可（128〜300kbps・チャット中心向け）", value: "low" },
    ],
    condition: (ans: DiagnosisAnswers) =>
      ans.dataUsage !== "unlimited" &&
      ans.dataUsage !== null &&
      ans.dataUsage !== "",
  },
  {
    id: "tetheringNeeded",
    question: "テザリング機能は必要ですか？",
    type: "radio" as const,
    options: [
      { label: "はい（必要）", value: "yes" },
      { label: "いいえ（不要）", value: "no" },
    ],
  },
  {
    id: "tetheringUsage",
    question: "テザリングを利用する場合、月にどのくらいのデータ量が必要ですか？",
    type: "radio" as const,
    options: [
      { label: "30GB以上（出先での作業やPC接続が多い）", value: "30gb" },
      { label: "60GB以上（在宅ワークなどで頻繁に利用）", value: "60gb" },
      { label: "制限なし・無制限プラン希望", value: "unlimited" },
    ],
    condition: (ans: DiagnosisAnswers) => ans.tetheringNeeded === "yes",
  },
] satisfies {
  id: keyof DiagnosisAnswers;
  question: string;
  type: "radio";
  options: { label: string; value: string }[];
  condition?: (ans: DiagnosisAnswers) => boolean;
}[];
