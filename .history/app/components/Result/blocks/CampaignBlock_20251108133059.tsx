"use client";

import { DiagnosisAnswers } from "@/types/types";
import { campaigns } from "@/data/campaigns";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

export default function CampaignBlock({ plan, answers }: Props) {
  const b = plan.breakdown;
  const method =
    answers.contractMethod ??
    answers.phase1?.contractMethod ??
    answers.phase2?.contractMethod ??
    "";

  return (
    <>
      {(b.cashbackTotal !== 0 || b.initialCostTotal !== 0) && (
        <div className="mt-3 border-t border-dashed border-gray-300 pt-2">
          <p className="font-semibold text-gray-800 mb-1">💰 初期費用・特典内訳</p>

          {method && (
            <p className="ml-2 text-sm text-sky-700">契約方法: {method}</p>
          )}

          <p className="ml-2 text-gray-700">
            ・契約・初期費用総額:
            <span className="font-medium text-red-700">
              +¥{b.initialCostTotal.toLocaleString()}
            </span>
          </p>

          <p className="ml-6 text-xs text-gray-500">
            {method.includes("店頭")
              ? "※ 店頭契約時の事務手数料を適用（例: 4,950円）"
              : method.includes("オンライン")
              ? "※ オンライン契約時の事務手数料＋eSIM発行料を適用"
              : method.includes("どちらでも")
              ? "※ 店頭／オンライン（＋eSIM）いずれか安い方の初期費用を適用"
              : ""}
          </p>

          <p className="ml-2 text-gray-700 mt-1">
            ・キャッシュバック総額:
            <span className="font-medium text-green-700">
              -¥{b.cashbackTotal.toLocaleString()}
            </span>
          </p>

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
      )}
    </>
  );
}
