// utils/filters/phase2FilterLogic.ts
import { Phase2Answers } from "@/types/types";
import { Plan } from "@/types/planTypes";

export function filterPlansByPhase2(answers: Phase2Answers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

  // 🟦 ① データ通信容量フィルター（確認済み ✅）
  if (answers.dataUsage) {
    const usage = answers.dataUsage ?? "";
    let minRequired = 0;

    switch (true) {
      case usage.includes("〜3GB"):
        minRequired = 3;
        break;
      case usage.includes("〜5GB"):
        minRequired = 5;
        break;
      case usage.includes("〜10GB"):
        minRequired = 10;
        break;
      case usage.includes("〜20GB"):
        minRequired = 20;
        break;
      case usage.includes("〜30GB"):
        minRequired = 30;
        break;
      case usage.includes("〜50GB"):
        minRequired = 50;
        break;
      case usage.includes("無制限"):
        minRequired = Infinity;
        break;
      default:
        minRequired = 0;
        break;
    }

    filtered = filtered.filter(plan => plan.maxDataGB >= minRequired);
  }

 // 🟩🟩 ② 国内通話プランフィルター（全タイプ同時選択対応 + 無制限上位互換対応 ✅ + 型安全修正版）
if (answers.callPlanType && answers.callPlanType.length > 0) {
  const timeLimitMap = {
    "5分以内": 5,
    "10分以内": 10,
    "15分以内": 15,
    "30分以内": 30,
    "無制限": Infinity,
  } as const;

  const monthlyLimitMap = {
    "月60分まで無料": 60,
    "月70分まで無料": 70,
    "月100分まで無料": 100,
    "無制限（完全定額）": Infinity,
  } as const;

  const hybridLimitMap = {
    "月30回まで各10分無料": { count: 30, perCall: 10 },
    "月50回まで各10分無料": { count: 50, perCall: 10 },
    "無制限（回数制限なし）": { count: Infinity, perCall: Infinity },
  } as const;

  const selectedTypes = answers.callPlanType ?? [];

  // OR 統合結果を格納する配列
  let matches: Plan[] = [];

  // 🕐 時間制限型
  if (selectedTypes.some((t) => t.includes("1回あたり"))) {
    const pref = answers.timeLimitPreference ?? "";
    const limitKey = (Object.keys(timeLimitMap) as (keyof typeof timeLimitMap)[])
      .find((k) => pref.includes(k));
    const limit = limitKey ? timeLimitMap[limitKey] : 0;

    matches.push(
      ...plans.filter(
        (p) =>
          (p.callType === "time" && (p.callTimeLimit ?? 0) >= limit) ||
          p.callType === "unlimited" // ← 上位互換含む
      )
    );
  }

  // 📆 月間制限型
  if (selectedTypes.some((t) => t.includes("合計通話時間"))) {
    const pref = answers.monthlyLimitPreference ?? "";
    const limitKey = (Object.keys(monthlyLimitMap) as (keyof typeof monthlyLimitMap)[])
      .find((k) => pref.includes(k));
    const limit = limitKey ? monthlyLimitMap[limitKey] : 0;

    matches.push(
      ...plans.filter(
        (p) =>
          (p.callType === "monthly" && (p.callMonthlyLimit ?? 0) >= limit) ||
          p.callType === "unlimited"
      )
    );
  }

  // 🔁 ハイブリッド型
  if (selectedTypes.some((t) => /(ハイブリッド|回数)/.test(t))) {
    const pref = answers.hybridCallPreference ?? "";
    const limitKey = (Object.keys(hybridLimitMap) as (keyof typeof hybridLimitMap)[])
      .find((k) => pref.includes(k));
    const { count, perCall } = limitKey ? hybridLimitMap[limitKey] : { count: 0, perCall: 0 };

    matches.push(
      ...plans.filter(
        (p) =>
          (p.callType === "hybrid" &&
            (p.callCountLimit ?? 0) >= count &&
            (p.callPerCallLimit ?? 0) >= perCall) ||
          p.callType === "unlimited"
      )
    );
  }

  // 🟪 無制限型（直接選択時）
  if (selectedTypes.some((t) => /(無制限|かけ放題)/.test(t))) {
    matches.push(...plans.filter((p) => p.callType === "unlimited"));
  }

  // 🌍 海外通話フィルター（保持）
  if (answers.needInternationalCallUnlimited === "はい") {
    const selectedCarriers = Array.isArray(answers.internationalCallCarrier)
      ? answers.internationalCallCarrier
      : [];
    matches = matches.filter((plan) => {
      if (selectedCarriers.length === 0)
        return plan.supportsInternationalUnlimitedCalls === true;

      return selectedCarriers.some((c) => {
        const lower = c.toLowerCase();
        return (
          (lower.includes("楽天") && plan.carrier?.toLowerCase().includes("rakuten")) ||
          (lower.includes("au") && plan.carrier?.toLowerCase().includes("au")) ||
          (lower.includes("softbank") && plan.carrier?.toLowerCase().includes("softbank")) ||
          (lower.includes("docomo") && plan.carrier?.toLowerCase().includes("docomo"))
        );
      });
    });
  }

  // 重複削除
  filtered = Array.from(new Map(matches.map((p) => [p.planId, p])).values());
}




  // 🟦 ③ 端末モデルフィルター
  if (answers.deviceModel && answers.deviceModel !== "その他") {
    const selectedModel = answers.deviceModel.toLowerCase();
    filtered = filtered.filter(plan => {
      const devices = plan.availableDevices?.map(d => d.toLowerCase()) ?? [];
      return devices.some(device => device.includes(selectedModel));
    });
  }

  // 🟦🟦 ④ 海外利用フィルター
  if (answers.overseasSupport === "はい") {
    filtered = filtered.filter(plan => plan.overseasSupport === true);
  }

  // 🟦 ⑤ 支払い方法フィルター
  if (answers.mainCard && Array.isArray(answers.mainCard) && answers.mainCard.length > 0) {
    const selectedMethods = answers.mainCard as string[];
    filtered = filtered.filter(plan =>
      selectedMethods.some((method: string) =>
        plan.supportedPaymentMethods?.includes(method)
      )
    );
  }

  return filtered;
}
