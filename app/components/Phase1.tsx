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
    <section className="p-4 sm:p-6 bg-gray-950 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        📍 フェーズ①：前提条件
      </h2>

      <div className="space-y-8">
        {/* Q1 */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <p className="font-semibold mb-3 text-gray-900 text-base sm:text-lg">
            ポイント還元や経済圏特典も“実質料金”に含めて考えますか？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, includePoints: "include_points" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.includePoints === "include_points"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              はい（ポイントも含めて最安を知りたい）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, includePoints: "exclude_points" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.includePoints === "exclude_points"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              いいえ（現金支出だけで比べたい）
            </button>
          </div>
        </div>

        {/* Q2 */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <p className="font-semibold mb-3 text-gray-900 text-base sm:text-lg">
            通信品質（速度・安定性）はどの程度重視しますか？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, qualityPriority: "high_quality" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.qualityPriority === "high_quality"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              とても重視する（大手キャリア水準が望ましい）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, qualityPriority: "mid_quality" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.qualityPriority === "mid_quality"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              ある程度重視する（格安でも安定していればOK）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, qualityPriority: "low_quality" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.qualityPriority === "low_quality"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              こだわらない（コスト最優先）
            </button>
          </div>
        </div>

        {/* Q3 */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <p className="font-semibold mb-3 text-gray-900 text-base sm:text-lg">
            キャリアの種類に希望はありますか？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, carrierType: "major_carrier" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.carrierType === "major_carrier"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              大手キャリア（ドコモ / au / ソフトバンク / 楽天）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, carrierType: "sub_brand" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.carrierType === "sub_brand"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              サブブランド（ahamo / povo / LINEMO / UQなど）もOK
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, carrierType: "mvno" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.carrierType === "mvno"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              格安SIM（IIJ / mineo / NUROなど）も含めて検討したい
            </button>
          </div>
        </div>

        {/* Q4 */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <p className="font-semibold mb-3 text-gray-900 text-base sm:text-lg">
            契約・サポートはオンライン完結で問題ありませんか？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, supportPreference: "support_online" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.supportPreference === "support_online"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              はい（店舗サポートは不要）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, supportPreference: "support_instore" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.supportPreference === "support_instore"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              いいえ（店頭での手続きや相談が必要）
            </button>
          </div>
        </div>

        {/* Q5 */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
          <p className="font-semibold mb-3 text-gray-900 text-base sm:text-lg">
            契約期間の縛りや解約金について、どの程度気にしますか？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, contractLockPreference: "prefer_no_lock" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.contractLockPreference === "prefer_no_lock"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              絶対に嫌（縛りなしが前提）
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, contractLockPreference: "avoid_if_possible" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.contractLockPreference === "avoid_if_possible"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              できれば避けたいが内容次第
            </button>

            <button
              type="button"
              onClick={() => setAnswers(prev => ({ ...prev, contractLockPreference: "ok_with_lock" }))}
              className={`p-3 rounded-lg border text-left transition ${
                answers.contractLockPreference === "ok_with_lock"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:shadow-sm"
              }`}
            >
              気にしない（条件次第でOK）
            </button>
          </div>
        </div>
      </div>

      {/* 次へボタン */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={nextPhase}
          disabled={!allAnswered}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold transition ${
            allAnswered
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          次へ →
        </button>
      </div>
    </section>
  );
}
