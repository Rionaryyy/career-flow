"use client";

import SubscriptionAccordion from "./SubscriptionAccordion";
import { Phase2Answers, Phase1Answers } from "@/types/types";
import { phase2SubscriptionQuestions } from "./Phase2SubscriptionQuestions";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
  phase1Answers: Phase1Answers; // フェーズ①の回答を受け取る
}

export default function Phase2Subscription({ answers, onChange, phase1Answers }: Props) {
  // ✅ フェーズ①で「サブスク料金を含めて比較しますか？」の回答をチェック
  const includeSubAnswer = phase1Answers?.includeSubscription ?? "";
  const showQuestions = includeSubAnswer.includes("はい");
  const showExplanationOnly = !showQuestions;

  // 🟦 「いいえ」の場合はスキップメッセージを表示
  if (showExplanationOnly) {
    return (
      <div className="w-full py-6 space-y-6">
        <p className="text-sky-900 text-lg">
          前提条件「契約予定のサブスクリプション料金や割引も“実質料金”に含めて比較しますか？」に「いいえ」と選択されたため、
          このページでのサブスクリプションに関する質問はスキップされます。
        </p>
      </div>
    );
  }

  // 🟩 「はい」の場合はサブスク質問カード群を表示
  return (
    <div className="w-full space-y-4">
      {/* メインカード */}
      <div className="w-full bg-white p-6 rounded-2xl border border-sky-200 shadow-md space-y-4">
        <p className="text-xl font-semibold text-sky-900 text-center">
          契約中または契約予定のサブスクリプションサービスを選択してください（複数選択可）
        </p>

        <div className="mt-4">
          <SubscriptionAccordion answers={answers} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
