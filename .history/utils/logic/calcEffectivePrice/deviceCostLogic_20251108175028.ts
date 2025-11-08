// utils/logic/calcEffectivePrice/deviceCostLogic.ts
import { devicePricesLease } from "@/data/devicePricesLease";
import { devicePricesBuy } from "@/data/devicePricesBuy";
import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface DeviceCostResult {
  deviceLeaseMonthly: number;
  deviceBuyMonthly: number;
}

export function calcDeviceCost(plan: Plan, answers: DiagnosisAnswers): DeviceCostResult {
  let deviceLeaseMonthly = 0;
  let deviceBuyMonthly = 0;

  const normalize = (t: string) =>
    t
      ?.toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/(gb|ＧＢ)/gi, "gb")
      .trim() || "";

  // ===== 選択値の正規化 =====
  const selectedModel = normalize(answers.deviceModel ?? "");
  const selectedStorage = normalize(answers.deviceStorage ?? "");
  const carrier = plan.carrier?.toLowerCase() ?? "";

  // devicePurchaseMethods は string | string[] の可能性があるため安全に抽出
  const methodArray = Array.isArray(answers.devicePurchaseMethods)
    ? answers.devicePurchaseMethods
    : [answers.devicePurchaseMethods ?? ""];

  // === 判定フラグ ===
  const isLease =
    methodArray.includes("carrier_return") ||
    methodArray.some((m) => /返却|トクする|カエドキ|lease|return/.test(m));

  const isBuy =
    methodArray.includes("carrier_purchase") ||
    methodArray.some((m) => /購入|buy|carrier/.test(m));

  const isOfficialStore =
    methodArray.includes("store_purchase") ||
    methodArray.some((m) => /official_store|apple|正規|家電|量販店/.test(m));

  // === 返却プログラム ===
  if (isLease) {
    const matchLease = devicePricesLease.find((d) => {
      const modelNorm = normalize(d.model);
      const storageNorm = normalize(d.storage);
      const carrierNorm = d.carrier?.toLowerCase() ?? "";
      return (
        d.ownershipType === "lease" &&
        (modelNorm.includes(selectedModel) || selectedModel.includes(modelNorm)) &&
        (storageNorm.includes(selectedStorage) || selectedStorage.includes(storageNorm)) &&
        (!carrier || carrierNorm === carrier)
      );
    });

    if (matchLease) {
      deviceLeaseMonthly = matchLease.monthlyPayment;
      console.log(`📱 [match] ${carrier}: lease = ${matchLease.model} ${matchLease.storage} → ¥${matchLease.monthlyPayment}`);
    } else {
      console.warn(`⚠️ lease未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  // === 通常購入（正規店以外） ===
  if (isBuy && !isOfficialStore) {
    const matchBuy = devicePricesBuy.find((d) => {
      const modelNorm = normalize(d.model);
      const storageNorm = normalize(d.storage);
      const carrierNorm = d.carrier?.toLowerCase() ?? "";
      return (
        d.ownershipType === "buy" &&
        (modelNorm.includes(selectedModel) || selectedModel.includes(modelNorm)) &&
        (storageNorm.includes(selectedStorage) || selectedStorage.includes(storageNorm)) &&
        (!carrier || carrierNorm === carrier)
      );
    });

    if (matchBuy) {
      deviceBuyMonthly = matchBuy.monthlyPayment;
      console.log(`💰 [match] ${carrier}: buy = ${matchBuy.model} ${matchBuy.storage} → ¥${matchBuy.monthlyPayment}`);
    } else {
      console.warn(`⚠️ buy未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  // === 正規店購入は非表示 ===
  if (isOfficialStore) {
    console.log(`🛍️ [official store purchase skipped] ${selectedModel} ${selectedStorage}`);
    deviceLeaseMonthly = 0;
    deviceBuyMonthly = 0;
  }

  return { deviceLeaseMonthly, deviceBuyMonthly };
}
