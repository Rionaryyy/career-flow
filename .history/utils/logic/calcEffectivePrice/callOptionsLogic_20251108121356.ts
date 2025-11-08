import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface CallOptionResult {
  callOptionFee: number;
  internationalCallFee: number;
  voicemailFee: number;
  tetheringFee: number;
  debug?: Record<string, any>;
}

/**
 * 📞 通話・通信オプション料金算出ロジック
 * ---------------------------------------------------
 * - ユーザー回答（Phase2）とプラン定義をもとに
 *   通話オプション／国際通話／留守電／テザリングの
 *   月額追加料金を動的に算出する。
 */
export function calcCallOptions(plan: Plan, answers: DiagnosisAnswers): CallOptionResult {
  // === 📞 通話オプション ===
  let callOptionFee = 0;

  if (plan.callOptions?.length) {
    const callOptionMap: Record<string, string> = {
      "5分以内": "5min",
      "10分以内": "10min",
      "15分以内": "15min",
      "月30分まで無料": "monthly30",
      "月60分まで無料": "monthly60",
      "月100分まで無料": "monthly100",
      "月30回まで各10分無料": "hybrid_30x10",
      "月50回まで各10分無料": "hybrid_50x10",
      "無制限（完全定額）": "unlimited",
    };

    // === 回答をまとめて取得 ===
    const allTexts = [
      answers.timeLimitPreference,
      answers.monthlyLimitPreference,
      answers.hybridCallPreference,
      ...(answers.callPlanType ?? []),
    ].filter(Boolean) as string[];

    // === 回答に一致するオプションIDを抽出 ===
    const matchedIds = Object.entries(callOptionMap)
      .filter(([label]) => allTexts.some((t) => t.includes(label)))
      .map(([, id]) => id);

    // === プラン側の候補から一致する最安オプションを選定 ===
    const validOptions = plan.callOptions.filter((opt) => {
      if (matchedIds.includes(opt.id)) return true;
      // 下位互換含めた柔軟一致
      if (matchedIds.includes("5min") && ["10min", "monthly30", "monthly60", "unlimited"].includes(opt.id)) return true;
      if (matchedIds.includes("monthly30") && ["monthly60", "unlimited"].includes(opt.id)) return true;
      if (matchedIds.includes("hybrid_30x10") && ["hybrid_50x10", "unlimited"].includes(opt.id)) return true;
      return false;
    });

    const cheapestOption = validOptions
      .filter((v) => typeof v.fee === "number" && !isNaN(v.fee))
      .sort((a, b) => a.fee - b.fee)[0];

    callOptionFee = cheapestOption?.fee ?? 0;
  }

  // === 🌍 国際通話オプション ===
  let internationalCallFee = 0;
  try {
    const intlCarriers = answers.internationalCallCarrier;
    const wantsIntlCall =
      answers.needInternationalCallUnlimited === "はい" ||
      (Array.isArray(intlCarriers) && intlCarriers.length > 0);

    if (wantsIntlCall) {
      const intlOption = plan.internationalOptions?.find(
        (opt) =>
          (opt.name && opt.name.includes("国際通話")) ||
          (opt.id && opt.id.includes("international"))
      );
      if (intlOption && typeof intlOption.fee === "number") {
        internationalCallFee = intlOption.fee;
      }
    }
  } catch (err) {
    console.warn("⚠️ 国際通話オプション判定中エラー:", err);
  }

  // === 💬 留守番電話 ===
  let voicemailFee = 0;
  const wantsVoicemail =
    typeof answers.callOptionsNeeded === "string"
      ? answers.callOptionsNeeded.includes("はい")
      : false;

  if (wantsVoicemail && typeof plan.voicemailFee === "number") {
    voicemailFee = plan.voicemailFee;
  }

  // === 📡 テザリングオプション ===
  let tetheringFee = 0;
  const tetheringAnswer = answers.tetheringNeeded;
  const wantsTethering =
    (typeof tetheringAnswer === "string" && tetheringAnswer.includes("はい")) ||
    tetheringAnswer === true;

  if (wantsTethering && plan.tetheringAvailable && plan.tetheringFee) {
    tetheringFee = plan.tetheringFee;
  }

  // === 🧾 デバッグ出力（開発モード用） ===
  return {
    callOptionFee,
    internationalCallFee,
    voicemailFee,
    tetheringFee,
    debug: {
      callOptionFee,
      internationalCallFee,
      voicemailFee,
      tetheringFee,
      planId: plan.planId,
      carrier: plan.carrier,
    },
  };
}
