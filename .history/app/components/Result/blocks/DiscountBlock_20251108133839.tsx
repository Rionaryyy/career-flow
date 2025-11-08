"use client";

import { DiagnosisAnswers } from "@/types/types";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

export default function DiscountBlock({ plan }: Props) {
  const b = plan.breakdown;

  return (
    <div className="mt-4 text-sm text-gray-700 space-y-0.5">
      {/* === 基本料金 & 通話オプション === */}
      <p>・基本料金: ¥{b.baseFee}</p>
      <p>・通話オプション: +¥{b.callOptionFee}</p>

      {/* === 割引系 === */}
      <p>・家族割引: -¥{b.familyDiscount}</p>
      <p>・学割: -¥{b.studentDiscount}</p>
      <p>・年齢割: -¥{b.ageDiscount}</p>

      {/* === セット割 === */}
      {b.fiberDiscount > 0 && <p>・光回線セット割: -¥{b.fiberDiscount}</p>}
      {b.routerDiscount > 0 && <p>・ルーターセット割: -¥{b.routerDiscount}</p>}
      {b.pocketWifiDiscount > 0 && <p>・ポケットWi-Fiセット割: -¥{b.pocketWifiDiscount}</p>}
      {b.electricDiscount > 0 && <p>・電気セット割: -¥{b.electricDiscount}</p>}
      {b.gasDiscount > 0 && <p>・ガスセット割: -¥{b.gasDiscount}</p>}

      {/* === その他オプション === */}
      <p>・テザリング料: +¥{b.tetheringFee}</p>
    </div>
  );
}
