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

  const buyingDevice = `${answers.buyingDevice ?? ""} ${answers.devicePurchaseMethods ?? ""}`.toLowerCase();

  // === 返却プログラム (lease) ===
  if (/返却|トクする|カエドキ|lease|return/.test(buyingDevice)) {
    const match =
      devicePricesLease.find((d) => {
        const modelNorm = normalize(d.model);
        const storageNorm = normalize(d.storage);
        const carrierNorm = d.carrier?.toLowerCase() ?? "";

        // ゆるい一致
        const modelMatch =
          modelNorm.includes(selectedModel) || selectedModel.includes(modelNorm);
        const storageMatch =
          storageNorm.includes(selectedStorage) || selectedStorage.includes(storageNorm);
        const carrierMatch =
          !carrier || carrierNorm === carrier;

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

    if (match) {
      deviceLeaseMonthly = match.monthlyPayment;
      console.log(`📱 [match] ${carrier}: lease=${match.model} ${match.storage} → ¥${match.monthlyPayment}`);
    } else {
      console.warn(`⚠️ lease未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  // === 購入プログラム (buy) ===
  else if (/購入|分割|buy|official|store|キャリア/.test(buyingDevice)) {
    const match =
      devicePricesBuy.find((d) => {
        const modelNorm = normalize(d.model);
        const storageNorm = normalize(d.storage);
        const carrierNorm = d.carrier?.toLowerCase() ?? "";

        const modelMatch =
          modelNorm.includes(selectedModel) || selectedModel.includes(modelNorm);
        const storageMatch =
          storageNorm.includes(selectedStorage) || selectedStorage.includes(storageNorm);
        const carrierMatch =
          !carrier || carrierNorm === carrier;

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

    if (match) {
      deviceBuyMonthly = match.monthlyPayment;
      console.log(`💰 [match] ${carrier}: buy=${match.model} ${match.storage} → ¥${match.monthlyPayment}`);
    } else {
      console.warn(`⚠️ buy未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  return { deviceLeaseMonthly, deviceBuyMonthly };
}
