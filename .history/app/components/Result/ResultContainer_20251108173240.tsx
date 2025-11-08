"use client";

import { calculatePlanCost } from "@/utils/logic/calcEffectivePrice";
import { useMemo } from "react"; 
import Image from "next/image";
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterPlansByPhase1 } from "@/utils/filters/phase1FilterLogic";
import { filterPlansByPhase2 } from "@/utils/filters/phase2FilterLogic";
import { allPlansWithDevices as allPlans } from "@/data/plans";
import ResultCard from "./ResultCard";
import FooterBlock from "./blocks/FooterBlock";

interface Props {
  answers: DiagnosisAnswers;
  onRestart: () => void;
}

export default function ResultContainer({ answers, onRestart }: Props) {
  const rankedResults = useMemo(() => {
    console.groupCollapsed("🧩 [Result Calculation Start]");
    console.log("🟦 Answers:", answers);

    let result: Plan[] = [...allPlans];
    console.log("📦 全プラン数:", result.length);

    // Phase1フィルター
    if (Object.values(answers).some((v) => v)) {
      result = filterPlansByPhase1(result, answers);
      console.log("📍 Phase1フィルター後:", result.length);
    }

    // Phase2フィルター
    if (Object.values(answers).some((v) => v)) {
      result = filterPlansByPhase2(result, answers);
      console.log("📍 Phase2フィルター後:", result.length);
    }

    console.log("✅ 最終フィルター後の件数:", result.length);
    console.log("🧾 最終候補キャリア一覧:", result.map((p) => p.carrier));

    // 料金計算追加
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

    return withCosts.sort((a, b) => a.totalMonthly - b.totalMonthly);
  }, [answers]);

  const handleRestart = () => {
    localStorage.removeItem("careerFlowAnswers");
    console.log("🧹 診断データをリセットしました");
    onRestart();
  };

  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-sky-900">診断結果</h1>
        <Image
          src="/images/mascot-cat-hold-phone.png?v=1"
          alt="Mascot"
          width={56}
          height={56}
          priority
          aria-hidden
          className="h-10 w-10 md:h-14 md:w-14 select-none pointer-events-none"
        />
      </div>

      {rankedResults.length === 0 ? (
        <p className="text-center text-gray-600">条件に一致するプランが見つかりませんでした。</p>
      ) : (
        <div className="space-y-6">
          {rankedResults.map((plan, i) => (
            <ResultCard key={plan.planId ?? i} plan={plan} index={i} answers={answers} />
          ))}

          <FooterBlock onRestart={handleRestart} />
        </div>
      )}
    </div>
  );
}
