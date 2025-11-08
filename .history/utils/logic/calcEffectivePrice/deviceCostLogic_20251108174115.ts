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

  const deviceMethodsRaw = Array.isArray(answers.devicePurchaseMethods)
    ? answers.devicePurchaseMethods.join("、")
    : answers.devicePurchaseMethods ?? "";

  const buyingText = answers.buyingDevice ?? deviceMethodsRaw ?? "";

  const selectedModel = normalize(answers.deviceModel ?? "");
  const selectedStorage = normalize(answers.deviceStorage ?? "");
  const carrier = plan.carrier?.toLowerCase() ?? "";

  // === 返却プログラム ===
  if (
    typeof buyingText === "string" &&
    (/(返却|カエドキ|トクする|スマホトク|プログラム)/.test(buyingText) ||
      buyingText.includes("lease_return"))
  ) {
    const match =
      devicePricesLease.find(
        (d) =>
          d.ownershipType === "lease" &&
          normalize(d.model).includes(selectedModel) &&
          normalize(d.storage).includes(selectedStorage) &&
          // キャリア一致 or モデル一致で許可
          (!carrier || d.carrier.toLowerCase() === carrier)
      ) ??
      // キャリア一致しなかった場合、最初にヒットしたモデルを拾う
      devicePricesLease.find(
        (d) =>
          d.ownershipType === "lease" &&
          normalize(d.model).includes(selectedModel) &&
          normalize(d.storage).includes(selectedStorage)
      );

    if (match) {
      deviceLeaseMonthly = match.monthlyPayment;
      console.log(`📱 ${plan.carrier}: 返却型 (${match.model} ${match.storage}) → ¥${match.monthlyPayment}`);
    } else {
      console.warn(`⚠️ lease未マッチ: ${selectedModel} ${selectedStorage}`);
    }
  }

  // === 購入プログラム ===
  else if (
    typeof buyingText === "string" &&
    (/(購入|分割|一括)/.test(buyingText) ||
      buyingText.includes("carrier_purchase") ||
      buyingText.includes("official_store"))
  ) {
    const isCarrierPurchase =
      /(キャリア|au|docomo|ドコモ|ソフトバンク|softbank|rakuten|楽天)/i.test(buyingText) ||
      buyingText.includes("carrier_purchase");
    const isOfficialStorePurchase =
      /(正規|Apple|家電量販店)/i.test(buyingText) || buyingText.includes("official_store");

    if (isOfficialStorePurchase) {
      deviceBuyMonthly = 0;
    } else {
      const matchBuy =
        devicePricesBuy.find((d) => {
          const modelMatch =
            normalize(d.model).includes(selectedModel) || selectedModel.includes(normalize(d.model));
          const storageMatch =
            normalize(d.storage).includes(selectedStorage) || selectedStorage.includes(normalize(d.storage));
          return (
            d.ownershipType === "buy" &&
            modelMatch &&
            storageMatch &&
            (!isCarrierPurchase || d.carrier.toLowerCase() === carrier)
          );
        }) ??
        devicePricesBuy.find(
          (d) =>
            d.ownershipType === "buy" &&
            normalize(d.model).includes(selectedModel) &&
            normalize(d.storage).includes(selectedStorage)
        );

      if (matchBuy) {
        deviceBuyMonthly = matchBuy.monthlyPayment;
        console.log(`💰 ${plan.carrier}: 購入 (${matchBuy.model} ${matchBuy.storage}) → ¥${matchBuy.monthlyPayment}`);
      } else {
        console.warn(`⚠️ buy未マッチ: ${selectedModel} ${selectedStorage}`);
      }
    }
  }

  return { deviceLeaseMonthly, deviceBuyMonthly };
}
