// app/data/allPlans.ts
import { Plan } from "@/types/planTypes";
import rawPlans from "@/data/plans.json";
import { devicePricesLease } from "@/data/devicePricesLease";
import { devicePricesBuy } from "@/data/devicePricesBuy";

export const allPlans: Plan[] = (rawPlans as unknown as Plan[]).map((plan) => {
  const leaseDevice = devicePricesLease.find(
    (d) =>
      d.carrier === plan.carrier &&
      d.model === "iPhone 17 Pro" &&
      d.storage === "512GB"
  );

  const buyDevice = devicePricesBuy.find(
    (d) =>
      d.carrier === plan.carrier &&
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
    ...plan,
    deviceProgram,
    supportsReturnProgram: !!leaseDevice,
  };
});
