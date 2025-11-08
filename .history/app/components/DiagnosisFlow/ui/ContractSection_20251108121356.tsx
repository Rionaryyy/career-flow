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

  // 🔹 にゃんこボタン＋進行状況管理対応
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
    getCurrentIndex() {
      return currentIndex;
    },
    setCurrentIndex(i: number) {
      setCurrentIndex(i);
    },
  }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const handleChange = (id: keyof DiagnosisAnswers, value: string | number | string[]) => {
    onChange({ [id]: value } as Partial<DiagnosisAnswers>);
  };

  // 🔹 setDiscountのvalueは now label/value 構造に対応
  const hasService = (serviceValue: string) =>
    Array.isArray(answers.setDiscount) && answers.setDiscount.includes(serviceValue);

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
        {q.id === "ageGroup" && answers.ageGroup === "under18" && (
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
              options={[
                { label: "はい", value: "yes" },
                { label: "いいえ", value: "no" },
              ]}
              type="radio"
              value={answers.studentDiscount as string | null}
              onChange={handleChange}
              answers={answers}
            />
          </motion.div>
        )}

        {/* ▼ 家族割「4回線以上」に関する追加質問 */}
        {q.id === "familyLines" && answers.familyLines === "4plus" && (
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
              options={[
                { label: "4回線", value: "4" },
                { label: "5回線", value: "5" },
                { label: "6回線", value: "6" },
                { label: "7回線", value: "7" },
                { label: "8回線", value: "8" },
                { label: "9回線", value: "9" },
                { label: "10回線", value: "10" },
              ]}
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
            {hasService("fiber") && (
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
                  options={[
                    { label: "戸建て", value: "house" },
                    { label: "集合住宅（マンション・アパートなど）", value: "apartment" },
                  ]}
                  type="radio"
                  value={answers.fiberType as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
                {answers.fiberType === "house" && (
                  <QuestionCard
                    id="fiberSpeed"
                    question="希望する通信速度を選んでください"
                    options={[
                      { label: "1Gbps以上", value: "1g" },
                      { label: "2Gbps以上", value: "2g" },
                      { label: "5Gbps以上", value: "5g" },
                      { label: "10Gbps以上", value: "10g" },
                      { label: "特にこだわらない", value: "noPref" },
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
            {hasService("router") && (
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
                  options={[
                    { label: "〜20GB", value: "20gb" },
                    { label: "〜50GB", value: "50gb" },
                    { label: "100GB以上", value: "100gbplus" },
                    { label: "無制限", value: "unlimited" },
                    { label: "特にこだわらない", value: "noPref" },
                  ]}
                  type="radio"
                  value={answers.routerCapacity as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
                <QuestionCard
                  id="routerSpeed"
                  question="希望する通信速度を選んでください"
                  options={[
                    { label: "最大1Gbps", value: "1g" },
                    { label: "最大2Gbps", value: "2g" },
                    { label: "最大4Gbps", value: "4g" },
                    { label: "特にこだわらない", value: "noPref" },
                  ]}
                  type="radio"
                  value={answers.routerSpeed as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
              </motion.div>
            )}

            {/* ポケットWi-Fi */}
            {hasService("pocketwifi") && (
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
                  options={[
                    { label: "〜20GB", value: "20gb" },
                    { label: "〜50GB", value: "50gb" },
                    { label: "100GB", value: "100gb" },
                    { label: "無制限", value: "unlimited" },
                  ]}
                  type="radio"
                  value={answers.pocketWifiCapacity as string | null}
                  onChange={handleChange}
                  answers={answers}
                />
                <QuestionCard
                  id="pocketWifiSpeed"
                  question="希望する通信速度を選んでください"
                  options={[
                    { label: "100Mbps程度", value: "100mbps" },
                    { label: "300Mbps程度", value: "300mbps" },
                    { label: "500Mbps以上", value: "500mbpsplus" },
                    { label: "特にこだわらない", value: "noPref" },
                  ]}
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
    </div>
  );
});

export default ContractSection;
