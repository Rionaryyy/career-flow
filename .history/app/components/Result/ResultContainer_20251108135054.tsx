"use client";

import { useMemo } from "react";
import Image from "next/image";
import { DiagnosisAnswers } from "@/types/types";
import { Plan } from "@/types/planTypes";
import { filterPlansByPhase1 } from "@/utils/filters/phese1FilterLogic";
import { filterPlansByPhase2 } from "@/utils/filters/phase2FilterLogic";
import { allPlansWithDevices as allPlans } from "@/data/plans";
import { calculatePlanCost } from "@/utils/logic/calcEffectivePrice";
import ResultCard from "./ResultCard";
import FooterBlock from "./blocks/FooterBlock";

interface Props {
  answers: DiagnosisAnswers;
  filteredPlans: Plan[];
  onRestart: () => void;
}

export default function ResultContainer({ answers, onRestart }: Props) {
  const rankedResults = useMemo(() => {
    console.groupCollapsed("🧩 [Result Calculation Start]");
    console.log("🟦 Phase1 Answers:", answers.phase1);
    console.log("🟩 Phase2 Answers:", answers.phase2);

    let result: Plan[] = [...allPlans];

    if (answers.phase1 && Object.values(answers.phase1).some((v) => v)) {
      result = filterPlansByPhase1(answers.phase1, result);
    }

    if (answers.phase2) {
      result = filterPlansByPhase2(answers.phase2, result);
    }

    console.log("✅ Filtered result count:", result.length);

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
  }, [answers.phase1, answers.phase2]);

  return (
    <div className="w-full py-10 px-6 max-w-4xl mx-auto">
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

      {rankedResults.length === 0 ? (
        <p className="text-center text-gray-600">条件に一致するプランが見つかりませんでした。</p>
      ) : (
        <div className="space-y-6">
          {rankedResults.map((plan, i) => (
            <ResultCard key={plan.planId ?? i} plan={plan} index={i} answers={answers} />
          ))}

          <FooterBlock onRestart={onRestart} />
        </div>
      )}
    </div>
  );
}
