import { Plan } from "../../types/planTypes";
import { DiagnosisAnswers } from "../../types/types";
import { fiberDiscountPlans } from "../../data/setDiscounts/fiberDiscountPlans";
import { routerDiscountPlans } from "../../data/setDiscounts/routerDiscountPlans";
import { pocketWifiDiscountPlans } from "../../data/setDiscounts/pocketWifiDiscountPlans";
import { devicePricesLease } from "../../data/devicePricesLease";
import { devicePricesBuy } from "../../data/devicePricesBuy";



export interface PlanCostBreakdown {
  baseFee: number;
  callOptionFee: number;
  familyDiscount: number;
  studentDiscount: number;
  ageDiscount: number;
  cashback: number;
  initialFeeMonthly: number;
  tetheringFee: number;
  total: number;
  fiberDiscount?: number;
  routerDiscount?: number;
  pocketWifiDiscount?: number;
  electricDiscount?: number;
  gasDiscount?: number;
  subscriptionDiscount?: number;
  paymentDiscount?: number;
  paymentReward?: number;
  dailyPaymentReward?: number;
  shoppingReward?: number;
  pointReward?: number;
  deviceLeaseMonthly?: number;
  deviceBuyMonthly?: number;
  totalWithDevice?: number;
  cashbackTotal?: number;
  initialCostTotal?: number;
  deviceTotal?: number;
  internationalCallFee?: number;
  voicemailFee?: number;
  fiberBaseFee?: number;
  routerBaseFee?: number;
  pocketWifiBaseFee?: number;
  carrierBarcodeReward?: number;
  carrierShoppingReward?: number;
  totalCarrierReward?: number;
}


export function calculatePlanCost(plan: Plan, answers: DiagnosisAnswers): PlanCostBreakdown {
  const base = plan.baseMonthlyFee ?? 0;

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
      answers.phase2?.timeLimitPreference,
      answers.phase2?.monthlyLimitPreference,
      answers.phase2?.hybridCallPreference,
      ...(answers.phase2?.callPlanType ?? []),
    ].filter(Boolean);

    const matchedIds = Object.entries(callOptionMap)
      .filter(([key]) => allTexts.some((t) => t?.includes(key)))
      .map(([, id]) => id);

    const validOptions = plan.callOptions.filter((opt) => {
      if (matchedIds.includes(opt.id)) return true;
      if (matchedIds.includes("5min") && ["10min", "monthly30", "monthly60", "unlimited"].includes(opt.id)) return true;
      if (matchedIds.includes("monthly30") && ["monthly60", "unlimited"].includes(opt.id)) return true;
      if (matchedIds.includes("hybrid_30x10") && ["unlimited"].includes(opt.id)) return true;
      return false;
    });

    const cheapestOption = validOptions.sort((a, b) => a.fee - b.fee)[0];
    callOptionFee = cheapestOption?.fee ?? 0;
  }

  // 🌍 === 国際通話オプション料金（個別項目として扱う） ===
  let internationalCallFee = 0;

  if (answers.phase2?.needInternationalCallUnlimited === "はい") {
    const selected = answers.phase2?.internationalCallCarrier ?? [];

    for (const c of selected) {
      const lower = c.toLowerCase();

      // キャリア判定
      const carrierMatch =
        (lower.includes("楽天") && plan.carrier?.toLowerCase().includes("rakuten")) ||
        (lower.includes("au") && plan.carrier?.toLowerCase().includes("au")) ||
        (lower.includes("softbank") && plan.carrier?.toLowerCase().includes("softbank")) ||
        (lower.includes("docomo") && plan.carrier?.toLowerCase().includes("docomo"));

      if (carrierMatch) {
        // ✅ callOptions → internationalOptions に変更
        const intlOption =
          plan.internationalOptions?.find(
            (opt) =>
              opt.name?.includes("国際通話") ||
              opt.id?.includes("international")
          ) ?? null;

        if (intlOption && typeof intlOption.fee === "number") {
          internationalCallFee += intlOption.fee;
          console.log(`🌍 ${plan.carrier} に国際通話オプション (${intlOption.fee}円) 加算`);
        }
      }
    }
  }

  // === ⑨ 留守番電話オプション費用 ===
let voicemailFee = 0;

// 「はい（必要）」が選択された場合のみ対象
const wantsVoicemail =
  typeof answers.phase2?.callOptionsNeeded === "string" &&
  answers.phase2.callOptionsNeeded.includes("はい");

if (wantsVoicemail) {
  if (typeof plan.voicemailFee === "number" && plan.voicemailFee > 0) {
    voicemailFee = plan.voicemailFee;
  }
}

  // === 家族割 ===
  let familyDiscount = 0;
  if (plan.supportsFamilyDiscount && answers.phase2?.familyLines) {
    const lineCount = parseInt(answers.phase2.familyLines.replace(/\D/g, ""), 10) || 1;
    if (plan.familyDiscountRules?.length) {
      const matched = [...plan.familyDiscountRules]
        .sort((a, b) => b.lines - a.lines)
        .find((r) => lineCount >= r.lines);
      if (matched) familyDiscount = matched.discount;
    }
  }

  // === 学割・年齢割 ===
  let studentDiscount = 0;
  let ageDiscount = 0;
  const hasStudent = answers.phase2?.studentDiscount === "はい";
  const ageGroup = answers.phase2?.ageGroup;

  if (hasStudent && plan.supportsStudentDiscount && plan.studentDiscountRules) {
    const matched = plan.studentDiscountRules.find((r) => {
      const min = r.minAge ?? 0;
      const max = r.maxAge ?? Infinity;
      const ageValue = parseInt(ageGroup?.replace(/\D/g, "") || "0", 10);
      return ageValue >= min && ageValue <= max;
    });
    if (matched) studentDiscount = matched.discount;
  }

  if (plan.supportsAgeDiscount && plan.ageDiscountRules && ageGroup) {
    const normalizedInput = ageGroup.replace(/\s/g, "").replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    const numericInput = parseInt(normalizedInput.replace(/\D/g, "") || "0", 10);

    const matched = plan.ageDiscountRules.find((r) => {
      const normalizedRule = r.ageGroup
        .replace(/\s/g, "")
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
      const numericRule = parseInt(normalizedRule.replace(/\D/g, "") || "0", 10);
      return (
        normalizedInput.includes(normalizedRule) ||
        normalizedRule.includes(normalizedInput) ||
        numericInput === numericRule
      );
    });
    if (matched) ageDiscount = matched.discount;
  }

  if (plan.discountCombinationRules?.includes("exclusive_student_age")) {
    if (studentDiscount > 0 && ageDiscount > 0) {
      if (studentDiscount >= ageDiscount) ageDiscount = 0;
      else studentDiscount = 0;
    }
  }

  // === 📱 端末関連（月額費用） ===
  let deviceLeaseMonthly = 0;
  let deviceBuyMonthly = 0;

  const normalize = (text: string) =>
    text
      ?.replace(/\s+/g, "")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/ＧＢ/gi, "GB")
      .replace(/gb$/i, "gb")
      .toLowerCase()
      .trim() || "";

  const buyingText =
    answers.phase2?.buyingDevice ??
    answers.phase2?.devicePurchaseMethods?.[0] ??
    "";

  const selectedModel = normalize(answers.phase2?.deviceModel ?? "");
  const selectedStorage = normalize(answers.phase2?.deviceStorage ?? "");

  if (typeof buyingText === "string" && /(返却|カエドキ|トクする|スマホトク|プログラム)/.test(buyingText)) {
    const match = devicePricesLease.find(
      (d) =>
        d.ownershipType === "lease" &&
        d.carrier?.toLowerCase() === plan.carrier?.toLowerCase() &&
        normalize(d.model).includes(selectedModel) &&
        normalize(d.storage).includes(selectedStorage)
    );
    if (match) {
      deviceLeaseMonthly = match.monthlyPayment;
      deviceBuyMonthly = 0;
    }
  } else if (typeof buyingText === "string" && /(購入|分割|一括)/.test(buyingText)) {
    const isCarrierPurchase =
      /(キャリア|au|docomo|ドコモ|ソフトバンク|softbank|rakuten|楽天)/i.test(buyingText);
    const isOfficialStorePurchase = /(正規|Apple|家電量販店)/i.test(buyingText);

    if (isOfficialStorePurchase) {
      deviceBuyMonthly = 0;
      deviceLeaseMonthly = 0;
    } else {
      const matchBuy = devicePricesBuy.find((d) => {
        const modelMatch =
          normalize(d.model).includes(selectedModel) || selectedModel.includes(normalize(d.model));
        const storageMatch =
          normalize(d.storage).includes(selectedStorage) || selectedStorage.includes(normalize(d.storage));

        if (!isCarrierPurchase) {
          return d.ownershipType === "buy" && modelMatch && storageMatch;
        }
        return (
          d.ownershipType === "buy" &&
          d.carrier?.toLowerCase() === plan.carrier?.toLowerCase() &&
          modelMatch &&
          storageMatch
        );
      });

      if (matchBuy) {
        deviceBuyMonthly = matchBuy.monthlyPayment;
        deviceLeaseMonthly = 0;
      }
    }
  }

  // === 💰 キャッシュバック・初期費用（月換算） ===
  let cashback = 0;
  let initialFeeMonthly = 0;
  let cashbackTotal = plan.cashbackAmount ?? 0;
  let initialCostTotal = plan.initialCost ?? 0;

  const compareAxis = answers.phase1?.compareAxis ?? "";
  const comparePeriod = answers.phase1?.comparePeriod ?? "";

  let periodMonths = 12;
  if (comparePeriod.includes("2年")) periodMonths = 24;
  else if (comparePeriod.includes("3年")) periodMonths = 36;

  if (compareAxis.includes("実際に支払う金額")) {
    cashback = cashbackTotal / periodMonths;
    initialFeeMonthly = initialCostTotal / periodMonths;
  }

  // === 🎬 サブスク割 ===
  let subscriptionDiscount = 0;
  const allSubs = [
    answers.phase2?.videoSubscriptions,
    answers.phase2?.musicSubscriptions,
    answers.phase2?.bookSubscriptions,
    answers.phase2?.gameSubscriptions,
    answers.phase2?.cloudSubscriptions,
    answers.phase2?.otherSubscriptions,
  ]
    .flat()
    .filter(Boolean);

  if (allSubs.length && plan.subscriptionDiscountRules?.length) {
    const matched = plan.subscriptionDiscountRules.filter((r) =>
      r.applicableSubscriptions?.some((s) => allSubs.includes(s))
    );
    if (matched.length) subscriptionDiscount = matched.reduce((sum, r) => sum + (r.discount ?? 0), 0);
  }

  // === セット割・その他割引変数の初期化 ===
  let fiberDiscount = 0;
  let routerDiscount = 0;
  let pocketWifiDiscount = 0;
  let electricDiscount = 0;
  let gasDiscount = 0;
  let fiberBaseFee = 0;      // ←追加
  let routerBaseFee = 0;     // ←追加
  let pocketWifiBaseFee = 0; // ←追加

// === ⑧ テザリング費用（DBに登録あり + 「はい」回答時のみ加算） ===
let tetheringFee = 0;

// 「はい（必要）」などの回答を含む場合のみ対象
const tetheringAnswer = answers.phase2?.tetheringNeeded;
const wantsTethering =
  (typeof tetheringAnswer === "string" && tetheringAnswer.includes("はい")) ||
  tetheringAnswer === true;

if (wantsTethering && plan.tetheringAvailable) {
  if (typeof plan.tetheringFee === "number" && plan.tetheringFee > 0) {
    tetheringFee = plan.tetheringFee;
  }
}

   // === 💳 支払い割引・還元（キャリア料金支払いに対する特典） ===
  let paymentDiscount = 0;
  let paymentReward = 0;

  const selectedMain = answers.phase2?.mainCard ?? [];
  const selectedBrands = answers.phase2?.cardDetail ?? [];

  if (plan.paymentBenefitRules?.length) {
    for (const rule of plan.paymentBenefitRules) {
      const matchesMethod = selectedMain.includes(rule.method);
      const matchesBrand = rule.brands?.some((b) => selectedBrands.includes(b));

      if (matchesMethod && matchesBrand) {
        if (rule.discount) paymentDiscount += rule.discount;
        if (rule.rate && rule.rate > 0) {
          const totalAfterDiscounts =
            base +
            callOptionFee -
            familyDiscount -
            studentDiscount -
            ageDiscount -
            cashback -
            fiberDiscount -
            routerDiscount -
            pocketWifiDiscount -
            electricDiscount -
            gasDiscount -
            subscriptionDiscount -
            paymentDiscount +
            initialFeeMonthly +
            tetheringFee+
            internationalCallFee+
            voicemailFee;

          paymentReward += Math.round(totalAfterDiscounts * rule.rate);
        }
      }
    }
  }

// === 💰 キャリア契約によるバーコード決済・ショッピング還元 ===
  let carrierBarcodeReward = 0;
  let carrierShoppingReward = 0;

  const barcodeMonthly =
    Number((answers.phase2?.paymentMonthly || "0").toString().replace(/\D/g, "")) || 0;

  if (plan.carrierPaymentRewardRate && plan.carrierPaymentRewardRate > 0) {
    const calcReward = Math.round(barcodeMonthly * plan.carrierPaymentRewardRate);
    carrierBarcodeReward = plan.carrierPaymentRewardLimit
      ? Math.min(calcReward, plan.carrierPaymentRewardLimit)
      : calcReward;
    console.log(
      `💳 ${plan.carrier} バーコード還元: rate=${plan.carrierPaymentRewardRate}, 還元=${carrierBarcodeReward}`
    );
  }

  const shoppingMonthly =
    Number((answers.phase2?.shoppingMonthly || "0").toString().replace(/\D/g, "")) || 0;
  const shoppingList = answers.phase2?.shoppingList ?? [];

  let shopRate = 0;
  if (shoppingList.some((s) => s.includes("Yahoo!ショッピング")))
    shopRate = plan.carrierShoppingRewardRate_Yahoo ?? 0;
  else if (shoppingList.some((s) => s.includes("LOHACO")))
    shopRate = plan.carrierShoppingRewardRate_LOHACO ?? 0;
  else if (shoppingList.some((s) => s.includes("楽天市場")))
    shopRate = plan.carrierShoppingRewardRate_Rakuten ?? 0;
  else if (shoppingList.some((s) => s.includes("au PAYマーケット")))
    shopRate = plan.carrierShoppingRewardRate_AUPayMarket ?? 0;

  carrierShoppingReward = Math.round(shoppingMonthly * shopRate);
  const totalCarrierReward = carrierBarcodeReward + carrierShoppingReward;


  // === セット割（光・ルーター・電気など） ===
  const normalizeText = (text: string) =>
    text
      ?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/Gps/gi, "Gbps")
      .replace(/\s+/g, "")
      .trim() || "";

  if (answers.phase2?.fiberType && answers.phase2?.fiberSpeed) {
    const ansFiberType = normalizeText(answers.phase2.fiberType);
    const ansFiberSpeed = normalizeText(answers.phase2.fiberSpeed);
    const match = fiberDiscountPlans.find(
      (p: any) =>
        p.carrier === plan.carrier &&
        (!p.fiberType || normalizeText(p.fiberType) === ansFiberType) &&
        (!p.fiberSpeed || normalizeText(p.fiberSpeed) === ansFiberSpeed)
    );
    if (match) {
      fiberDiscount = match.setDiscountAmount;
      fiberBaseFee = match.setBaseFee ?? 0; // ←追加
    }
  }

  if (answers.phase2?.routerCapacity && answers.phase2?.routerSpeed) {
    const ansSpeed = normalizeText(answers.phase2.routerSpeed);
    const match = routerDiscountPlans.find(
      (p: any) => p.carrier === plan.carrier && normalizeText(p.routerSpeed ?? "") === ansSpeed
    );
    if (match) {
      routerDiscount = match.setDiscountAmount;
      routerBaseFee = match.setBaseFee ?? 0; // ←追加
    }
  }

if (answers.phase2?.pocketWifiCapacity || answers.phase2?.pocketWifiSpeed) {
  const ansCapacity = normalizeText(answers.phase2.pocketWifiCapacity ?? "");
  const ansSpeed = normalizeText(answers.phase2.pocketWifiSpeed ?? "");

  const match = pocketWifiDiscountPlans.find(
    (p: any) =>
      p.carrier?.toLowerCase() === plan.carrier?.toLowerCase() &&
      (
        (p.routerCapacity && normalizeText(p.routerCapacity) === ansCapacity) ||
        (p.routerSpeed && normalizeText(p.routerSpeed) === ansSpeed)
      )
  );

  if (match) {
    pocketWifiDiscount = match.setDiscountAmount ?? 0;
    pocketWifiBaseFee = match.setBaseFee ?? 0;
    console.log(`📡 ポケットWi-Fi割適用: ${match.planName} (-¥${match.setDiscountAmount}/月)`);
  } else {
    console.log("⚠️ ポケットWi-Fi割マッチなし:", {
      carrier: plan.carrier,
      ansCapacity,
      ansSpeed,
    });
  }
}


  const setDiscountText = Array.isArray(answers.phase2?.setDiscount)
    ? answers.phase2?.setDiscount.join(",")
    : (answers.phase2?.setDiscount ?? "");

  if (setDiscountText.includes("電気") && plan.supportsElectricSet && plan.energyDiscountRules) {
    const match = plan.energyDiscountRules.find((r) => r.type === "電気");
    if (match) electricDiscount = match.discount;
  }

  if (setDiscountText.includes("ガス") && plan.supportsGasSet && plan.energyDiscountRules) {
    const match = plan.energyDiscountRules.find((r) => r.type === "ガス");
    if (match) gasDiscount = match.discount;
  }

  // === セット割（光・ルーター・電気など） ===（省略）

     const total =
    base +
    callOptionFee -
    familyDiscount -
    studentDiscount -
    ageDiscount -
    cashback -
    fiberDiscount -
    routerDiscount -
    pocketWifiDiscount -
    electricDiscount -
    gasDiscount -
    subscriptionDiscount -
    paymentDiscount -
    paymentReward -
    totalCarrierReward + // ← キャリア還元を反映
    initialFeeMonthly +
    tetheringFee +
    deviceLeaseMonthly +
    deviceBuyMonthly +
    internationalCallFee +
    voicemailFee;
  return {
    baseFee: base,
    callOptionFee,
    familyDiscount,
    internationalCallFee,
    voicemailFee,
    studentDiscount,
    ageDiscount,
    cashback,
    cashbackTotal,
    initialFeeMonthly,
    initialCostTotal,
    tetheringFee,
    fiberDiscount,
    routerDiscount,
    pocketWifiDiscount,
    electricDiscount,
    gasDiscount,
    subscriptionDiscount,
    paymentDiscount,
    paymentReward,
    deviceLeaseMonthly,
    deviceBuyMonthly,
    fiberBaseFee,
    routerBaseFee,
    pocketWifiBaseFee,
    carrierBarcodeReward,
    carrierShoppingReward,
    totalCarrierReward,
    total: Math.round(total),
    totalWithDevice: Math.round(total),
  };
}