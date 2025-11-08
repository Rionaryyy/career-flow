"use client";

import { DiagnosisAnswers } from "@/types/types";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

export default function DiscountBlock({ plan }: Props) {
  const b = plan.breakdown ?? {};

  const format = (v: number | undefined | null) =>
    v != null && !isNaN(v) ? v.toLocaleString() : "0";

  return (
    <div className="mt-4 text-sm text-gray-700 space-y-0.5">
      {/* === 基本料金 & 通話オプション === */}
      <p>・基本料金: ¥{format(b.baseFee)}</p>
      <p>・通話オプション: +¥{format(b.callOptionFee)}</p>

      {/* === 割引系 === */}
      {b.familyDiscount > 0 && (
        <p>・家族割引: -¥{format(b.familyDiscount)}</p>
      )}
      {b.studentDiscount > 0 && (
        <p>・学割: -¥{format(b.studentDiscount)}</p>
      )}
      {b.ageDiscount > 0 && <p>・年齢割: -¥{format(b.ageDiscount)}</p>}

      {/* === セット割 === */}
      {b.fiberDiscount > 0 && (
        <>
          <p>・光回線セット割: -¥{format(b.fiberDiscount)}</p>
          {b.fiberBaseFee > 0 && (
            <p className="ml-3 text-gray-500">
              ↳ 光回線参考月額: ¥{format(b.fiberBaseFee)}/月
            </p>
          )}
        </>
      )}

      {b.routerDiscount > 0 && (
        <>
          <p>・ルーターセット割: -¥{format(b.routerDiscount)}</p>
          {b.routerBaseFee > 0 && (
            <p className="ml-3 text-gray-500">
              ↳ ルーター参考月額: ¥{format(b.routerBaseFee)}/月
            </p>
          )}
        </>
      )}

      {b.pocketWifiDiscount > 0 && (
        <>
          <p>・ポケットWi-Fiセット割: -¥{format(b.pocketWifiDiscount)}</p>
          {b.pocketWifiBaseFee > 0 && (
            <p className="ml-3 text-gray-500">
              ↳ ポケットWi-Fi参考月額: ¥{format(b.pocketWifiBaseFee)}/月
            </p>
          )}
        </>
      )}

      {b.electricDiscount > 0 && (
        <p>・電気セット割: -¥{format(b.electricDiscount)}</p>
      )}
      {b.gasDiscount > 0 && (
        <p>・ガスセット割: -¥{format(b.gasDiscount)}</p>
      )}

      {/* === その他オプション === */}
      {b.tetheringFee > 0 && (
        <p>・テザリング料: +¥{format(b.tetheringFee)}</p>
      )}
    </div>
  );
}
