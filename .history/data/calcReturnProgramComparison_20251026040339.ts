// /utils/logic/calcReturnProgramComparison.ts
import { DevicePrice } from "@/data/devicePrices";

export interface ReturnProgramResult {
  carrier: string;
  programName: string;
  monthlyCost: number;
  totalPaid: number;
  remarks: string;
}

export function compareReturnPrograms(
  model: string,
  storage: string,
  devicePrices: DevicePrice[]
): ReturnProgramResult[] {
  const targets = devicePrices.filter(
    d =>
      d.model === model &&
      d.storage === storage &&
      d.returnOption === true &&
      d.ownershipType === "lease"
  );

  return targets.map(d => {
    const paidMonths = d.returnAfterMonths;
    const monthlyCost = Math.round(d.fullPrice / d.months);
    const totalPaid = monthlyCost * paidMonths;

    const remarks = `返却時に残債免除（${paidMonths}ヶ月利用）`;

    return {
      carrier: d.carrier,
      programName: d.programName,
      monthlyCost,
      totalPaid,
      remarks,
    };
  });
}
