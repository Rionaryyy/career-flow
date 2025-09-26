"use client";

import React from "react";
import type { DiagnosisAnswers } from "../types/types";

interface Phase1Props {
  answers: DiagnosisAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers>>;
  nextPhase: () => void;
}

export default function Phase1({ answers, setAnswers, nextPhase }: Phase1Props) {
  const allAnswered =
    answers.includePoints !== "" &&
    answers.qualityPriority !== "" &&
    answers.carrierType !== "" &&
    answers.supportPreference !== "" &&
    answers.contractLockPreference !== "";

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
  📍 フェーズ①：前提条件（テスト中）
</h2>


      <div className="space-y-6">
        {/* Q1 */}
        <div>
          <p className="font-semibold mb-2 text-gray-800">
            ポイント還元や経済圏特典も「実質料金」に含めて考えますか？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, includePoints: "include_points" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.includePoints === "include_points"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              はい（ポイントも含めて最安を知りたい）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, includePoints: "exclude_points" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.includePoints === "exclude_points"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              いいえ（現金支出だけで比べたい）
            </button>
          </div>
        </div>

        {/* Q2 */}
        <div>
          <p className="font-semibold mb-2 text-gray-800">
            通信品質（速度・安定性）はどの程度重視しますか？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, qualityPriority: "high_quality" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.qualityPriority === "high_quality"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              とても重視する（大手キャリア水準が望ましい）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, qualityPriority: "mid_quality" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.qualityPriority === "mid_quality"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              ある程度重視する（格安でも安定していればOK）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, qualityPriority: "low_quality" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.qualityPriority === "low_quality"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              こだわらない（コスト最優先）
            </button>
          </div>
        </div>

        {/* Q3 */}
        <div>
          <p className="font-semibold mb-2 text-gray-800">キャリアの種類に希望はありますか？</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, carrierType: "major_carrier" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.carrierType === "major_carrier"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              大手キャリア（ドコモ / au / ソフトバンク / 楽天）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, carrierType: "sub_brand" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.carrierType === "sub_brand"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              サブブランド（ahamo / povo / LINEMO / UQなど）もOK
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, carrierType: "mvno" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.carrierType === "mvno"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              格安SIM（IIJ / mineo / NUROなど）も含めて検討したい
            </button>
          </div>
        </div>

        {/* Q4 */}
        <div>
          <p className="font-semibold mb-2 text-gray-800">サポート体制について希望はありますか？</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, supportPreference: "support_online" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.supportPreference === "support_online"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              オンライン完結で十分
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, supportPreference: "support_instore" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.supportPreference === "support_instore"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              店頭サポートが必要
            </button>
          </div>
        </div>

        {/* Q5 */}
        <div>
          <p className="font-semibold mb-2 text-gray-800">
            契約期間や解約金の有無について重視しますか？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, contractLockPreference: "prefer_no_lock" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.contractLockPreference === "prefer_no_lock"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              重視する（縛りなし・違約金なしがよい）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, contractLockPreference: "ok_with_lock" }))} 
              className={`p-3 rounded-lg text-left border transition ${
                answers.contractLockPreference === "ok_with_lock"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-200 hover:shadow-sm"
              }`}
            >
              あまり気にしない（条件次第ではOK）
            </button>
          </div>
        </div>
      </div>

      {/* 次へボタン */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={nextPhase}   // ✅ 修正ポイント：ここ！
          disabled={!allAnswered}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            allAnswered
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          次へ →
        </button>
      </div>
    </section>
  );
}
