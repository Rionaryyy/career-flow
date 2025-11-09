// app/data/allPlans.ts
import { Plan } from "@/types/planTypes";
import rawPlans from "@/data/plans.json";
import { devicePricesLease } from "@/data/devicePricesLease";
import { devicePricesBuy } from "@/data/devicePricesBuy";

export const allPlans: Plan[] = (rawPlans as unknown as any[]).map((rawPlan) => {
  // === 🧩 通話オプション整形（"\"5min\"" → "5min" に変換） ===
  const callOptions: { id: string; fee: number; type: string }[] = [];
  const possibleIds = [
    "5min",
    "10min",
    "15min",
    "30min",
    "monthly30min",
    "monthly60min",
    "monthly100min",
    "unlimited",
  ];

  // 🟩 typeマッピングを定義
  const callOptionTypes: Record<string, string> = {
    "5min": "time",
    "10min": "time",
    "15min": "time",
    "30min": "time",
    "monthly30min": "monthly",
    "monthly60min": "monthly",
    "monthly100min": "monthly",
    "unlimited": "unlimited",
  };

  for (const id of possibleIds) {
    const fee =
      rawPlan[id] ??
      rawPlan[`"${id}"`] ?? // ← JSON文字列化されているキーも拾う
      null;

    if (typeof fee === "number" && fee > 0) {
      callOptions.push({
        id,
        fee,
        type: callOptionTypes[id] ?? "unknown", // 🟩 typeを復元
      });
    }
  }

  // === 📱 端末価格プログラム統合 ===
  const leaseDevice = devicePricesLease.find(
    (d) =>
      d.carrier === rawPlan.carrier &&
      d.model === "iPhone 17 Pro" &&
      d.storage === "512GB"
  );

  const buyDevice = devicePricesBuy.find(
    (d) =>
      d.carrier === rawPlan.carrier &&
      d.model === "iPhone 17 Pro" &&
      d.storage === "512GB"
  );

  let deviceProgram = null;
  if (leaseDevice) {
    deviceProgram = {
      model: leaseDevice.model,
      storage: leaseDevice.storage,
      programName: leaseDevice.programName,
      monthlyPayment: leaseDevice.monthlyPayment,
      paymentMonths: leaseDevice.paymentMonths,
      returnOption: leaseDevice.returnOption,
      ownershipType: leaseDevice.ownershipType,
    };
  } else if (buyDevice) {
    deviceProgram = {
      model: buyDevice.model,
      storage: buyDevice.storage,
      programName: buyDevice.programName,
      monthlyPayment: buyDevice.monthlyPayment,
      paymentMonths: buyDevice.paymentMonths,
      returnOption: buyDevice.returnOption,
      ownershipType: buyDevice.ownershipType,
    };
  }

  return {
    ...rawPlan,
    callOptions, // 🟩 修正版: type付きで再構築
    deviceProgram,
    supportsReturnProgram: !!leaseDevice,
  } as Plan;
});
