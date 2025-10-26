import { calcReturnProgramComparison } from "@/utils/logic/calcReturnProgramComparison";
import { devicePrices } from "@/data/devicePrices";

export default function ReturnProgramList({
  model,
  storage,
}: {
  model: string;
  storage: string;
}) {
  const results = calcReturnProgramComparison(model, storage); // ✅ 関数名を修正

  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <h2 className="text-lg font-semibold text-sky-800 mb-3">
        🔁 返却プログラム比較（{model} / {storage}）
      </h2>

      {results.length === 0 ? (
        <p className="text-gray-500">該当プログラムが見つかりませんでした。</p>
      ) : (
        <table className="w-full text-sm border-t border-gray-200">
          <thead className="text-gray-600">
            <tr>
              <th className="py-2 text-left">キャリア</th>
              <th className="py-2 text-left">プログラム</th>
              <th className="py-2 text-right">月額負担</th>
              <th className="py-2 text-right">総支出（返却時）</th>
              <th className="py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r: any, i: number) => (
              <tr key={i} className="border-t border-gray-200">
                <td className="py-2">{r.carrier}</td>
                <td className="py-2">{r.programName}</td>
                <td className="py-2 text-right">
                  ¥{r.monthlyCost.toLocaleString()}
                </td>
                <td className="py-2 text-right">
                  ¥{r.totalPaid?.toLocaleString?.() ?? "-"}
                </td>
                <td className="py-2 text-gray-600">{r.remarks ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
