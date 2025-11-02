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

  const normalize = (text: string) =>
    text
      ?.replace(/\s+/g, "")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/ＧＢ/gi, "GB")
      .replace(/gb$/i, "gb")
      .toLowerCase()
      .trim() || "";

  const buyingText =
    answers.phase2?.buyingDevice ?? answers.phase2?.devicePurchaseMethods?.[0] ?? "";

  const selectedModel = normalize(answers.phase2?.deviceModel ?? "");
  const selectedStorage = normalize(answers.phase2?.deviceStorage ?? "");

  // === 返却プログラム ===
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
      console.log(`📱 ${plan.carrier}: 返却型 (${match.model} ${match.storage}) → ¥${match.monthlyPayment}`);
    }
  }
  // === 購入プログラム ===
  else if (typeof buyingText === "string" && /(購入|分割|一括)/.test(buyingText)) {
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
        return (
          d.ownershipType === "buy" &&
          (!isCarrierPurchase || d.carrier?.toLowerCase() === plan.carrier?.toLowerCase()) &&
          modelMatch &&
          storageMatch
        );
      });

      if (matchBuy) {
        deviceBuyMonthly = matchBuy.monthlyPayment;
        deviceLeaseMonthly = 0;
        console.log(`💰 ${plan.carrier}: 購入 (${matchBuy.model} ${matchBuy.storage}) → ¥${matchBuy.monthlyPayment}`);
      }
    }
  }

  return { deviceLeaseMonthly, deviceBuyMonthly };
}
