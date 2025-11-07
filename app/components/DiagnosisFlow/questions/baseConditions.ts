// app/components/DiagnosisFlow/questions/baseConditions.ts
import { DiagnosisAnswers } from "@/types/types";

export const baseConditionsQuestions = [
  {
    id: "carrierType",
    question: "キャリアの種類に希望はありますか？",
    type: "radio" as const,
    options: [
      "大手キャリアのみで検討したい（ドコモ / au / ソフトバンク / 楽天）",
      "サブブランドも含めて検討したい（ahamo / povo / LINEMO / UQなど）",
      "格安SIMも含めて検討したい（IIJ / mineo / NUROなど）",
    ],
  },
  {
    id: "networkQuality",
    question: "通信品質（速度・安定性）はどの程度重視しますか？",
    type: "radio" as const,
    options: [
      "とても重視する（大手キャリア水準）",
      "ある程度重視する（サブブランド水準以上）",
      "こだわらない（コスト最優先）",
    ],
  },
  {
    id: "includePoints",
    question:
      "ポイント還元や経済圏特典も“実質料金”に含めて考えますか？",
    type: "radio" as const,
    options: [
      "はい（ポイントも含めて最安を知りたい）",
      "いいえ（現金支出だけで比べたい）",
    ],
  },
  {
    id: "includeSubscription",
    question:
      "契約予定のサブスクリプション料金や割引も“実質料金”に含めて比較しますか？",
    type: "radio" as const,
    options: [
      "はい（通信＋サブスクの実質料金で比較したい）",
      "いいえ（通信料金のみで比較したい）",
    ],
  },
  {
    id: "considerCardAndPayment",
    question:
      "お得になるなら、専用クレジットカードの発行や特定の支払い方法の利用も検討しますか？",
    type: "radio" as const,
    options: [
      "はい（条件次第でカード発行・支払い方法の変更もOK）",
      "いいえ（今ある支払い方法の範囲で考えたい）",
    ],
  },
  {
    id: "appCallUnlimited",
    question:
      "各社提供の通話アプリ経由の通話も、かけ放題の対象に含めてよいですか？（例：楽天リンク）",
    type: "radio" as const,
    options: [
      "はい（アプリ経由ならかけ放題として扱う）",
      "いいえ（通常プランのかけ放題のみを考慮する）",
    ],
  },
  {
    id: "contractMethod",
    question: "契約はどの方法で行いたいですか？",
    type: "radio" as const,
    options: [
      "店頭で申し込みたい（店舗スタッフに相談しながら）",
      "オンラインで申し込みたい（Web手続きで完結したい）",
      "どちらでも構わない（条件が良い方を優先）",
    ],
  },
  {
    id: "compareAxis",
    question: "料金を比べるとき、どんな基準で比べたいですか？",
    type: "radio" as const,
    options: [
      "毎月の支払い額だけで比べたい",
      "実際に支払う金額で比べたい",
    ],
  },
] satisfies {
  id: keyof DiagnosisAnswers;
  question: string;
  type: "radio" | "checkbox";
  options: string[];
}[];
