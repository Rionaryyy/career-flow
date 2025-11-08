"use client";

import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";

interface Props {
  plan: Plan & { breakdown: any };
  answers: DiagnosisAnswers;
}

export default function PointRewardBlock({ plan, answers }: Props) {
  const b = plan.breakdown;
  const includePoints = answers.phase2?.includePoints ?? answers.phase1?.includePoints ?? "";

  // 「いいえ」を含むときのみ非表示
  if (includePoints.includes("いいえ")) return null;

  // すべての還元が0なら非表示
  if (
    (b.paymentReward ?? 0) === 0 &&
    (b.shoppingReward ?? 0) === 0 &&
    (b.pointReward ?? 0) === 0 &&
    (b.effectiveReward ?? 0) === 0
  ) return null;

  return (
    <div className="mt-3 border-t border-dashed border-gray-300 pt-2">
      <p className="font-semibold text-gray-800 mb-1">💰 経済圏ポイント還元</p>

      {/* 🏦 対象経済圏 */}
      {Array.isArray(answers.phase2?.shoppingEcosystem) &&
        answers.phase2.shoppingEcosystem.length > 0 && (
          <p className="ml-2 text-gray-700">
            対象経済圏:{" "}
            {answers.phase2.shoppingEcosystem.map((eco: string) => eco.toUpperCase()).join(" / ")}
          </p>
        )}

      {/* 💴 各還元内訳 */}
      <div className="ml-2 space-y-1 text-gray-700 text-sm mt-1">
        {(b.paymentReward ?? 0) > 0 && (
          <p>・携帯料金支払い還元: -¥{b.paymentReward.toLocaleString()}</p>
        )}
        {(b.shoppingReward ?? 0) > 0 && (
          <p>・ショッピング利用還元: -¥{b.shoppingReward.toLocaleString()}</p>
        )}
        {(b.pointReward ?? 0) > 0 && (
          <p>・共通ポイント還元: -¥{b.pointReward.toLocaleString()}</p>
        )}
      </div>

      {/* 🎁 合計 */}
      {(b.effectiveReward ?? 0) > 0 && (
        <p className="ml-2 mt-1 font-medium text-green-700">
          🎁 還元合計（実質相当）: -¥{b.effectiveReward.toLocaleString()}
        </p>
      )}
    </div>
  );
}
