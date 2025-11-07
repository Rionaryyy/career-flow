// app/components/DiagnosisFlow/ui/ContractSection.tsx
"use client";

import QuestionCard from "../../layouts/QuestionCard";
import { DiagnosisAnswers } from "@/types/types";
import { motion } from "framer-motion";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { FlowSectionProps } from "@/types/flowProps";
import { contractQuestions } from "../questions/contractSection";

const ContractSection = forwardRef(function ContractSection(
  { answers, onChange, onNext, onBack }: FlowSectionProps,
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    goNext() {
      if (currentIndex < contractQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onNext && onNext();
      }
    },
    isCompleted() {
      return currentIndex >= contractQuestions.length - 1;
    },
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (id: keyof DiagnosisAnswers, value: string | number | string[]) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  const hasService = (service: string) =>
    Array.isArray(answers.setDiscount) && answers.setDiscount.includes(service);

  const AdditionalBadge = ({ emoji, label }: { emoji: string; label: string }) => (
    <div className="absolute top-3 left-4 font-sans text-base font-medium text-pink-700 select-none">
      <span className="mr-1">{emoji}</span>
      <span>{label}</span>
    </div>
  );

  const q = contractQuestions[currentIndex];

  return (
    <div className="w-full py-6 space-y-6">
      <motion.div
        key={q.id}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <QuestionCard
          id={q.id}
          question={q.question}
          options={q.options}
          type={q.type}
          value={answers[q.id as keyof DiagnosisAnswers] as string | string[] | null}
          onChange={handleChange}
          answers={answers}
        />

        {/* ▼ 年齢「18歳以下」に関する追加質問 */}
        {q.id === "ageGroup" && answers.ageGroup === "18歳以下" && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full bg-white border border-pink-200 rounded-2xl p-5 pt-12 space-y-4 mt-6"
          >
            <AdditionalBadge emoji="🎓" label="「18歳以下」に関する追加質問" />
            <QuestionCard
              id="studentDiscount"
              question="学生ですか？"
              options={["はい", "いいえ"]}
              type="radio"
              value={answers.studentDiscount as string | null}
              onChange={handleChange}
              answers={answers}
            />
          </motion.div>
        )}

        {/* ▼ 家族割「4回線以上」に関する追加質問 */}
        {q.id === "familyLines" && answers.familyLines === "4回線以上" && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full bg-white border border-pink-200 rounded-2xl p-5 pt-12 space-y-4 mt-6"
          >
            <AdditionalBadge emoji="👪" label="「4回線以上」に関する追加質問" />
            <QuestionCard
              id="familyLinesDetail"
              question="具体的な回線数を教えてください"
              options={["4回線", "5回線", "6回線", "7回線", "8回線", "9回線", "10回線"]}
              type="radio"
              value={answers.familyLinesDetail as string | null}
              onChange={handleChange}
              answers={answers}
            />
          </motion.div>
        )}

        {/* ▼ セット割詳細 */}
        {q.id === "setDiscount" && (
          <div className="mt-6 space-y-6">
            {/* 光回線 */}
            {hasService("光回線の契約") && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full bg-blue-50 border border-blue-200 rounded-2xl p-5 pt-12 space-y-4"
              >
                <AdditionalBadge emoji="🌐" label="「光回線の契約」に関する追加質問" />
                <QuestionCard
                  id="fiberType"
                  question="光回線を契約するご自宅のタイプを教えてください"
                  options={["戸建て", "集合住宅（マンション・アパートなど）"]}
                  type="radio"
                  value={answers.fiberType as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
                {answers.fiberType === "戸建て" && (
                  <QuestionCard
                    id="fiberSpeed"
                    question="希望する通信速度を選んでください"
                    options={[
                      "1Gbps以上",
                      "2Gbps以上",
                      "5Gbps以上",
                      "10Gbps以上",
                      "特にこだわらない",
                    ]}
                    type="radio"
                    value={answers.fiberSpeed as string | null}
                    onChange={handleChange}
                    answers={answers}
                  />
                )}
              </motion.div>
            )}

            {/* ルーター */}
            {hasService("ルーター購入・レンタル") && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 pt-12 space-y-4"
              >
                <AdditionalBadge emoji="📶" label="「ルーター購入・レンタル」に関する追加質問" />
                <QuestionCard
                  id="routerCapacity"
                  question="希望するデータ容量を選んでください"
                  options={["〜20GB", "〜50GB", "100GB以上", "無制限", "特にこだわらない"]}
                  type="radio"
                  value={answers.routerCapacity as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
                <QuestionCard
                  id="routerSpeed"
                  question="希望する通信速度を選んでください"
                  options={["最大1Gbps", "最大2Gbps", "最大4Gbps", "特にこだわらない"]}
                  type="radio"
                  value={answers.routerSpeed as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
              </motion.div>
            )}

            {/* ポケットWi-Fi */}
            {hasService("ポケットWi-Fi契約") && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full bg-green-50 border border-green-200 rounded-2xl p-5 pt-12 space-y-4"
              >
                <AdditionalBadge emoji="📡" label="「ポケットWi-Fi契約」に関する追加質問" />
                <QuestionCard
                  id="pocketWifiCapacity"
                  question="希望するデータ容量を選んでください"
                  options={["〜20GB", "〜50GB", "100GB", "無制限"]}
                  type="radio"
                  value={answers.pocketWifiCapacity as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
                <QuestionCard
                  id="pocketWifiSpeed"
                  question="希望する通信速度を選んでください"
                  options={["100Mbps程度", "300Mbps程度", "500Mbps以上", "特にこだわらない"]}
                  type="radio"
                  value={answers.pocketWifiSpeed as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* ▼ 子ども専用プラン */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-pink-50 border border-pink-200 rounded-2xl p-5 space-y-4 mt-6"
      >
        <h3 className="font-sans text-pink-700 font-semibold text-base">
          👶 子ども専用プラン確認（追加オプション）
        </h3>
        <QuestionCard
          id="childUnder12Plan"
          question="追加で、12歳以下向け子ども専用プランでスマホ契約をする予定はありますか？"
          options={["はい", "いいえ"]}
          type="radio"
          value={answers.childUnder12Plan as string | null}
          onChange={(id, value) =>
            onChange({ [id]: value, target: "child_under12" } as Partial<DiagnosisAnswers>)
          }
          answers={answers}
        />
        <p className="text-sm text-pink-600">※ 子ども専用プランは大手キャリアのみ提供されます</p>
      </motion.div>
    </div>
  );
});

export default ContractSection;
