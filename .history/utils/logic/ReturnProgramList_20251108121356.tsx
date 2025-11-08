"use client";

import { compareReturnPrograms } from "@/utils/logic/calcLeaseProgramComparison";
import { compareBuyPrograms } from "@/utils/logic/calcBuyProgramComparison";
import { devicePricesLease } from "@/data/devicePricesLease";
import { devicePricesBuy } from "@/data/devicePricesBuy";

export default function ReturnProgramList({
  model,
  storage,
}: {
  model: string;
  storage: string;
}) {
  const leaseResults = compareReturnPrograms(model, storage, devicePricesLease);
  const buyResults = compareBuyPrograms(model, storage, devicePricesBuy);

  const yen = new Intl.NumberFormat("ja-JP");

  return (
    <div className="p-6 bg-gray-50 rounded-2xl space-y-10 shadow-sm">
      {/* === 🔁 返却プログラム === */}
      <section>
        <h2 className="text-lg font-semibold text-sky-800 mb-3">
          🔁 返却プログラム比較（{model} / {storage}）
        </h2>

        {leaseResults.length === 0 ? (
          <p className="text-gray-500 text-sm">
            該当する返却プログラムは見つかりませんでした。
            <br />
            → この機種／容量ではリース（返却前提）方式を提供していない可能性があります。
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-sky-50 text-gray-600">
                <tr>
                  <th className="py-2 px-3 text-left">キャリア</th>
                  <th className="py-2 px-3 text-left">プログラム名</th>
                  <th className="py-2 px-3 text-right">月額負担</th>
                  <th className="py-2 px-3 text-right">総支出（返却時）</th>
                  <th className="py-2 px-3 text-left">備考</th>
                </tr>
              </thead>
              <tbody>
                {leaseResults.map((r, i) => (
                  <tr key={i} className="border-t border-gray-200 hover:bg-sky-50">
                    <td className="py-2 px-3 font-medium text-gray-800">{r.carrier}</td>
                    <td className="py-2 px-3">{r.programName}</td>
                    <td className="py-2 px-3 text-right text-sky-700 font-semibold">
                      ¥{yen.format(r.monthlyCost)}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-800">
                      ¥{yen.format(r.totalPaid)}
                    </td>
                    <td className="py-2 px-3 text-gray-600">{r.remarks ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* === 💰 端末購入プログラム === */}
      <section>
        <h2 className="text-lg font-semibold text-amber-800 mb-3">
          💰 端末購入プログラム比較（{model} / {storage}）
        </h2>

        {buyResults.length === 0 ? (
          <p className="text-gray-500 text-sm">
            該当する購入プログラムは見つかりませんでした。
            <br />
            → 一括または分割購入の設定データが存在しない可能性があります。
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-amber-50 text-gray-600">
                <tr>
                  <th className="py-2 px-3 text-left">キャリア</th>
                  <th className="py-2 px-3 text-left">プログラム名</th>
                  <th className="py-2 px-3 text-right">月額支払額</th>
                  <th className="py-2 px-3 text-right">総支出（所有時）</th>
                  <th className="py-2 px-3 text-left">支払い方法</th>
                </tr>
              </thead>
              <tbody>
                {buyResults.map((r, i) => (
                  <tr key={i} className="border-t border-gray-200 hover:bg-amber-50">
                    <td className="py-2 px-3 font-medium text-gray-800">{r.carrier}</td>
                    <td className="py-2 px-3">{r.programName}</td>
                    <td className="py-2 px-3 text-right text-amber-700 font-semibold">
                      ¥{yen.format(r.monthlyCost)}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-800">
                      ¥{yen.format(r.totalPaid)}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {r.paymentType === "installment"
                        ? "分割払い"
                        : r.paymentType === "one_time"
                        ? "一括購入"
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
