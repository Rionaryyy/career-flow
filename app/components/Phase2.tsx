// app/components/Phase2.tsx
"use client";

import React, { useState } from "react";
import { DiagnosisAnswers, Phase2Answers } from "@/types/types";

type Phase2Props = {
  answers: DiagnosisAnswers["phase2"];
  setAnswers: React.Dispatch<React.SetStateAction<DiagnosisAnswers["phase2"]>>;
  onNext: () => void;
  onBack?: () => void;
};

export default function Phase2({ answers, setAnswers, onNext, onBack }: Phase2Props) {
  const [step, setStep] = useState(0);

  const setField = (key: keyof Phase2Answers, value: string | string[] | null) => {
    setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));
  };

  const toggleArrayField = (key: keyof Phase2Answers, value: string) => {
    setAnswers((prev) => {
      const arr = (prev[key] as string[] | null) ?? [];
      const already = arr.includes(value);
      const next = already ? arr.filter((a) => a !== value) : [...arr, value];
      return { ...prev, [key]: next } as Phase2Answers;
    });
  };

  // 全質問をステップごとに管理
  const questions = [
    {
      key: "dataUsage",
      title: "📶 データ通信ニーズ",
      text: "Q1. 月のデータ使用量はどのくらいですか？",
      options: ["〜5GB（ライトユーザー）", "10〜20GB（標準）", "20GB以上（ヘビーユーザー）", "無制限が必要"],
    },
    {
      key: "speedLimitImportance",
      title: "📶 データ通信ニーズ",
      text: "Q2. 速度制限後の通信速度も重視しますか？",
      options: ["はい（制限後も快適な速度がほしい）", "いいえ（速度低下は気にしない）"],
    },
    {
      key: "tetheringNeeded",
      title: "📶 データ通信ニーズ",
      text: "Q3. テザリング機能は必要ですか？",
      options: ["はい", "いいえ"],
    },
    {
      key: "tetheringUsage",
      condition: answers.tetheringNeeded === "はい",
      title: "📶 データ通信ニーズ",
      text: "Q3-2. 必要な場合、月あたりどのくらいのデータ量を使いそうですか？",
      options: ["〜5GB（ライトユーザー）", "10〜20GB（標準）", "20GB以上（ヘビーユーザー）", "無制限が必要"],
    },
    {
      key: "callFrequency",
      title: "📞 通話",
      text: "Q1. ふだんの通話頻度に近いものを選んでください",
      options: [
        "ほとんど通話しない（LINEなどが中心）",
        "月に数回だけ短い通話をする（1〜5分程度）",
        "毎週何度か短い通話をする（5分以内が多い）",
        "月に数回〜十数回、10〜20分程度の通話をする",
        "毎日のように長時間の通話をする（20分以上・仕事など）",
      ],
    },
    {
      key: "callPriority",
      title: "📞 通話",
      text: "Q2. 通話料の優先事項として一番近いものを選んでください",
      options: [
        "1回あたりの通話が短いので「短時間かけ放題（5分/10分）」が合っていそう",
        "月の合計時間で考えたい（例：30分まで無料など）",
        "通話時間・回数を気にせず「完全かけ放題」が良い",
        "専用アプリ（Rakuten Linkなど）でもOKなら安くしたい",
        "家族・特定の人との通話がほとんど",
      ],
    },
    {
      key: "callOptionsNeeded",
      title: "📞 通話",
      text: "Q3. 留守番電話や着信転送などのオプションは必要ですか？",
      options: ["はい、必要", "いいえ、不要"],
    },
    {
      key: "callPurpose",
      title: "📞 通話",
      text: "Q4. 通話の目的に近いものを選んでください",
      options: ["家族や友人との連絡が中心", "仕事・ビジネス用途で利用することが多い", "どちらも同じくらい使う"],
    },
    {
      key: "familyLines",
      title: "👨‍👩‍👧‍👦 契約条件",
      text: "Q5. 家族割引を適用できる回線数はどのくらいですか？",
      options: ["1回線", "2回線", "3回線以上", "利用できない / わからない"],
    },
    {
      key: "setDiscount",
      title: "👨‍👩‍👧‍👦 契約条件",
      text: "Q6. 光回線とのセット割を適用できますか？",
      options: ["はい（対象の光回線を契約予定・契約中）", "いいえ / わからない"],
    },
    {
      key: "infraSet",
      title: "👨‍👩‍👧‍👦 契約条件",
      text: "Q7. 電気やガスなどのインフラサービスとのセット割を適用できますか？",
      options: ["はい（対象サービスを契約予定・契約中）", "いいえ / わからない"],
    },
    {
      key: "ecosystem",
      title: "🏦 経済圏",
      text: "Q8. 現在よく利用している、または今後メインで使う可能性が高いポイント経済圏はどれですか？",
      options: [
        "楽天経済圏（楽天カード・楽天市場など）",
        "dポイント（ドコモ・dカードなど）",
        "PayPay / ソフトバンク経済圏",
        "au PAY / Ponta経済圏",
        "特になし",
      ],
    },
    {
      key: "ecosystemMonthly",
      condition: answers.ecosystem && answers.ecosystem !== "特になし",
      title: "🏦 経済圏",
      text: "Q8-2. その経済圏での月間利用額はどのくらいですか？",
      options: ["〜5,000円", "5,000〜10,000円", "10,000〜30,000円", "30,000円以上"],
    },
    {
      key: "subs",
      type: "multi",
      title: "📺 サブスク",
      text: "Q9. 現在契約している、または今後契約予定のサブスクリプションサービスを選んでください（複数選択可）",
      options: [
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
      ],
    },
    {
      key: "subsDiscountPreference",
      title: "📺 サブスク",
      text: "Q9-2. 契約している（予定の）サブスクはキャリアセットでの割引を希望しますか？",
      options: ["はい（割引対象のキャリア・プランがあれば優先したい）", "いいえ（サブスクは別で契約する予定）"],
    },
    {
      key: "buyingDevice",
      title: "📱 端末購入",
      text: "Q10. 新しい端末も一緒に購入する予定ですか？",
      options: ["はい（端末も一緒に購入する）", "いいえ（SIMのみ契約する予定）"],
    },
    {
      key: "devicePurchaseMethods",
      condition: answers.buyingDevice?.startsWith("はい"),
      type: "multi",
      title: "📱 端末購入",
      text: "Q10-2. 端末の購入方法として、近い考え方を選んでください（複数選択可）",
      options: [
        "Appleなど正規ストア・家電量販店で本体のみ購入したい",
        "キャリアで端末を購入したい（通常購入）",
        "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
        "どれが最もお得か分からないので、すべてのパターンを比較したい",
      ],
    },
    {
      key: "overseasUse",
      title: "✈️ 海外利用",
      text: "Q12. 海外でスマホを利用する予定はありますか？",
      options: ["はい（短期旅行・年数回レベル）", "はい（長期滞在・留学・海外出張など）", "いいえ（国内利用のみ）"],
    },
    {
      key: "overseasPreference",
      condition: answers.overseasUse && answers.overseasUse !== "いいえ（国内利用のみ）",
      title: "✈️ 海外利用",
      text: "Q12-2. 海外利用時の希望に近いものを選んでください",
      options: [
        "海外でも日本と同じように通信したい（ローミング含め使い放題が希望）",
        "現地でSNSや地図だけ使えればOK（低速・少量でも可）",
        "必要に応じて現地SIMを使うので、特に希望はない",
      ],
    },
    {
      key: "dualSim",
      title: "📶 デュアルSIM",
      text: "Q13. デュアルSIM（2回線利用）を検討していますか？",
      options: ["はい（メイン＋サブで使い分けたい）", "はい（海外用と国内用で使い分けたい）", "いいえ（1回線のみの予定）"],
    },
    {
      key: "specialUses",
      type: "multi",
      title: "⚙️ 特殊利用",
      text: "Q14. 特殊な利用目的がありますか？（複数選択可）",
      options: [
        "副回線として安価なプランを探している（メインとは別）",
        "法人契約または業務用利用を検討している",
        "子ども・高齢者向けなど家族のサブ回線用途",
        "IoT機器・見守り用など特殊用途",
        "特になし",
      ],
    },
    {
      key: "paymentMethods",
      type: "multi",
      title: "💳 支払い方法",
      text: "Q15. 通信料金の支払いに利用予定の方法を選んでください（複数選択可）",
      options: [
        "クレジットカード（楽天カード / dカード / au PAY カード / PayPayカード など）",
        "デビットカード",
        "銀行口座引き落とし",
        "プリペイドカード / チャージ式決済",
        "その他 / 特になし",
      ],
    },
  ].filter((q) => q.condition === undefined || q.condition); // 条件付き質問を除外

  const current = questions[step];
  const total = questions.length;
  const isMulti = current.type === "multi";

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      <h2 className="text-2xl font-bold mb-2">{current.title}</h2>
      <p className="text-lg mb-6">{current.text}</p>

      <div className="space-y-3">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              if (isMulti) {
                if (opt === "特になし") setField(current.key as keyof Phase2Answers, ["特になし"]);
                else toggleArrayField(current.key as keyof Phase2Answers, opt);
              } else {
                setField(current.key as keyof Phase2Answers, opt);
              }
            }}
            className={`w-full py-3 px-4 rounded-lg text-left ${
              isMulti
                ? (answers[current.key as keyof Phase2Answers] as string[])?.includes(opt)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-gray-200"
                : answers[current.key as keyof Phase2Answers] === opt
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => (step === 0 && onBack ? onBack() : setStep((s) => Math.max(0, s - 1)))}
          className="px-4 py-2 bg-slate-600 rounded-full hover:bg-slate-500"
        >
          戻る
        </button>
        {step === total - 1 ? (
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-lg font-semibold shadow-lg"
          >
            診断結果へ
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-lg font-semibold shadow-lg"
          >
            次へ
          </button>
        )}
      </div>

      <p className="mt-4 text-center text-sm text-gray-400">
        {step + 1} / {total} 問
      </p>
    </div>
  );
}
