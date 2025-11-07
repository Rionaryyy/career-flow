"use client";

import QuestionCard from "../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { FlowSectionProps } from "@/types/flowProps";

const Phase2Data = forwardRef(function Phase2Data(
  { answers, onChange, onNext, onBack }: FlowSectionProps,
  ref
) {
  const questions = [
    {
      id: "dataUsage",
      question: "月にどのくらいのデータ通信量が必要ですか？",
      options: [
        "できるだけ安く使いたい（容量は少なくてOK）",
        "3GB以上（Wi-Fiメイン・通話専用など）",
        "5GB以上（ライトユーザー・SNS中心）",
        "10GB以上（標準的な利用・動画も少し）",
        "20GB以上（外出時もよく使う）",
        "30GB以上（大容量ユーザー・動画中心）",
        "50GB以上（モバイル中心・高頻度利用）",
        "無制限（上限なしで使いたい）",
      ],
      type: "radio" as const,
    },
    {
      id: "speedLimitImportance",
      question: "速度制限後の通信速度について、どの程度の快適さを求めますか？",
      options: [
        "大手キャリア水準以上（1〜3Mbps・YouTube低画質も可）",
        "サブブランド水準以上（0.5〜1Mbps・SNSやWeb閲覧は可）",
        "格安SIM水準でも可（128〜300kbps・チャット中心向け）",
      ],
      type: "radio" as const,
      condition: (ans: DiagnosisAnswers) =>
        ans.dataUsage !== "無制限（上限なしで使いたい）" &&
        ans.dataUsage !== null &&
        ans.dataUsage !== "",
    },
    {
      id: "tetheringNeeded",
      question: "テザリング機能は必要ですか？",
      options: ["はい（必要）", "いいえ（不要）"],
      type: "radio" as const,
    },
    {
      id: "tetheringUsage",
      question: "テザリングを利用する場合、月にどのくらいのデータ量が必要ですか？",
      options: [
        "30GB以上（出先での作業やPC接続が多い）",
        "60GB以上（在宅ワークなどで頻繁に利用）",
        "制限なし・無制限プラン希望",
      ],
      type: "radio" as const,
      condition: (ans: DiagnosisAnswers) => String(ans.tetheringNeeded).includes("はい"),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 外部制御（にゃんこボタン対応）
  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= questions.length - 1;
    },
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (id: keyof DiagnosisAnswers, value: string | number | string[]) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const q = questions[currentIndex];

  return (
    <div className="w-full py-6 space-y-6">
      {/* === 現在の質問カード === */}
      <QuestionCard
        key={q.id}
        id={q.id}
        question={q.question}
        options={q.options}
        type={q.type}
        value={answers[q.id as keyof DiagnosisAnswers] as string | null}
        onChange={handleChange}
        answers={answers}
      />

      {/* === 条件付き質問を同ページ内で展開 === */}
      {questions
        .filter((sub) => sub.condition && sub.condition(answers))
        .filter((sub) => sub.id !== q.id)
        .map((sub) => (
          <div key={sub.id} className="mt-4 pl-4 border-l-4 border-sky-200">
            <QuestionCard
              id={sub.id}
              question={sub.question}
              options={sub.options}
              type={sub.type}
              value={answers[sub.id as keyof DiagnosisAnswers] as string | null}
              onChange={handleChange}
              answers={answers}
            />
          </div>
        ))}

      {/* 🐾 にゃんこボタン制御へ統一（ページ操作ボタン削除） */}
    </div>
  );
});

export default Phase2Data;
