import { allPlans } from "../../data/plans";
import { filterPlansByPhase2 } from "../../utils/filters/phase2FilterLogic";


const testAnswers = {
  callPlanType: ["1回あたり", "合計通話時間", "ハイブリッド", "無制限（完全定額）"],
  timeLimitPreference: "5分以内",
  monthlyLimitPreference: "月60分まで無料",
  hybridCallPreference: "月30回まで各10分無料",
  // その他は全て未選択（undefined or 空配列）
};

const result = filterPlansByPhase2(testAnswers as any, allPlans);

console.log("=== 🧩 Filtered Plans ===");
for (const p of result) {
  console.log(`📱 ${p.carrier} (${p.planName})`);
}
console.log(`\n合計: ${result.length} 件`);
