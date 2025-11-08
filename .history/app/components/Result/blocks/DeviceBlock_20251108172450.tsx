"use client";

import { DiagnosisAnswers } from "@/types/types";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

export default function DeviceBlock({ plan, answers }: Props) {
  const b = plan.breakdown ?? {}; // 安全策として確認

  // デバイスの購入方法を決定
  const deviceType =
    answers.buyingDevice?.includes("返却")
      ? "返却プログラム"
      : answers.buyingDevice?.includes("キャリア")
      ? "キャリア端末購入（所有）"
      : answers.buyingDevice?.includes("正規店")
      ? "正規店購入（返却なし）"
      : "端末購入";

  return (
    <>
      {/* 返却プログラム（月額端末費）の表示 */}
      {b.deviceLeaseMonthly && b.deviceLeaseMonthly > 0 ? (
        <div className="mt-1">
          <p className="font-medium text-indigo-700">
            ・返却プログラム（月額端末費）: ¥{b.deviceLeaseMonthly}
          </p>
          <p className="text-xs text-gray-500 ml-3">
            ↳ 総額（目安）: ¥{(b.deviceTotal ?? 0).toLocaleString()}
          </p>
        </div>
      ) : null}

      {/* 端末購入（月額端末費）の表示 */}
      {b.deviceBuyMonthly && b.deviceBuyMonthly > 0 ? (
        <div className="mt-1">
          <p className="font-medium text-sky-700">
            ・端末購入（月額端末費）: ¥{b.deviceBuyMonthly}
          </p>
          <p className="text-xs text-gray-500 ml-3">
            ↳ 総額（目安）: ¥{(b.deviceTotal ?? 0).toLocaleString()}
          </p>
        </div>
      ) : null}
    </>
  );
}
