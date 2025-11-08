"use client";

import { DiagnosisAnswers } from "@/types/types";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

/**
 * 🎬 サブスク内訳・サブスク関連特典ブロック
 * （Result.tsx から完全移植・ロジック変更なし）
 */
export default function SubscriptionBlock({ plan, answers }: Props) {
  const b = plan.breakdown;

  return (
    <>
      {/* 🎬 サブスク内訳（料金・割引詳細） */}
      {(b.subscriptionDetails?.length ?? 0) > 0 && (
        <div className="mt-2">
          <p className="font-semibold text-gray-800 mb-1">
            🎬 サブスク内訳（料金・割引詳細）
          </p>

          {(() => {
            type SubscriptionItem = {
              name: string;
              basePrice: number;
              discount?: number;
              reward?: number;
            };

            // 🧩 同一サブスク（セット割・還元）を統合
            const mergedSubs = Object.values(
              (b.subscriptionDetails as SubscriptionItem[] ?? []).reduce(
                (
                  acc: Record<string, SubscriptionItem>,
                  s: SubscriptionItem
                ) => {
                  const key = s.name.replace(/（.*?）/g, "").trim();
                  if (!acc[key]) {
                    acc[key] = { ...s };
                  } else {
                    const newDiscount = Math.max(
                      acc[key].discount ?? 0,
                      s.discount ?? 0
                    );
                    const newReward =
                      (acc[key].reward ?? 0) + (s.reward ?? 0);
                    acc[key].discount = newDiscount;
                    acc[key].reward = newReward;
                  }
                  return acc;
                },
                {} as Record<string, SubscriptionItem>
              )
            );

            return (
              <ul className="ml-2 space-y-1 text-gray-700 text-sm">
                {mergedSubs.map((s, i) => (
                  <li key={i} className="pl-1">
                    ・{s.name.replace(/（.*?）/g, "")}
                    <span className="ml-2 text-gray-600">
                      ¥{s.basePrice.toLocaleString()}/月
                    </span>

                    {(s.discount ?? 0) > 0 && (
                      <span className="ml-2 text-green-600">
                        （割引 -¥{s.discount!.toLocaleString()}）
                      </span>
                    )}

                    {(s.reward ?? 0) > 0 && (
                      <span className="ml-2 text-green-600">
                        （還元 -¥{s.reward!.toLocaleString()}）
                      </span>
                    )}

                    {(s.discount ?? 0) === 0 &&
                      (s.reward ?? 0) === 0 && (
                        <span className="ml-2 text-gray-400">
                          (特典なし)
                        </span>
                      )}
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      )}

      {/* 🎬 サブスク特典ブロック */}
      {(b.subscriptionBaseFee ?? 0) !== 0 ||
      (b.subscriptionDiscount ?? 0) !== 0 ||
      (b.subscriptionReward ?? 0) !== 0 ? (
        <div className="mt-2 border-t border-dashed border-gray-300 pt-2">
          <p className="font-semibold text-gray-800 mb-1">🎬 サブスク関連</p>

          {b.subscriptionBaseFee !== 0 && (
            <p className="ml-2 text-gray-700">
              ・サブスク利用料金: +¥{b.subscriptionBaseFee?.toLocaleString()}
            </p>
          )}

          {b.subscriptionDiscount !== 0 && (
            <p className="ml-2 text-gray-700">
              ・サブスクセット割: -¥{b.subscriptionDiscount?.toLocaleString()}
            </p>
          )}

          {b.subscriptionReward !== 0 && (
            <p className="ml-2 text-gray-700">
              ・サブスク還元: -¥{b.subscriptionReward?.toLocaleString()}
            </p>
          )}

          <div className="ml-2 font-medium text-sky-700 mt-1">
            💡 サブスク合計影響額:
            {(() => {
              const total =
                (b.subscriptionBaseFee ?? 0) -
                (b.subscriptionDiscount ?? 0) -
                (b.subscriptionReward ?? 0);
              const sign = total >= 0 ? "+" : "-";
              return ` ${sign}¥${Math.abs(total).toLocaleString()}/月`;
            })()}
          </div>
        </div>
      ) : null}
    </>
  );
}
