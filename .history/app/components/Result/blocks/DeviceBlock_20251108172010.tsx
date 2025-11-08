"use client";

import { DiagnosisAnswers } from "@/types/types";

interface Props {
  plan: any;
  answers: DiagnosisAnswers;
}

export default function DeviceBlock({ plan, answers }: Props) {
  // breakdownがnullまたはundefinedの場合に備えて、デフォルト値を与える
  const b = plan.breakdown ?? {};

  // `answers.buyingDevice` の確認を強化
  const deviceType =
    answers.buyingDevice?.includes("返却")
      ? "返却プログラム"
      : answers.buyingDevice?.includes("キャリア")
      ? "キャリア端末購入（所有）"
      : answers.buyingDevice?.includes("正規店")
      ? "正規店購入（返却なし）"
      : "端末購入"; // `answers.buyingDevice`が空または未定義の場合に「端末購入」をデフォルトに

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

      {/* 端末情報と購入方法の表示 */}
      {(answers.deviceModel || answers.deviceStorage) && (
        <div className="mt-2 text-xs text-gray-600 border-t border-dashed border-gray-300 pt-1">
          📱 {answers.deviceModel ?? plan.deviceProgram?.model}
          {answers.deviceStorage && `（${answers.deviceStorage}）`} / {deviceType}
          {plan.deviceProgram?.paymentMonths &&
            `（${plan.deviceProgram.paymentMonths}ヶ月${
              answers.buyingDevice?.includes("返却") ? "返却前提" : "分割払い"
            }）`}
        </div>
      )}
    </>
  );
}
