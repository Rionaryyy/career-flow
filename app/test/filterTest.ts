// app/test/filterTest.ts
import { allPlans } from "../../data/plans";
import { filterPlansByPhase1 } from "../../utils/filters/phase1FilterLogic";
import { filterPlansByPhase2 } from "../../utils/filters/phase2FilterLogic";
import { Phase1Answers, Phase2Answers } from "../../types/types";

// 共通出力関数
import { Plan } from "../../types/planTypes";

function printResult(title: string, step1: Plan[], step2: Plan[]) {
  const status = step2.length > 0 ? "✅" : "⚠️";
  console.log(`\n${status} ${title}`);
  console.log(`  Phase1残り: ${step1.length}件`);
  console.log(`  Phase2残り: ${step2.length}件`);
  if (step2.length > 0) {
    step2.forEach(p => console.log(`   - ${p.carrier} (${p.planName})`));
  } else {
    console.log("   → 該当プランなし");
  }
}


// テストケース実行
function runTestCase(title: string, phase1: Phase1Answers, phase2: Partial<Phase2Answers>) {
  const step1 = filterPlansByPhase1(phase1, allPlans);
  const step2 = filterPlansByPhase2(phase2 as Phase2Answers, step1);
  printResult(title, step1, step2);
}

// === 基本Phase1設定 ===
const basePhase1: Phase1Answers = {
  includePoints: "はい（経済圏特典を考慮する）",
  supportPreference: "ある程度重視",
  contractLockPreference: "縛りなしが良い",
  carrierType: "サブブランド",
  networkQuality: "ある程度重視",
  contractMethod: "オンライン",
  appCallUnlimited: "はい",
};

// === テスト実行 ===
runTestCase("基本設定（海外対応あり＋クレカ）", basePhase1, {
  dataUsage: "〜20GB",
  overseasSupport: "はい",
  mainCard: ["クレジットカード"],
});

runTestCase("海外利用なし", basePhase1, {
  dataUsage: "〜20GB",
  overseasSupport: "いいえ",
  mainCard: ["クレジットカード"],
});

runTestCase("支払い方法：口座振替", basePhase1, {
  dataUsage: "〜20GB",
  overseasSupport: "はい",
  mainCard: ["口座振替"],
});

runTestCase("データ使用量：〜5GB", basePhase1, {
  dataUsage: "〜5GB",
  overseasSupport: "はい",
  mainCard: ["クレジットカード"],
});

// === ハイブリッド型テスト（Phase1バイパス） ===
function runHybridTestDirect() {
  const phase2: Partial<Phase2Answers> = {
    dataUsage: "〜20GB",
    callPlanType: ["ハイブリッド型"],
    hybridCallPreference: "月30回まで各10分無料",
    overseasSupport: "はい",
    mainCard: ["クレジットカード"],
  };

  const step1 = allPlans;
  const step2 = filterPlansByPhase2(phase2 as Phase2Answers, step1);

  console.log("\n✅ [Phase1バイパス] 通話プラン：ハイブリッド型");
  console.log(`  総プラン数: ${step1.length}件`);
  console.log(`  Phase2残り: ${step2.length}件`);
  if (step2.length > 0) {
    step2.forEach((p) => console.log(`   - ${p.carrier} (${p.planName})`));
  } else {
    console.log("   → 該当プランなし");
  }
}
runHybridTestDirect();

// === Phase1無効化（全プラン対象） ===
const relaxedPhase1: Phase1Answers = {
  ...basePhase1,
  carrierType: "格安SIM",
};

runTestCase("Phase1無効化（全プラン対象）", relaxedPhase1, {
  dataUsage: "〜5GB",
  overseasSupport: "いいえ",
  mainCard: ["口座振替"],
});

// === 🧪 新テストパターン群 ===

// ① 通話プラン：時間制限型（5分以内）
runTestCase("通話プラン：時間制限型（5分以内）", basePhase1, {
  dataUsage: "〜10GB",
  callPlanType: ["1回あたり"],
  timeLimitPreference: "5分以内",
  overseasSupport: "はい",
  mainCard: ["クレジットカード"],
});

// ② 通話プラン：月間制限型（月60分まで無料）
runTestCase("通話プラン：月間制限型（月60分）", basePhase1, {
  dataUsage: "〜20GB",
  callPlanType: ["合計通話時間"],
  monthlyLimitPreference: "月60分まで無料",
  overseasSupport: "はい",
  mainCard: ["クレジットカード"],
});

// ③ 通話プラン：無制限型（完全定額）
runTestCase("通話プラン：無制限型（完全定額）", basePhase1, {
  dataUsage: "〜50GB",
  callPlanType: ["無制限（完全定額）"],
  overseasSupport: "はい",
  mainCard: ["クレジットカード"],
});

// ④ 海外利用：楽天モバイル限定
runTestCase("海外利用：楽天モバイル限定", basePhase1, {
  dataUsage: "〜50GB",
  overseasSupport: "はい",
  callPlanType: ["無制限（完全定額）"],
  needInternationalCallUnlimited: "はい",
  internationalCallCarrier: ["楽天モバイル"],
  mainCard: ["クレジットカード"],
});

// ⑤ 支払い方法：楽天ポイント払い
runTestCase("支払い方法：楽天ポイント払い", basePhase1, {
  dataUsage: "〜50GB",
  overseasSupport: "はい",
  mainCard: ["楽天ポイント払い"],
});
