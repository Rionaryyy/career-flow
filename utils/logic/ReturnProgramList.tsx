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
  // 金額フォーマッタ（円）
  const jpy = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  });

  // 各プログラムの比較結果を取得
  const leaseResults = compareReturnPrograms(model, storage, devicePricesLease);
  const buyResults = compareBuyPrograms(model, storage, devicePricesBuy);

  return (
    // 背景は透明にして猫パターンを見せる。モバイルで横スクロール可能に。
    <div className="p-6 bg-transparent rounded-xl space-y-10">
      {/* === 🔁 返却プログラム === */}
      <div>
        <h2 className="text-lg font-semibold text-sky-800 mb-3">
          🔁 返却プログラム比較（{model} / {storage}）
        </h2>

        {leaseResults.length === 0 ? (
          <p className="text-gray-500">該当する返却プログラムは見つかりませんでした。</p>
        ) : (
          <div className="overflow-x-auto rounded-xl ring-1 ring-sky-100">
            <table className="min-w-full text-sm">
              <thead className="text-gray-600 bg-white/60">
                <tr>
                  <th className="py-2 px-3 text-left">キャリア</th>
                  <th className="py-2 px-3 text-left">プログラム名</th>
                  <th className="py-2 px-3 text-right">月額負担</th>
                  <th className="py-2 px-3 text-right">総支出（返却時）</th>
                  <th className="py-2 px-3 text-left">備考</th>
                </tr>
              </thead>
              <tbody className="bg-white/70 backdrop-blur-sm">
                {leaseResults.map((r, i) => (
                  <tr key={i} className="border-t border-gray-200 hover:bg-sky-50">
                    <td className="py-2 px-3 font-medium text-gray-800">{r.carrier}</td>
                    <td className="py-2 px-3">{r.programName}</td>
                    <td className="py-2 px-3 text-right text-sky-700 font-semibold">
                      {jpy.format(r.monthlyCost)}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-800">
                      {jpy.format(r.totalPaid)}
                    </td>
                    <td className="py-2 px-3 text-gray-600">{r.remarks ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* === 💰 端末購入プログラム === */}
      <div>
        <h2 className="text-lg font-semibold text-amber-800 mb-3">
          💰 端末購入プログラム比較（{model} / {storage}）
        </h2>

        {buyResults.length === 0 ? (
          <p className="text-gray-500">該当する購入プログラムは見つかりませんでした。</p>
        ) : (
          <div className="overflow-x-auto rounded-xl ring-1 ring-amber-100">
            <table className="min-w-full text-sm">
              <thead className="text-gray-600 bg-white/60">
                <tr>
                  <th className="py-2 px-3 text-left">キャリア</th>
                  <th className="py-2 px-3 text-left">プログラム名</th>
                  <th className="py-2 px-3 text-right">月額支払額</th>
                  <th className="py-2 px-3 text-right">総支出（所有時）</th>
                  <th className="py-2 px-3 text-left">支払い方法</th>
                </tr>
              </thead>
              <tbody className="bg-white/70 backdrop-blur-sm">
                {buyResults.map((r, i) => (
                  <tr key={i} className="border-t border-gray-200 hover:bg-amber-50">
                    <td className="py-2 px-3 font-medium text-gray-800">{r.carrier}</td>
                    <td className="py-2 px-3">{r.programName}</td>
                    <td className="py-2 px-3 text-right text-amber-700 font-semibold">
                      {jpy.format(r.monthlyCost)}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-800">
                      {jpy.format(r.totalPaid)}
                    </td>
                    <td className="py-2 px-3 text-gray-600">{r.paymentType ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
