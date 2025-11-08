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

  const deviceMethodText = `${answers.buyingDevice ?? ""} ${answers.devicePurchaseMethods ?? ""}`.toLowerCase();

  const isLease =
    /返却|トクする|カエドキ|lease|return|carrier_return/.test(deviceMethodText);
  const isBuy =
    /購入|分割|buy|official|store|carrier_purchase/.test(deviceMethodText);

  // === lease（返却）ロジック ===
  if (isLease) {
    const matchLease =
      devicePricesLease.find((d) => {
        const modelNorm = normalize(d.model);
        const storageNorm = normalize(d.storage);
        const carrierNorm = d.carrier?.toLowerCase() ?? "";
        const modelMatch = modelNorm.includes(selectedModel) || selectedModel.includes(modelNorm);
        const storageMatch = storageNorm.includes(selectedStorage) || selectedStorage.includes(storageNorm);
        const carrierMatch = !carrier || carrierNorm === carrier;
        return d.ownershipType === "lease" && modelMatch && storageMatch && carrierMatch;
      }) ??
      devicePricesLease.find((d) => {
        const modelNorm = normalize(d.model);
        const storageNorm = normalize(d.storage);
        return (
          d.ownershipType === "lease" &&
          modelNorm.includes(selectedModel) &&
          storageNorm.includes(selectedStorage)
        );
      });

    if (matchLease) {
      deviceLeaseMonthly = matchLease.monthlyPayment;
      console.log(`📱 [match] ${carrier}: lease = ${matchLease.model} ${matchLease.storage} → ¥${matchLease.monthlyPayment}`);
    } else {
      console.warn(`⚠️ lease未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  // === buy（購入）ロジック ===
  if (isBuy) {
    const matchBuy =
      devicePricesBuy.find((d) => {
        const modelNorm = normalize(d.model);
        const storageNorm = normalize(d.storage);
        const carrierNorm = d.carrier?.toLowerCase() ?? "";
        const modelMatch = modelNorm.includes(selectedModel) || selectedModel.includes(modelNorm);
        const storageMatch = storageNorm.includes(selectedStorage) || selectedStorage.includes(storageNorm);
        const carrierMatch = !carrier || carrierNorm === carrier;
        return d.ownershipType === "buy" && modelMatch && storageMatch && carrierMatch;
      }) ??
      devicePricesBuy.find((d) => {
        const modelNorm = normalize(d.model);
        const storageNorm = normalize(d.storage);
        return (
          d.ownershipType === "buy" &&
          modelNorm.includes(selectedModel) &&
          storageNorm.includes(selectedStorage)
        );
      });

    if (matchBuy) {
      deviceBuyMonthly = matchBuy.monthlyPayment;
      console.log(`💰 [match] ${carrier}: buy = ${matchBuy.model} ${matchBuy.storage} → ¥${matchBuy.monthlyPayment}`);
    } else {
      console.warn(`⚠️ buy未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  return { deviceLeaseMonthly, deviceBuyMonthly };
}
