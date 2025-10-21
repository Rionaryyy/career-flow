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

  // 🟩🟩 ② 国内通話プランフィルター（ハイブリッド修正版 ✅）
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

    // 🟦 海外通話かけ放題（上書き防止修正版 ✅）
    const selectedCarriers = Array.isArray(answers.internationalCallCarrier)
      ? answers.internationalCallCarrier
      : [];

    filtered = filtered.filter(plan => {
      let match = false;

      // 🟦 海外通話かけ放題条件（柔軟一致対応 ✅）
      if (
        answers.needInternationalCallUnlimited === "はい" &&
        selectedCarriers.length > 0
      ) {
        const matchesInternationalCarrier = selectedCarriers.some(carrier => {
          if (carrier.includes("楽天") || carrier.includes("Rakuten")) {
            return plan.carrier?.toLowerCase().includes("rakuten");
          }
          if (carrier.toLowerCase().includes("au")) {
            return plan.carrier?.toLowerCase().includes("au");
          }
          return false;
        });

        if (!matchesInternationalCarrier) return false;
      }

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

      // 🔁 ハイブリッド型（完全対応 ✅）
      if (selectedTypes.some(type => /(ハイブリッド|回数)/.test(type))) {
        const hybridKey = Object.keys(hybridLimitMap).find(k =>
          answers.hybridCallPreference
            ?.replace(/\s/g, "")
            .includes(k.replace(/\s/g, ""))
        );

        const limit =
          hybridKey && hybridLimitMap[hybridKey as keyof typeof hybridLimitMap];

        if (
          limit &&
          (plan.callType?.toLowerCase().includes("hybrid") ||
            plan.planName.includes("ハイブリッド") ||
            plan.planName.includes("月30回")) &&
          (plan.callCountLimit ?? 0) >= limit.count &&
          (plan.callPerCallLimit ?? 0) >= limit.perCall
        ) {
          match = true;
        }
      }

      // 🟪 無制限型（完全定額）判定追加 ✅
      if (selectedTypes.includes("無制限（完全定額）")) {
        if (plan.callType?.toLowerCase().includes("unlimited")) {
          match = true;
        }
      }

      return match || selectedTypes.length === 0;
    });
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
