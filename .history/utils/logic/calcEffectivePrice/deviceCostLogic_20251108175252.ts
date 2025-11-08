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

  const selectedModel = normalize(answers.deviceModel ?? "");
  const selectedStorage = normalize(answers.deviceStorage ?? "");
  const carrier = plan.carrier?.toLowerCase() ?? "";

  const methodArray = Array.isArray(answers.devicePurchaseMethods)
    ? answers.devicePurchaseMethods
    : [answers.devicePurchaseMethods ?? ""];

  // === 購入方法のフラグ ===
  const method =
    methodArray.includes("carrier_return")
      ? "carrier_return"
      : methodArray.includes("carrier_purchase")
      ? "carrier_purchase"
      : methodArray.includes("store_purchase")
      ? "store_purchase"
      : "";

  // === 返却プログラム ===
  if (method === "carrier_return") {
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
      console.log(
        `📱 [返却プログラム] ${carrier}: ${matchLease.model} ${matchLease.storage} → ¥${matchLease.monthlyPayment}`
      );
    } else {
      console.warn(`⚠️ lease未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  // === 通常購入 ===
  else if (method === "carrier_purchase") {
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
      console.log(
        `💰 [通常購入] ${carrier}: ${matchBuy.model} ${matchBuy.storage} → ¥${matchBuy.monthlyPayment}`
      );
    } else {
      console.warn(`⚠️ buy未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  // === 正規店購入は非表示 ===
  else if (method === "store_purchase") {
    console.log(`🛍️ [正規店購入スキップ] ${selectedModel} ${selectedStorage}`);
    deviceLeaseMonthly = 0;
    deviceBuyMonthly = 0;
  }

  return { deviceLeaseMonthly, deviceBuyMonthly };
}
