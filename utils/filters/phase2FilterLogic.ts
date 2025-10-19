// utils/filters/phase2FilterLogic.ts
import { Phase2Answers } from "@/types/types";
import { Plan } from "@/types/planTypes";

export function filterPlansByPhase2(answers: Phase2Answers, plans: Plan[]): Plan[] {
  let filtered = [...plans];

  // ① データ通信容量フィルター
  if (answers.dataUsage) {
    const usage = answers.dataUsage ?? "";

    if (usage.includes("できるだけ安く")) {
      filtered = filtered.sort((a, b) => a.baseMonthlyFee - b.baseMonthlyFee).slice(0, 5);
    } else {
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
  }

  // 🟦 通信制限時の速度フィルター
  if (answers.speedLimitImportance) {
    const need = answers.speedLimitImportance ?? "";

    if (!need.includes("格安SIM水準")) {
      let requiredSpeed = 0;

      if (need.includes("大手キャリア水準")) requiredSpeed = 1.5;
      else if (need.includes("サブブランド水準")) requiredSpeed = 0.5;

      filtered = filtered.filter(plan => (plan.speedLimitMbps ?? 0) >= requiredSpeed);
    }
  }

  // 🟦 テザリング利用フィルター
  if (answers.tetheringNeeded?.includes("はい")) {
    filtered = filtered.filter(plan => plan.tetheringAvailable);

    if (answers.tetheringUsage) {
      const usage = answers.tetheringUsage ?? "";
      filtered = filtered.filter(plan => {
        const cap = plan.tetheringMaxGB ?? 0;
        if (usage.includes("〜30GB")) return cap >= 30;
        if (usage.includes("〜60GB")) return cap >= 60;
        if (usage.includes("無制限")) return cap === Infinity;
        return true;
      });
    }
  }

  // ② 通話オプション（留守電など）
  if (answers.callOptionsNeeded?.includes("はい")) {
    filtered = filtered.filter(plan => plan.hasVoicemail);
  }

  // 🟩🟩 国内通話プランフィルター（修正版）🟩🟩
if (answers.callPlanType && answers.callPlanType.length > 0) {
  const timeLimitMap = {
    "5分以内": 5,
    "10分以内": 10,
    "15分以内": 15,
    "30分以内": 30,
    "無制限": Infinity,
  };

  const monthlyLimitMap = {
    "月60分まで無料": 60,
    "月70分まで無料": 70,
    "月100分まで無料": 100,
    "無制限（完全定額）": Infinity,
  };

  const hybridLimitMap = {
    "月30回まで各10分無料": { count: 30, perCall: 10 },
    "月50回まで各10分無料": { count: 50, perCall: 10 },
    "無制限（回数制限なし）": { count: Infinity, perCall: Infinity },
  };

  const selectedTypes = answers.callPlanType ?? [];

  filtered = filtered.filter(plan => {
    let match = false;

    // 🕐 時間制限型
    if (selectedTypes.includes("1回あたり")) {
      const limit = timeLimitMap[answers.timeLimitPreference as keyof typeof timeLimitMap];
      if (limit && (plan.callTimeLimit! >= limit || plan.callTimeLimit === Infinity)) match = true;
    }

    // 📆 月間制限型
    if (selectedTypes.includes("合計通話時間")) {
      const limit = monthlyLimitMap[answers.monthlyLimitPreference as keyof typeof monthlyLimitMap];
      if (limit && (plan.callMonthlyLimit! >= limit || plan.callMonthlyLimit === Infinity)) match = true;
    }

    // 🔁 ハイブリッド型
    if (selectedTypes.includes("回数まで")) {
      const limit = hybridLimitMap[answers.hybridCallPreference as keyof typeof hybridLimitMap];
      if (
        limit &&
        plan.callCountLimit! >= limit.count &&
        plan.callPerCallLimit! >= limit.perCall
      )
        match = true;
    }

    // どれか一つでも合えば通過（OR判定）
    return match || selectedTypes.length === 0;
  });
}


  // ⑥-2 購入端末モデルのフィルター
  if (answers.deviceModel && answers.deviceModel !== "その他") {
    const selectedModel = answers.deviceModel.toLowerCase();
    filtered = filtered.filter(plan => {
      const devices = plan.availableDevices?.map(d => d.toLowerCase()) ?? [];
      return devices.some(device => device.includes(selectedModel));
    });
  }

  // ⑦ 海外利用
  if (answers.overseasUse?.startsWith("はい")) {
    filtered = filtered.filter(plan => plan.supportsOverseasUse);
  }
  if (answers.dualSim?.includes("はい")) {
    filtered = filtered.filter(plan => plan.supportsDualSim);
  }

  if (answers.localSimPurchase) {
    if ((answers.localSimPurchase ?? "").includes("はい")) {
      filtered = filtered.filter(plan => plan.allowsLocalSimCombination);
    } else if ((answers.localSimPurchase ?? "").includes("いいえ")) {
      filtered = filtered.filter(plan => plan.supportsGlobalRoaming);
    }
  }

  if (answers.stayCountry) {
    const c = answers.stayCountry as string;
    filtered = filtered.filter(plan => plan.supportedRegions?.includes(c));
  }

  // ⑧ 支払い方法（複数選択対応）
  if (answers.mainCard && Array.isArray(answers.mainCard) && answers.mainCard.length > 0) {
    const selectedMethods = answers.mainCard as string[];
    filtered = filtered.filter(plan =>
      selectedMethods.some((method: string) => plan.supportedPaymentMethods?.includes(method))
    );
  }

  return filtered;
}
