import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface CallOptionResult {
  callOptionFee: number;
  internationalCallFee: number;
  voicemailFee: number;
  tetheringFee: number;
  debug?: Record<string, any>;
}

export function calcCallOptions(
  plan: Plan,
  answers: DiagnosisAnswers
): CallOptionResult {
  // === 通話オプション料金 ===
  let callOptionFee = 0;
  if (plan.callOptions?.length) {
    const callOptionMap: Record<string, string> = {
      "5分以内": "5min",
      "10分以内": "10min",
      "月30分まで無料": "monthly30",
      "月60分まで無料": "monthly60",
      "月30回まで各10分無料": "hybrid_30x10",
      "無制限（完全定額）": "unlimited",
    };

    const allTexts = [
      answers.timeLimitPreference,
      answers.monthlyLimitPreference,
      answers.hybridCallPreference,
      ...(answers.callPlanType ?? []),
    ].filter(Boolean);

    const matchedIds = Object.entries(callOptionMap)
      .filter(([key]) => allTexts.some((t) => t?.includes(key)))
      .map(([, id]) => id);

    const validOptions = plan.callOptions.filter((opt) => {
      if (matchedIds.includes(opt.id)) return true;
      if (
        matchedIds.includes("5min") &&
        ["10min", "monthly30", "monthly60", "unlimited"].includes(opt.id)
      )
        return true;
      if (
        matchedIds.includes("monthly30") &&
        ["monthly60", "unlimited"].includes(opt.id)
      )
        return true;
      if (
        matchedIds.includes("hybrid_30x10") &&
        ["unlimited"].includes(opt.id)
      )
        return true;
      return false;
    });

    const cheapestOption = validOptions
      .filter((v) => typeof v.fee === "number" && !isNaN(v.fee))
      .sort((a, b) => a.fee - b.fee)[0];

    callOptionFee = cheapestOption?.fee ?? 0;
  }

  // 🌍 === 国際通話オプション料金 ===
  let internationalCallFee = 0;
  try {
    const intl = answers.internationalCallCarrier;
    const wantsIntlCall =
      answers.needInternationalCallUnlimited === "はい" ||
      (Array.isArray(intl) && intl.length > 0);

    if (wantsIntlCall) {
      const intlOption = plan.internationalOptions?.find(
        (opt) =>
          (opt.name && opt.name.includes("国際通話")) ||
          (opt.id && opt.id.includes("international"))
      );
      if (intlOption && typeof intlOption.fee === "number") {
        internationalCallFee += intlOption.fee;
      }
    }
  } catch (err) {
    console.warn("⚠️ 国際通話処理中に例外:", err);
  }

  // 📞 === 留守番電話 ===
  let voicemailFee = 0;
  const wantsVoicemail =
    typeof answers.callOptionsNeeded === "string" &&
    answers.callOptionsNeeded.includes("はい");

  if (wantsVoicemail) {
    if (typeof plan.voicemailFee === "number" && plan.voicemailFee > 0) {
      voicemailFee = plan.voicemailFee;
    }
  }

  // 📡 === テザリングオプション ===
  let tetheringFee = 0;
  const tetheringAnswer = answers.tetheringNeeded;
  const wantsTethering =
    (typeof tetheringAnswer === "string" &&
      tetheringAnswer.includes("はい")) ||
    tetheringAnswer === true;

  if (wantsTethering && plan.tetheringAvailable) {
    if (typeof plan.tetheringFee === "number" && plan.tetheringFee > 0) {
      tetheringFee = plan.tetheringFee;
    }
  }

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
    },
  };
}
