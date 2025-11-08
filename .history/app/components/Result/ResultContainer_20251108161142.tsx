"use client";

import { useMemo } from "react";
import Image from "next/image";
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { filterPlansByPhase2 } from "@/utils/filters/phase2FilterLogic";
import { allPlansWithDevices as allPlans } from "@/data/plans";
import { calculatePlanCost } from "@/utils/logic/calcEffectivePrice";

// 🧩 各ブロック・カード
import ResultCard from "./ResultCard";
import FooterBlock from "./blocks/FooterBlock";

interface Props {
  answers: DiagnosisAnswers;
  filteredPlans?: Plan[];
  onRestart: () => void;
}

export default function ResultContainer({ answers, onRestart }: Props) {
  const rankedResults = useMemo(() => {
    console.groupCollapsed("🧩 [Result Calculation Start]");
    console.log("🟦 Phase1 Answers:", answers.phase1);
    console.log("🟩 Phase2 Answers:", answers.phase2);

    // === 元データをコピー ===
    let result: Plan[] = [...allPlans];
    console.log("📦 全プラン数:", result.length);

    // === 🧩 Phase1 & Phase2 統合 ===
    const mergedPhase1 = {
      ...(answers.phase1 ?? {}),
      ...(answers.phase2?.contractMethod
        ? { contractMethod: answers.phase2.contractMethod }
        : {}),
    };

    // ✅ デバッグ出力（ここが一番重要）
    console.log("🧩 mergedPhase1 (フィルター入力):", mergedPhase1);

    // === フェーズ①のフィルター適用 ===
    if (Object.values(mergedPhase1).some((v) => v)) {
      console.log("🧭 Phase1フィルター適用開始");
      result = filterPlansByPhase1(result, mergedPhase1);
      console.log("📍 Phase1フィルター後:", result.length);
    } else {
      console.log("⚠️ mergedPhase1 に有効な値が存在しないため、フィルター未実行");
    }

    // === フェーズ②のフィルター適用 ===
    if (answers.phase2 && Object.values(answers.phase2).some((v) => v)) {
      console.log("🧭 Phase2フィルター適用開始");
      result = filterPlansByPhase2(result, answers.phase2);
      console.log("📍 Phase2フィルター後:", result.length);
    } else {
      console.log("⚠️ Phase2 に有効な値が存在しないため、フィルター未実行");
    }

    console.log("✅ 最終フィルター後の件数:", result.length);
    console.log("🧾 最終候補キャリア一覧:", result.map((p) => p.carrier));

    // === 各プランに料金ロジックを付加 ===
    const withCosts = result.map((plan) => {
      const cost = calculatePlanCost(plan, answers);

      return {
        ...plan,
        breakdown: {
          ...cost,
          deviceTotal:
            ((cost.deviceBuyMonthly ?? 0) * 24) ||
            ((cost.deviceLeaseMonthly ?? 0) * 24) ||
            (plan.deviceProgram?.totalPayment ?? 0),
        },
        totalMonthly: cost.total ?? 0,
      };
    });

    console.groupEnd();

    // === 実質月額が安い順にソート ===
    return withCosts.sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [answers.phase1, answers.phase2]);

  const handleRestart = () => {
    localStorage.removeItem("careerFlowAnswers");
    console.log("🧹 診断データをリセットしました");
    onRestart();
  };

  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      {/* 🐾 ヘッダー */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-sky-900">診断結果</h1>
        <Image
          src="/images/mascot-cat-hold-phone.png?v=1"
          alt=""
          width={56}
          height={56}
          priority
          aria-hidden
          className="h-10 w-10 md:h-14 md:w-14 select-none pointer-events-none"
        />
      </div>

      {/* 🧭 結果 */}
      {rankedResults.length === 0 ? (
        <p className="text-center text-gray-600">
          条件に一致するプランが見つかりませんでした。
        </p>
      ) : (
        <div className="space-y-6">
          {rankedResults.map((plan, i) => (
            <ResultCard key={plan.planId ?? i} plan={plan} index={i} answers={answers} />
          ))}

          {/* 🔄 リセットボタン */}
          <FooterBlock onRestart={handleRestart} />
        </div>
      )}
    </div>
  );
}
