import { filterPlansByPhase1 } from "@/lib/filterPlans";
import { loadPlans } from "@/lib/loadPlans";
import { PlanSchemaType } from "@/lib/planSchema";

export default async function FilterTest() {
  // 🔹 型アサーションを追加
  const plans = (await loadPlans()) as PlanSchemaType[];

  const testAnswers = {
    carrierType: "サブブランドもOK",
    networkQuality: "ある程度重視する（格安でも安定していればOK）",
    compareAxis: "毎月の支払い額だけで比べたい",
    includePoints: "はい（ポイントも含めて最安を知りたい）",
    supportPreference: "どちらでも構わない",
    contractLockPreference: "気にしない",
  };

  const result = filterPlansByPhase1(plans, testAnswers);

  console.log("💡 絞り込み結果", result);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">📊 Phase1フィルター テスト</h1>
      <p>読み込んだプラン数: {plans.length}</p>
      <p>条件に合致したプラン数: {result.length}</p>
      <pre className="bg-gray-100 p-3 rounded mt-4 text-sm">
        {JSON.stringify(result, null, 2)}
      </pre>
    </main>
  );
}
