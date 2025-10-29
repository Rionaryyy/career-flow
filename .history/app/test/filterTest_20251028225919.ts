// app/test/filterTest.ts
import { allPlansWithDevices as allPlans } from "../../data/plans"; // ✅ 修正ポイント
import { filterPlansByPhase2 } from "../../utils/filters/phase2FilterLogic";
import { filterByFiberSet } from "../../utils/filters/filterByInternetSet";
import { filterByRouterSet } from "../../utils/filters/filterByRouterSet";
import { filterByPocketWifiSet } from "../../utils/filters/filterByPocketWifiSet";
import { fiberDiscountPlans as fiberPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { routerDiscountPlans as routerPlans } from "../../data/setDiscounts/routerDiscountPlans";
import { pocketWifiDiscountPlans as pocketPlans } from "../../data/setDiscounts/pocketWifiDiscountPlans";
import { calculatePlanCost } from "../../utils/logic/calcEffectivePrice";
import { Phase1Answers, Phase2Answers } from "../../types/types";
import { validateDiagnosisResult, printValidationReport } from "./diagnosisValidator";

// ===================================================
// ✅ フェーズ①テスト回答（Phase1）
// ===================================================
const testPhase1Answers: Partial<Phase1Answers> = {
  includePoints: "はい",
  considerPointInActualCost: "はい",
  networkQuality: "高",
  carrierType: "大手",
  supportPreference: "中",
  contractLockPreference: "縛りなし",
  // 🟢 初期費用テスト追加
  compareAxis: "実際に支払う金額で比べたい", // ← これが「初期費用＋CB平均化」を有効化
  comparePeriod: "2年（24ヶ月）",              // ← 平均化の期間（1年 / 2年 / 3年）
};

// ===================================================
// ✅ フェーズ②テスト回答（Phase2）
// ===================================================
const testAnswers: Partial<Phase2Answers> = {
  dataUsage: "〜20GB（動画視聴・SNSなど）",
  tetheringNeeded: true,
  tetheringUsage: "〜30GB（軽めの在宅利用）",
  callPlanType: ["1回あたり", "合計通話時間", "ハイブリッド", "無制限（完全定額）"],
  timeLimitPreference: "5分以内",
  monthlyLimitPreference: "月60分まで無料",
  hybridCallPreference: "月30回まで各10分無料",
  callOptionsNeeded: "はい（必要）",
  needInternationalCallUnlimited: "はい",
  internationalCallCarrier: ["楽天モバイル（国際通話かけ放題：¥980/月・65カ国対象）"],
  mainCard: ["クレジットカード"],
  cardDetail: ["dカード GOLD"], // 💳 支払い方法詳細テスト追加
  shoppingList: ["楽天市場・楽天ブックス・楽天トラベルなど（楽天経済圏）"], // 🛒 ショッピング還元テスト用
  shoppingMonthly: "10,000〜30,000円",
  paymentList: ["d払い / dカード（dポイント経済圏）"],
  paymentMonthly: "10,000〜30,000円",
  overseasSupport: "はい",
  setDiscount: "光回線の契約, ルーター購入・レンタル, ポケットWi-Fi契約, 電気, ガス",
  fiberType: "戸建て",
  fiberSpeed: "1Gbps以上",
  routerCapacity: "〜20GB",
  routerSpeed: "最大1Gbps",
  pocketWifiCapacity: "〜20GB",
  pocketWifiSpeed: "100Mbps程度",
 buyingDevice: "キャリアで購入",

  deviceModel: "iPhone 17 Pro",
  deviceStorage: "512GB",
  hasElectricSet: true,
  hasGasSet: true,
  subscriptionList: [
    "Netflix",
    "YouTube Premium",
    "Amazon Prime Video",
    "Spotify",
    "dTV",
    "U-NEXT",
  ],
};

// ===================================================
// 🟦 モバイルプラン抽出
// ===================================================
const mobileResult = filterPlansByPhase2(testAnswers as Phase2Answers, allPlans);

// ===================================================
// 💡 セット割適用候補
// ===================================================
const fiberResult = filterByFiberSet(testAnswers as Phase2Answers, fiberPlans);
const routerResult = filterByRouterSet(testAnswers as Phase2Answers, routerPlans);
const pocketResult = filterByPocketWifiSet(testAnswers as Phase2Answers, pocketPlans);

// ===================================================
// 🧮 計算結果（Result.tsx 相当）
// ===================================================
console.log("\n📊 ======= 診断結果（Result.tsx 相当） =======\n");
console.log("【フェーズ②回答内容】");
console.log(JSON.stringify(testAnswers, null, 2));
console.log("\n----------------------------------------\n");

mobileResult.forEach((plan, i) => {
  const cost = calculatePlanCost(plan, { phase1: testPhase1Answers, phase2: testAnswers } as any);

  console.log(`${i + 1}. ${plan.carrier.toUpperCase()} ${plan.planName}`);
  console.log(`${plan.carrier}\n`);
  console.log(`💰 推定料金: ¥${cost.total.toLocaleString()}/月（税込・概算）\n`);

  console.log(`・基本料金: ¥${cost.baseFee}`);
  console.log(`・通話オプション: +¥${cost.callOptionFee}`);
  console.log(`・家族割引: -¥${cost.familyDiscount}`);
  console.log(`・学割: -¥${cost.studentDiscount}`);
  console.log(`・年齢割: -¥${cost.ageDiscount}`);
  console.log(`・キャッシュバック(換算): -¥${cost.cashback}`);

  // === 📱 返却プログラム（月額端末費用） ===
  if ("deviceLeaseMonthly" in cost && cost.deviceLeaseMonthly && cost.deviceLeaseMonthly > 0) {
    console.log(`・返却プログラム（月額端末費）: +¥${cost.deviceLeaseMonthly}`);

    const matchedDevice = plan.deviceProgram;
    if (matchedDevice) {
      console.log(
        `   → ${matchedDevice.model} (${matchedDevice.storage}) / ${matchedDevice.programName} / ${matchedDevice.paymentMonths}ヶ月返却前提`
      );
    }
  }
  
  // 🆕 === 💰 端末購入プログラム（月額費用） ===
  if ("deviceBuyMonthly" in cost && cost.deviceBuyMonthly && cost.deviceBuyMonthly > 0) {
    console.log(`・端末購入（月額端末費）: +¥${cost.deviceBuyMonthly}`);

    const matchedDevice = plan.deviceProgram;
    if (matchedDevice) {
      console.log(
        `   → ${matchedDevice.model} (${matchedDevice.storage}) / ${matchedDevice.programName} / ${matchedDevice.paymentMonths}ヶ月分割払い`
      );
    }
  }


  console.log(`・初期費用(月換算): +¥${cost.initialFeeMonthly}`);
  console.log(`・テザリング料: +¥${cost.tetheringFee}`);

    // === 🗣️ 留守番電話オプション ===
  if ("voicemailFee" in plan && plan.voicemailFee && plan.voicemailFee > 0) {
    const needsVoicemail =
      testAnswers.callOptionsNeeded === "はい（必要）" 

    if (needsVoicemail) {
      console.log(`・留守番電話オプション: +¥${plan.voicemailFee}`);
    }
  }


  // === セット割系 ===
  if (fiberResult.length) console.log(`・光回線セット割: -¥${fiberResult[0].setDiscountAmount}`);
  if (routerResult.length) console.log(`・ルーター割引: -¥${routerResult[0].setDiscountAmount}`);
  if (pocketResult.length) console.log(`・ポケットWi-Fi割: -¥${pocketResult[0].setDiscountAmount}`);

  if (plan.supportsElectricSet && plan.energyDiscountRules)
    console.log(`・電気セット割: -¥${plan.energyDiscountRules.find(r => r.type === "電気")?.discount ?? 0}`);
  if (plan.supportsGasSet && plan.energyDiscountRules)
    console.log(`・ガスセット割: -¥${plan.energyDiscountRules.find(r => r.type === "ガス")?.discount ?? 0}`);

  // === 🎬 サブスク割 ===
  if (plan.subscriptionDiscountRules && plan.subscriptionDiscountRules.length > 0) {
    const matchedSubs = plan.subscriptionDiscountRules.filter(rule =>
      rule.applicableSubscriptions.some(subName =>
        (testAnswers.subscriptionList || []).includes(subName)
      )
    );
    if (matchedSubs.length > 0) {
      console.log(`・サブスク割（${matchedSubs.length}件 適用）:`);
      matchedSubs.forEach(sub => {
        const joined = sub.applicableSubscriptions.join("・");
        console.log(`   → ${joined}: -¥${sub.discount}（${sub.id}）`);
      });
      const totalSubDiscount = matchedSubs.reduce((sum, s) => sum + s.discount, 0);
      console.log(`   合計サブスク割引額: -¥${totalSubDiscount}`);
    }
  }

  // === 💳 支払い方法割引・還元 ===
  if ("paymentDiscount" in cost && (cost.paymentDiscount as number) > 0)
    console.log(`・支払い方法割引: -¥${cost.paymentDiscount}`);

  if ("paymentReward" in cost && (cost.paymentReward as number) > 0)
    console.log(`・支払い還元（実質）: -¥${(cost.paymentReward as number).toFixed(0)}`);

  if ("shoppingReward" in cost && (cost.shoppingReward as number) > 0)
    console.log(`・ショッピング還元（実質）: -¥${(cost.shoppingReward as number).toFixed(0)}`);

  if ("pointReward" in cost && (cost.pointReward as number) > 0)
    console.log(`・ポイント還元（実質）: -¥${(cost.pointReward as number).toFixed(0)}`);

  console.log(`\n🧩 planId: ${plan.planId}`);
  console.log(`📞 通話タイプ: ${plan.callType}`);
  console.log(`📶 通信品質: ${plan.networkQuality ?? "-"}`);
  console.log(`🌐 テザリング: ${plan.tetheringAvailable ? "あり" : "なし"} (${plan.tetheringUsage ?? "-"}GB)`);
  console.log(`👪 家族割対応: ${plan.supportsFamilyDiscount ? "✅" : "❌"}`);
  console.log(`🎓 学割対応: ${plan.supportsStudentDiscount ? "✅" : "❌"}`);
  console.log("\n----------------------------------------\n");
});

// ===================================================
// 📈 Summary
// ===================================================
console.log("\n=== 📈 Summary ===");
console.log({
  "光回線候補数": fiberResult.length,
  "ルーター候補数": routerResult.length,
  "ポケットWi-Fi候補数": pocketResult.length,
  "モバイル候補数": mobileResult.length,
});
console.log("\n✅ 完了: Result.tsx + サブスク割 + 支払い割引 + ポイント還元確認OK\n");

// ===================================================
// 🔍 総合整合性チェック
// ===================================================
const validation = validateDiagnosisResult(
  { phase1: testPhase1Answers, phase2: testAnswers },
  mobileResult
);
printValidationReport(validation);
