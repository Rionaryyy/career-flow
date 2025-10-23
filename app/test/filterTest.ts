import { allPlans } from "../../data/plans";
import { filterPlansByPhase2 } from "../../utils/filters/phase2FilterLogic";

const testAnswers = {
  // ✅ テザリング条件
  tetheringNeeded: true,
  tetheringUsage: "〜60GB（在宅ワークなどで頻繁に利用）",

  // ✅ 通話条件（任意）
  callPlanType: [
    "1回あたり",
    "合計通話時間",
    "ハイブリッド",
    "無制限（完全定額）",
  ],
  timeLimitPreference: "5分以内",
  monthlyLimitPreference: "月60分まで無料",
  hybridCallPreference: "月30回まで各10分無料",
};

// 🧩 テスト実行
const result = filterPlansByPhase2(testAnswers as any, allPlans);

// === 🟦 出力 ===
console.log("\n=== 🧩 Filtered Plans (Phase2) ===\n");

result.forEach((p, i) => {
  const tetheringStatus = p.tetheringAvailable ? "✅" : "❌";
  const tetheringLimit =
    typeof p.tetheringUsage === "number" ? `${p.tetheringUsage}GB` : "不明";

  // 通話オプション料金（plan.callOptions の中身確認用）
  const callOptionFee =
    p.callOptions?.length && p.callOptions[1]?.fee
      ? `+¥${p.callOptions[1].fee}`
      : "+¥0";

  // テザリング料金（plan.tetheringFee が定義されていれば表示）
  const tetheringFee =
    typeof (p as any).tetheringFee === "number"
      ? `+¥${(p as any).tetheringFee}`
      : "+¥0";

  console.log(
    `${i + 1}. 📱 ${p.carrier} (${p.planName})
   ├ テザリング: ${tetheringStatus} ${tetheringLimit}
   ├ 通話オプション: ${callOptionFee}
   ├ テザリング料: ${tetheringFee}
   └ 通話タイプ: ${p.callType ?? "未定義"}`
  );
});

console.log(`\n合計: ${result.length} 件\n`);
