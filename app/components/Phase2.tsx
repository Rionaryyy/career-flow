// app/components/Phase2.tsx
"use client";

import React from "react";
import { DiagnosisAnswers, Phase2Answers } from "@/types/types";

type Phase2Props = {
  answers: DiagnosisAnswers["phase2"];
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers["phase2"]>>;
  onNext: () => void;
  onBack?: () => void;
};

export default function Phase2({ answers, setAnswers, onNext, onBack }: Phase2Props) {
  // helper for single selection
  const setField = (key: keyof Phase2Answers, value: string | string[] | null) => {
    setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));
  };

  // helper for toggling in string[] fields
  const toggleArrayField = (key: keyof Phase2Answers, value: string) => {
    setAnswers((prev) => {
      const arr = (prev[key] as string[] | null) ?? [];
      const already = arr.includes(value);
      const next = already ? arr.filter((a) => a !== value) : [...arr, value];
      return { ...prev, [key]: next } as Phase2Answers;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-bold text-center text-white mb-4">📍 フェーズ②：利用シーン詳細</h2>

      {/* 進捗表示 */}
      <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }} />
      </div>

      {/* ① データ通信ニーズ */}
      <section className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-xl font-semibold mb-3 text-white">① データ通信ニーズ</p>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q1. 月のデータ使用量はどのくらいですか？</p>
          {["〜5GB（ライトユーザー）", "10〜20GB（標準）", "20GB以上（ヘビーユーザー）", "無制限が必要"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("dataUsage", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.dataUsage === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q2. 速度制限後の通信速度も重視しますか？</p>
          {["はい（制限後も快適な速度がほしい）", "いいえ（速度低下は気にしない）"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("speedLimitImportance", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.speedLimitImportance === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q3. テザリング機能は必要ですか？</p>
          {["はい", "いいえ"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("tetheringNeeded", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.tetheringNeeded === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {answers.tetheringNeeded === "はい" && (
          <div className="mb-4">
            <p className="text-md text-gray-200 mb-2">Q3-2. 必要な場合、月あたりどのくらいのデータ量を使いそうですか？</p>
            {["〜5GB（ライトユーザー）", "10〜20GB（標準）", "20GB以上（ヘビーユーザー）", "無制限が必要"].map((opt) => (
              <button
                key={opt}
                onClick={() => setField("tetheringUsage", opt)}
                className={`w-full py-3 rounded-lg mb-2 text-left ${
                  answers.tetheringUsage === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ② 通話 */}
      <section className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-xl font-semibold mb-3 text-white">② 通話に関する質問（精度重視・5パターン対応）</p>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q1. ふだんの通話頻度に近いものを選んでください</p>
          {[
            "ほとんど通話しない（LINEなどが中心）",
            "月に数回だけ短い通話をする（1〜5分程度）",
            "毎週何度か短い通話をする（5分以内が多い）",
            "月に数回〜十数回、10〜20分程度の通話をする",
            "毎日のように長時間の通話をする（20分以上・仕事など）",
          ].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("callFrequency", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.callFrequency === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q2. 通話料の優先事項として一番近いものを選んでください</p>
          {[
            "1回あたりの通話が短いので「短時間かけ放題（5分/10分）」が合っていそう",
            "月の合計時間で考えたい（例：30分まで無料など）",
            "通話時間・回数を気にせず「完全かけ放題」が良い",
            "専用アプリ（Rakuten Linkなど）でもOKなら安くしたい",
            "家族・特定の人との通話がほとんど",
          ].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("callPriority", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.callPriority === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q3. 留守番電話や着信転送などのオプションは必要ですか？</p>
          {["はい、必要", "いいえ、不要"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("callOptionsNeeded", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.callOptionsNeeded === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q4. 通話の目的に近いものを選んでください</p>
          {["家族や友人との連絡が中心", "仕事・ビジネス用途で利用することが多い", "どちらも同じくらい使う"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("callPurpose", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.callPurpose === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      {/* ③ 契約条件・割引系 */}
      <section className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-xl font-semibold mb-3 text-white">③ 契約条件・割引系（確定版）</p>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q5. 家族割引を適用できる回線数はどのくらいですか？</p>
          {["1回線", "2回線", "3回線以上", "利用できない / わからない"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("familyLines", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.familyLines === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q6. 光回線とのセット割を適用できますか？</p>
          {["はい（対象の光回線を契約予定・契約中）", "いいえ / わからない"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("setDiscount", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.setDiscount === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q7. 電気やガスなどのインフラサービスとのセット割を適用できますか？</p>
          {["はい（対象サービスを契約予定・契約中）", "いいえ / わからない"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("infraSet", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.infraSet === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      {/* ④ 経済圏 */}
      <section className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-xl font-semibold mb-3 text-white">④ 経済圏・ポイント利用状況（確定版）</p>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q8. 現在よく利用している、または今後メインで使う可能性が高いポイント経済圏はどれですか？</p>
          {["楽天経済圏（楽天カード・楽天市場など）", "dポイント（ドコモ・dカードなど）", "PayPay / ソフトバンク経済圏", "au PAY / Ponta経済圏", "特になし"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("ecosystem", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.ecosystem === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {answers.ecosystem && answers.ecosystem !== "特になし" && (
          <div className="mb-4">
            <p className="text-md text-gray-200 mb-2">Q8-2. その経済圏での月間利用額はどのくらいですか？</p>
            {["〜5,000円", "5,000〜10,000円", "10,000〜30,000円", "30,000円以上"].map((opt) => (
              <button
                key={opt}
                onClick={() => setField("ecosystemMonthly", opt)}
                className={`w-full py-3 rounded-lg mb-2 text-left ${
                  answers.ecosystemMonthly === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ⑤ サブスク */}
      <section className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-xl font-semibold mb-3 text-white">⑤ サブスク利用状況（独立）</p>
        <p className="text-sm text-gray-300 mb-3">Q9. 現在契約している、または今後契約予定のサブスクリプションサービスを選んでください（複数選択可）</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Netflix",
            "Amazon Prime",
            "YouTube Premium",
            "Apple Music",
            "Disney+",
            "LINE MUSIC",
            "DAZN",
            "DMM TV / DMMプレミアム",
            "Spotify",
            "ABEMA プレミアム",
            "U-NEXT",
            "TELASA（テラサ）",
            "特になし",
          ].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                if (opt === "特になし") {
                  setField("subs", ["特になし"]);
                } else {
                  toggleArrayField("subs", opt);
                }
              }}
              className={`py-2 rounded-lg text-left ${
                (answers.subs ?? []).includes(opt) ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <p className="text-md text-gray-200 mb-2">Q9-2. 契約している（予定の）サブスクはキャリアセットでの割引を希望しますか？</p>
          {["はい（割引対象のキャリア・プランがあれば優先したい）", "いいえ（サブスクは別で契約する予定）"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("subsDiscountPreference", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.subsDiscountPreference === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      {/* ⑥ 端末・購入形態 */}
      <section className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-xl font-semibold mb-3 text-white">⑥ 端末・購入形態</p>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q9. 新しい端末も一緒に購入する予定ですか？</p>
          {["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("buyingDevice", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.buyingDevice === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {answers.buyingDevice && answers.buyingDevice.startsWith("はい") && (
          <div className="mb-4">
            <p className="text-md text-gray-200 mb-2">Q9-2. 端末の購入方法として、近い考え方を選んでください（複数選択可）</p>
            {[
              "Appleなど正規ストア・家電量販店で本体のみ購入したい",
              "キャリアで端末を購入したい（通常購入）",
              "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
              "どれが最もお得か分からないので、すべてのパターンを比較したい",
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => toggleArrayField("devicePurchaseMethods", opt)}
                className={`w-full py-3 rounded-lg mb-2 text-left ${
                  (answers.devicePurchaseMethods ?? []).includes(opt) ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ⑦ 海外利用等 */}
      <section className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-xl font-semibold mb-3 text-white">⑦ 海外利用・特殊ニーズ（網羅版）</p>

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q12. 海外でスマホを利用する予定はありますか？</p>
          {["はい（短期旅行・年数回レベル）", "はい（長期滞在・留学・海外出張など）", "いいえ（国内利用のみ）"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("overseasUse", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.overseasUse === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {answers.overseasUse && answers.overseasUse !== "いいえ（国内利用のみ）" && (
          <div className="mb-4">
            <p className="text-md text-gray-200 mb-2">Q12-2. 海外利用時の希望に近いものを選んでください</p>
            {[
              "海外でも日本と同じように通信したい（ローミング含め使い放題が希望）",
              "現地でSNSや地図だけ使えればOK（低速・少量でも可）",
              "必要に応じて現地SIMを使うので、特に希望はない",
            ].map((opt) => (
              <button
                key={opt}
                onClick={() => setField("overseasPreference", opt)}
                className={`w-full py-3 rounded-lg mb-2 text-left ${
                  answers.overseasPreference === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="mb-4">
          <p className="text-md text-gray-200 mb-2">Q13. デュアルSIM（2回線利用）を検討していますか？</p>
          {["はい（メイン＋サブで使い分けたい）", "はい（海外用と国内用で使い分けたい）", "いいえ（1回線のみの予定）"].map((opt) => (
            <button
              key={opt}
              onClick={() => setField("dualSim", opt)}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                answers.dualSim === opt ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div>
          <p className="text-md text-gray-200 mb-2">Q14. 特殊な利用目的がありますか？（複数選択可）</p>
          {[
            "副回線として安価なプランを探している（メインとは別）",
            "法人契約または業務用利用を検討している",
            "子ども・高齢者向けなど家族のサブ回線用途",
            "IoT機器・見守り用など特殊用途",
            "特になし",
          ].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                if (opt === "特になし") setField("specialUses", ["特になし"]);
                else toggleArrayField("specialUses", opt);
              }}
              className={`w-full py-3 rounded-lg mb-2 text-left ${
                (answers.specialUses ?? []).includes(opt) ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      {/* ⑧ 支払い方法 */}
      <section className="rounded-xl p-5 bg-gradient-to-br from-slate-800/90 to-slate-700/80 shadow-lg">
        <p className="text-xl font-semibold mb-3 text-white">⑧ 通信料金の支払い方法</p>
        <p className="text-sm text-gray-300 mb-3">Q15. 通信料金の支払いに利用予定の方法を選んでください（複数選択可）</p>
        <div className="grid grid-cols-2 gap-2">
          {["クレジットカード（楽天カード / dカード / au PAY カード / PayPayカード など）", "デビットカード", "銀行口座引き落とし", "プリペイドカード / チャージ式決済", "その他 / 特になし"].map((opt) => (
            <button
              key={opt}
              onClick={() => toggleArrayField("paymentMethods", opt)}
              className={`py-2 rounded-lg text-left ${
                (answers.paymentMethods ?? []).includes(opt) ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <div className="flex justify-between items-center pt-6">
        <div>{onBack && <button onClick={onBack} className="px-4 py-2 rounded-full bg-slate-600 hover:bg-slate-500">戻る</button>}</div>
        <div>
          <button onClick={onNext} className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-semibold shadow-lg">
            診断結果へ
          </button>
        </div>
      </div>
    </div>
  );
}
