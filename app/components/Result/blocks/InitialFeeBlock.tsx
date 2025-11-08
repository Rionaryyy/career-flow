"use client";

import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

/**
 * 💰 初期費用・特典内訳ブロック
 * （Result.tsxから完全移植・ロジック変更なし）
 */
export default function InitialFeeBlock({ plan, answers }: Props) {
  const b = plan.breakdown;

  // 契約方法（Phase1・Phase2いずれにも対応）
  const contractMethod =
    answers.contractMethod ??
    answers.phase1?.contractMethod ??
    answers.phase2?.contractMethod ??
    "";

  // 表示条件
  const shouldShow =
    (b.cashbackTotal ?? 0) !== 0 ||
    (b.initialCostTotal ?? 0) !== 0 ||
    (b.campaignMatched?.length ?? 0) > 0;

  if (!shouldShow) return null;

  return (
    <div className="mt-3 border-t border-dashed border-gray-300 pt-2">
      <p className="font-semibold text-gray-800 mb-1">💰 初期費用・特典内訳</p>

      {/* 🏷 契約方法の表示 */}
      {contractMethod && (
        <p className="ml-2 text-sm text-sky-700">契約方法: {contractMethod}</p>
      )}

      {/* 💴 初期費用 */}
      <p className="ml-2 text-gray-700">
        ・契約・初期費用総額:{" "}
        <span className="font-medium text-red-700">
          +¥{(b.initialCostTotal ?? 0).toLocaleString()}
        </span>
      </p>

      {/* 🧾 初期費用の説明 */}
      {(() => {
        if (contractMethod.includes("店頭")) {
          return (
            <p className="ml-6 text-xs text-gray-500">
              ※ 店頭契約時の事務手数料を適用（例: 4,950円）
            </p>
          );
        } else if (contractMethod.includes("オンライン")) {
          return (
            <p className="ml-6 text-xs text-gray-500">
              ※ オンライン契約時の事務手数料＋eSIM発行料を適用
            </p>
          );
        } else if (contractMethod.includes("どちらでも")) {
          return (
            <p className="ml-6 text-xs text-gray-500">
              ※ 店頭／オンライン（＋eSIM）いずれか安い方の初期費用を適用
            </p>
          );
        }
        return null;
      })()}

      {/* 💸 キャッシュバック */}
      <p className="ml-2 text-gray-700 mt-1">
        ・キャッシュバック総額:{" "}
        <span className="font-medium text-green-700">
          -¥{(b.cashbackTotal ?? 0).toLocaleString()}
        </span>
      </p>

      {/* 🎯 適用キャンペーン一覧 */}
      {Array.isArray(b.campaignMatched) && b.campaignMatched.length > 0 && (
        <div className="mt-2 ml-2">
          <p className="font-semibold text-gray-800 text-sm">🎯 適用キャンペーン:</p>
          <ul className="ml-3 list-disc text-gray-700 text-sm">
            {b.campaignMatched.map((id: string) => {
              const matched = campaigns.find((c) => c.campaignId === id);
              if (!matched) return null;
              return (
                <li key={matched.campaignId}>
                  {matched.campaignName}（{matched.cashbackType}：¥
                  {matched.cashbackAmount.toLocaleString()}）
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
