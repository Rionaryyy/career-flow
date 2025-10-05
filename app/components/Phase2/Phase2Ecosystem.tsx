"use client";

import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  onChange: (updated: Partial<Phase2Answers>) => void;
}

export default function Phase2Ecosystem({ answers, onChange }: Props) {
  // -----------------------
  // 選択肢定義
  // -----------------------
  const shoppingOptions = [
    "楽天市場、楽天ブックス、楽天トラベルなど（楽天Pay/楽天経済圏）",
    "Yahoo!ショッピング、PayPayモールなど（PayPay / ソフトバンク経済圏）",
    "LOHACO、au PAY加盟店、au Wowma!など（au PAY / Ponta経済圏）",
    "どれが一番お得か分からないので、すべてのパターンを比較してほしい",
    "特になし",
  ];

  const paymentOptions = [
    "楽天Pay / 楽天カード（楽天経済圏）",
    "d払い / dカード（dポイント経済圏）",
    "PayPay / ペイペイカード（PayPay経済圏）",
    "au PAY / au PAYカード（Ponta経済圏）",
    "どれが一番お得か分からないので、すべてのパターンを比較してほしい",
    "特になし",
  ];

  const monthlyOptions = [
    "〜5,000円",
    "5,000〜10,000円",
    "10,000〜30,000円",
    "30,000〜50,000円",
    "50,000円以上",
    "まだわからない",
  ];

  // -----------------------
  // 汎用チェックボックス処理
  // -----------------------
  const handleToggle = (id: "shoppingList" | "paymentList", option: string) => {
    let updated: string[] = answers[id] || [];

    if (option === "特になし") {
      updated = ["特になし"];
    } else {
      updated = updated.filter((o) => o !== "特になし");

      if (updated.includes(option)) {
        updated = updated.filter((o) => o !== option);
      } else {
        updated.push(option);
      }
    }

    onChange({ [id]: updated });
  };

  return (
    <div className="w-full py-6 space-y-6">
      {/* Q8: ショッピング利用 */}
      <div>
        <p className="mb-2 font-semibold">Q8. ショッピング利用ベース（特定ショップでの還元）</p>
        {shoppingOptions.map((opt) => {
          const disabled =
            opt !== "特になし" && answers.shoppingList?.includes("特になし");
          const checked = answers.shoppingList?.includes(opt) || false;

          return (
            <label
              key={opt}
              className={`block cursor-pointer mb-1 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="checkbox"
                value={opt}
                disabled={disabled}
                checked={checked}
                onChange={() => handleToggle("shoppingList", opt)}
                className="mr-2"
              />
              {opt}
            </label>
          );
        })}

        {/* Q8-2: 月間利用額 */}
        {answers.shoppingList && !answers.shoppingList.includes("特になし") && (
          <div className="mt-2">
            <p className="mb-2 font-semibold">Q8-2. ショッピング利用額（月間想定）</p>
            {monthlyOptions.map((amt) => (
              <label key={amt} className="block cursor-pointer mb-1">
                <input
                  type="radio"
                  name="shoppingMonthly"
                  checked={answers.shoppingMonthly === amt}
                  onChange={() => onChange({ shoppingMonthly: amt })}
                  className="mr-2"
                />
                {amt}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Q9: 支払い方法利用 */}
      <div className="mt-6">
        <p className="mb-2 font-semibold">Q9. 支払い方法ベース（カードやキャリア払いでの還元）</p>
        {paymentOptions.map((opt) => {
          const disabled =
            opt !== "特になし" && answers.paymentList?.includes("特になし");
          const checked = answers.paymentList?.includes(opt) || false;

          return (
            <label
              key={opt}
              className={`block cursor-pointer mb-1 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="checkbox"
                value={opt}
                disabled={disabled}
                checked={checked}
                onChange={() => handleToggle("paymentList", opt)}
                className="mr-2"
              />
              {opt}
            </label>
          );
        })}

        {/* Q9-2: 月間利用額 */}
        {answers.paymentList && !answers.paymentList.includes("特になし") && (
          <div className="mt-2">
            <p className="mb-2 font-semibold">Q9-2. 支払い方法利用額（月間想定）</p>
            {monthlyOptions.map((amt) => (
              <label key={amt} className="block cursor-pointer mb-1">
                <input
                  type="radio"
                  name="paymentMonthly"
                  checked={answers.paymentMonthly === amt}
                  onChange={() => onChange({ paymentMonthly: amt })}
                  className="mr-2"
                />
                {amt}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
