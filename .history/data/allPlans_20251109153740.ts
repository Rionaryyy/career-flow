// app/data/allPlans.ts
import { Plan } from "@/types/planTypes";
import rawPlans from "@/data/plans.json";
import { devicePricesLease } from "@/data/devicePricesLease";
import { devicePricesBuy } from "@/data/devicePricesBuy";

export const allPlans: Plan[] = (rawPlans as unknown as any[]).map((rawPlan) => {
  const callOptions: { id: string; fee: number; type: string }[] = [];
  const possibleIds = [
    "5min",
    "10min",
    "15min",
    "30min",
    "monthly30min",
    "monthly60min",
    "monthly70min", // ← 追加！
    "monthly100min",
    "unlimited",
  ];

  const callOptionTypes: Record<string, string> = {
    "5min": "time",
    "10min": "time",
    "15min": "time",
    "30min": "time",
    "monthly30min": "monthly",
    "monthly60min": "monthly",
    "monthly70min": "monthly", // ← 追加！
    "monthly100min": "monthly",
    "unlimited": "unlimited",
  };

  for (const id of possibleIds) {
    // 💡 数値変換を明示して文字列 "660" も許可
    const rawFee =
      rawPlan[id] ?? rawPlan[`"${id}"`] ?? null;
    const fee = Number(rawFee);

    if (!isNaN(fee) && fee > 0) {
      callOptions.push({
        id,
        fee,
        type: callOptionTypes[id] ?? "unknown",
      });
    }
  }

  // === 端末情報統合（省略） ===
  const leaseDevice = devicePricesLease.find(
    (d) => d.carrier === rawPlan.carrier && d.model === "iPhone 17 Pro" && d.storage === "512GB"
  );

  const buyDevice = devicePricesBuy.find(
    (d) => d.carrier === rawPlan.carrier && d.model === "iPhone 17 Pro" && d.storage === "512GB"
  );

  const deviceProgram = leaseDevice || buyDevice
    ? {
        model: (leaseDevice || buyDevice)!.model,
        storage: (leaseDevice || buyDevice)!.storage,
        programName: (leaseDevice || buyDevice)!.programName,
        monthlyPayment: (leaseDevice || buyDevice)!.monthlyPayment,
        paymentMonths: (leaseDevice || buyDevice)!.paymentMonths,
        returnOption: (leaseDevice || buyDevice)!.returnOption,
        ownershipType: (leaseDevice || buyDevice)!.ownershipType,
      }
    : null;

  return {
    ...rawPlan,
    callOptions,
    deviceProgram,
    supportsReturnProgram: !!leaseDevice,
  } as Plan;
});
