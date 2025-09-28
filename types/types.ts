// DiagnosisFlow.tsx
"use client";

import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Result from "./Result";
import { DiagnosisAnswers, Phase2Answers, Phase1Answers } from "@/types/types";

export default function DiagnosisFlow() {
  const [step, setStep] = useState<
    | "start"
    | "phase1"
    | "phase2-data"
    | "phase2-call"
    | "phase2-contract"
    | "phase2-ecosystem"
    | "phase2-subscription"
    | "phase2-device"
    | "phase2-overseas"
    | "phase2-payment"
    | "result"
  >("start");

  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    phase1: {
      includePoints: null,
      networkQuality: null,
      carrierType: null,
      supportPreference: null,
      contractLockPreference: null,
    },
    phase2: {
      dataUsage: null,
      speedLimitImportance: null,
      tetheringNeeded: null,
      tetheringUsage: null,
      callFrequency: null,
      callPriority: null,
      callOptionsNeeded: null,
      callPurpose: null,
      familyLines: null,
      setDiscount: null,
      infraSet: null,
      ecosystem: null,
      ecosystemMonthly: null,
      usingEcosystem: null,
      monthlyUsage: null,
      subs: null,
      subsDiscountPreference: null,
      usingServices: null,
      monthlySubscriptionCost: null,
      subscriptions: null,
      buyingDevice: null,
      devicePurchaseMethods: null,
      overseasUse: null,
      overseasPreference: null,
      dualSim: null,
      specialUses: null,
      paymentMethods: null,
    },
  });

  return (
    <div className="min-h-screen p-4">
      {step === "start" && (
        <div>
          <h1 className="text-2xl font-bold">診断を開始</h1>
          <button onClick={() => setStep("phase1")} className="mt-4 btn">
            スタート
          </button>
        </div>
      )}

      {step === "phase1" && (
        <Phase1
          onSubmit={(phase1Answers: Phase1Answers) => {
            setAnswers((prev) => ({ ...prev, phase1: phase1Answers }));
            setStep("phase2-data");
          }}
        />
      )}

      {step.startsWith("phase2") && (
        <Phase2
          answers={answers.phase2}
          setAnswers={(updater) =>
            setAnswers((prev) => ({ ...prev, phase2: typeof updater === "function" ? updater(prev.phase2) : updater }))
          }
          currentStep={step}
          goToStep={(s) => setStep(s)}
          onFinish={() => setStep("result")}
        />
      )}

      {step === "result" && <Result answers={answers} onBack={() => setStep("phase2-payment")} />}
    </div>
  );
}


// Phase2.tsx (parent that switches between 8 phase2 pages)
"use client";

import { useState } from "react";
import { Phase2Answers } from "@/types/types";
import Phase2Data from "./Phase2Data";
import Phase2Call from "./Phase2Call";
import Phase2Contract from "./Phase2Contract";
import Phase2Ecosystem from "./Phase2Ecosystem";
import Phase2Subscription from "./Phase2Subscription";
import Phase2Device from "./Phase2Device";
import Phase2Overseas from "./Phase2Overseas";
import Phase2Payment from "./Phase2Payment";

interface Phase2Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  currentStep: string;
  goToStep: (s: string) => void;
  onFinish: () => void;
}

export default function Phase2({ answers, setAnswers, currentStep, goToStep, onFinish }: Phase2Props) {
  // map the diagnosis flow step string to local render
  const render = () => {
    switch (currentStep) {
      case "phase2-data":
        return (
          <Phase2Data
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => goToStep("phase2-call")}
            onBack={() => goToStep("phase1")}
          />
        );
      case "phase2-call":
        return (
          <Phase2Call
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => goToStep("phase2-contract")}
            onBack={() => goToStep("phase2-data")}
          />
        );
      case "phase2-contract":
        return (
          <Phase2Contract
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => goToStep("phase2-ecosystem")}
            onBack={() => goToStep("phase2-call")}
          />
        );
      case "phase2-ecosystem":
        return (
          <Phase2Ecosystem
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => goToStep("phase2-subscription")}
            onBack={() => goToStep("phase2-contract")}
          />
        );
      case "phase2-subscription":
        return (
          <Phase2Subscription
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => goToStep("phase2-device")}
            onBack={() => goToStep("phase2-ecosystem")}
          />
        );
      case "phase2-device":
        return (
          <Phase2Device
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => goToStep("phase2-overseas")}
            onBack={() => goToStep("phase2-subscription")}
          />
        );
      case "phase2-overseas":
        return (
          <Phase2Overseas
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => goToStep("phase2-payment")}
            onBack={() => goToStep("phase2-device")}
          />
        );
      case "phase2-payment":
        return (
          <Phase2Payment
            answers={answers}
            setAnswers={setAnswers}
            onNext={() => onFinish()}
            onBack={() => goToStep("phase2-overseas")}
          />
        );
      default:
        return null;
    }
  };

  return <div className="phase2-container">{render()}</div>;
}


// Phase2Data.tsx
"use client";
import React from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  onNext: () => void;
  onBack: () => void;
}

const dataUsageOptions = [
  "〜5GB（ライトユーザー）",
  "10〜20GB（標準）",
  "20GB以上（ヘビーユーザー）",
  "無制限が必要",
];

export default function Phase2Data({ answers, setAnswers, onNext, onBack }: Props) {
  const select = (key: keyof Phase2Answers, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));
  };

  return (
    <div>
      <h2 className="text-xl font-bold">① データ通信ニーズ</h2>

      <div className="mt-4">
        <p>Q1. 月のデータ使用量はどのくらいですか？</p>
        <div className="grid gap-2 mt-2">
          {dataUsageOptions.map((o) => (
            <button
              key={o}
              className={`p-3 rounded border ${answers.dataUsage === o ? "bg-blue-500 text-white" : "bg-gray-700"}`}
              onClick={() => select("dataUsage", o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p>Q2. 速度制限後の通信速度も重視しますか？</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => select("speedLimitImportance", "はい")} className={`p-3 rounded ${answers.speedLimitImportance === "はい" ? "bg-blue-500" : "bg-gray-700"}`}>
            はい（制限後も快適な速度がほしい）
          </button>
          <button onClick={() => select("speedLimitImportance", "いいえ")} className={`p-3 rounded ${answers.speedLimitImportance === "いいえ" ? "bg-blue-500" : "bg-gray-700"}`}>
            いいえ（速度低下は気にしない）
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p>Q3. テザリング機能は必要ですか？</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => select("tetheringNeeded", "はい")} className={`p-3 rounded ${answers.tetheringNeeded === "はい" ? "bg-blue-500" : "bg-gray-700"}`}>
            はい
          </button>
          <button onClick={() => select("tetheringNeeded", "いいえ") } className={`p-3 rounded ${answers.tetheringNeeded === "いいえ" ? "bg-blue-500" : "bg-gray-700"}`}>
            いいえ
          </button>
        </div>
      </div>

      {answers.tetheringNeeded === "はい" && (
        <div className="mt-4">
          <p>Q3-2. 必要な場合、月あたりどのくらいのデータ量を使いそうですか？</p>
          <div className="grid gap-2 mt-2">
            {dataUsageOptions.map((o) => (
              <button
                key={o + "-tether"}
                className={`p-3 rounded ${answers.tetheringUsage === o ? "bg-blue-500 text-white" : "bg-gray-700"}`}
                onClick={() => select("tetheringUsage", o)}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="btn-secondary">戻る</button>
        <button onClick={onNext} className="btn-primary">次へ進む</button>
      </div>
    </div>
  );
}


// Phase2Call.tsx
"use client";
import React from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  onNext: () => void;
  onBack: () => void;
}

const callFreqOptions = [
  "ほとんど通話しない（LINEなどが中心）",
  "月に数回だけ短い通話をする（1〜5分程度）",
  "毎週何度か短い通話をする（5分以内が多い）",
  "月に数回〜十数回、10〜20分程度の通話をする",
  "毎日のように長時間の通話をする（20分以上・仕事など）",
];

export default function Phase2Call({ answers, setAnswers, onNext, onBack }: Props) {
  const select = (key: keyof Phase2Answers, value: any) => setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));

  return (
    <div>
      <h2 className="text-xl font-bold">② 通話に関する質問（精度重視・5パターン対応）</h2>

      <div className="mt-4">
        <p>Q1. ふだんの通話頻度に近いものを選んでください</p>
        <div className="grid gap-2 mt-2">
          {callFreqOptions.map((o) => (
            <button key={o} className={`p-3 rounded ${answers.callFrequency === o ? "bg-blue-500" : "bg-gray-700"}`} onClick={() => select("callFrequency", o)}>
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p>Q2. 通話料の優先事項として一番近いものを選んでください</p>
        <div className="grid gap-2 mt-2">
          <button onClick={() => select("callPriority", "1回あたりの通話が短いので「短時間かけ放題（5分/10分）」が合っていそう")}>1回あたりの通話が短いので「短時間かけ放題（5分/10分）」が合っていそう</button>
          <button onClick={() => select("callPriority", "月の合計時間で考えたい（例：30分まで無料など）")}>月の合計時間で考えたい（例：30分まで無料など）</button>
          <button onClick={() => select("callPriority", "通話時間・回数を気にせず「完全かけ放題」が良い")}>通話時間・回数を気にせず「完全かけ放題」が良い</button>
          <button onClick={() => select("callPriority", "専用アプリ（Rakuten Linkなど）でもOKなら安くしたい")}>専用アプリ（Rakuten Linkなど）でもOKなら安くしたい</button>
          <button onClick={() => select("callPriority", "家族・特定の人との通話がほとんど")}>家族・特定の人との通話がほとんど</button>
        </div>
      </div>

      <div className="mt-4">
        <p>Q3. 留守番電話や着信転送などのオプションは必要ですか？</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => select("callOptionsNeeded", "はい")} className={`p-3 rounded ${answers.callOptionsNeeded === "はい" ? "bg-blue-500" : "bg-gray-700"}`}>はい、必要</button>
          <button onClick={() => select("callOptionsNeeded", "いいえ")} className={`p-3 rounded ${answers.callOptionsNeeded === "いいえ" ? "bg-blue-500" : "bg-gray-700"}`}>いいえ、不要</button>
        </div>
      </div>

      <div className="mt-4">
        <p>Q4. 通話の目的に近いものを選んでください</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => select("callPurpose", "家族や友人との連絡が中心")} className={`p-3 rounded ${answers.callPurpose === "家族や友人との連絡が中心" ? "bg-blue-500" : "bg-gray-700"}`}>家族や友人との連絡が中心</button>
          <button onClick={() => select("callPurpose", "仕事・ビジネス用途で利用することが多い")} className={`p-3 rounded ${answers.callPurpose === "仕事・ビジネス用途で利用することが多い" ? "bg-blue-500" : "bg-gray-700"}`}>仕事・ビジネス用途で利用することが多い</button>
          <button onClick={() => select("callPurpose", "どちらも同じくらい使う")} className={`p-3 rounded ${answers.callPurpose === "どちらも同じくらい使う" ? "bg-blue-500" : "bg-gray-700"}`}>どちらも同じくらい使う</button>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="btn-secondary">戻る</button>
        <button onClick={onNext} className="btn-primary">次へ進む</button>
      </div>
    </div>
  );
}


// Phase2Contract.tsx
"use client";
import React from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Phase2Contract({ answers, setAnswers, onNext, onBack }: Props) {
  const select = (key: keyof Phase2Answers, value: any) => setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));

  return (
    <div>
      <h2 className="text-xl font-bold">③ 契約条件・割引系（確定版）</h2>

      <div className="mt-4">
        <p>Q5. 家族割引を適用できる回線数はどのくらいですか？</p>
        <div className="grid gap-2 mt-2">
          {['1回線','2回線','3回線以上','利用できない / わからない'].map((o)=> (
            <button key={o} onClick={()=> select('familyLines', o)} className={`p-3 rounded ${answers.familyLines===o? 'bg-blue-500':'bg-gray-700'}`}>{o}</button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p>Q6. 光回線とのセット割を適用できますか？</p>
        <div className="flex gap-2 mt-2">
          <button onClick={()=> select('setDiscount','はい（対象の光回線を契約予定・契約中）')} className={`p-3 rounded ${answers.setDiscount=== 'はい（対象の光回線を契約予定・契約中）'? 'bg-blue-500':'bg-gray-700'}`}>はい（対象の光回線を契約予定・契約中）</button>
          <button onClick={()=> select('setDiscount','いいえ / わからない')} className={`p-3 rounded ${answers.setDiscount=== 'いいえ / わからない'? 'bg-blue-500':'bg-gray-700'}`}>いいえ / わからない</button>
        </div>
      </div>

      <div className="mt-4">
        <p>Q7. 電気やガスなどのインフラサービスとのセット割を適用できますか？</p>
        <div className="flex gap-2 mt-2">
          <button onClick={()=> select('infraSet','はい（対象サービスを契約予定・契約中）')} className={`p-3 rounded ${answers.infraSet=== 'はい（対象サービスを契約予定・契約中）'? 'bg-blue-500':'bg-gray-700'}`}>はい（対象サービスを契約予定・契約中）</button>
          <button onClick={()=> select('infraSet','いいえ / わからない')} className={`p-3 rounded ${answers.infraSet=== 'いいえ / わからない'? 'bg-blue-500':'bg-gray-700'}`}>いいえ / わからない</button>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="btn-secondary">戻る</button>
        <button onClick={onNext} className="btn-primary">次へ進む</button>
      </div>
    </div>
  );
}


// Phase2Ecosystem.tsx
"use client";
import React from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  onNext: () => void;
  onBack: () => void;
}

const ecosystemOptions = [
  "楽天経済圏（楽天カード・楽天市場など）",
  "dポイント（ドコモ・dカードなど）",
  "PayPay / ソフトバンク経済圏",
  "au PAY / Ponta経済圏",
  "特になし",
];

const monthlyOptions = [
  "〜5,000円",
  "5,000〜10,000円",
  "10,000〜30,000円",
  "30,000円以上",
];

export default function Phase2Ecosystem({ answers, setAnswers, onNext, onBack }: Props) {
  const select = (key: keyof Phase2Answers, value: any) => setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));

  return (
    <div>
      <h2 className="text-xl font-bold">④ 経済圏・ポイント利用状況（確定版）</h2>

      <div className="mt-4">
        <p>Q8. 現在よく利用している、または今後メインで使う可能性が高いポイント経済圏はどれですか？</p>
        <div className="grid gap-2 mt-2">
          {ecosystemOptions.map((o)=> (
            <button key={o} onClick={()=> select('ecosystem', o)} className={`p-3 rounded ${answers.ecosystem===o? 'bg-blue-500':'bg-gray-700'}`}>{o}</button>
          ))}
        </div>
      </div>

      {answers.ecosystem && answers.ecosystem !== '特になし' && (
        <div className="mt-4">
          <p>Q8-2. その経済圏での月間利用額はどのくらいですか？</p>
          <div className="grid gap-2 mt-2">
            {monthlyOptions.map((m)=> (
              <button key={m} onClick={()=> select('ecosystemMonthly', m)} className={`p-3 rounded ${answers.ecosystemMonthly===m? 'bg-blue-500':'bg-gray-700'}`}>{m}</button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="btn-secondary">戻る</button>
        <button onClick={onNext} className="btn-primary">次へ進む</button>
      </div>
    </div>
  );
}


// Phase2Subscription.tsx
"use client";
import React from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  onNext: () => void;
  onBack: () => void;
}

const subscriptionsList = [
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
];

export default function Phase2Subscription({ answers, setAnswers, onNext, onBack }: Props) {
  const toggle = (key: keyof Phase2Answers, value: string) => {
    setAnswers((prev) => {
      const prevArr = (prev[key] as string[] | null) ?? [];
      // if selecting 特になし, clear others
      if (value === "特になし") {
        return { ...prev, [key]: [value] } as Phase2Answers;
      }

      const newArr = prevArr.includes(value) ? prevArr.filter((v) => v !== value) : [...prevArr.filter((v) => v !== "特になし"), value];
      return { ...prev, [key]: newArr } as Phase2Answers;
    });
  };

  const selectSingle = (key: keyof Phase2Answers, value: string) => setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));

  return (
    <div>
      <h2 className="text-xl font-bold">⑤ サブスク利用状況（独立）</h2>

      <div className="mt-4">
        <p>Q9. 現在契約している、または今後契約予定のサブスクリプションサービスを選んでください（複数選択可）</p>
        <div className="grid gap-2 mt-2">
          {subscriptionsList.map((s) => (
            <button key={s} onClick={() => toggle('subscriptions', s)} className={`p-3 rounded ${((answers.subscriptions ?? []) as string[]).includes(s) ? 'bg-blue-500':'bg-gray-700'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p>Q9-2. 契約している（予定の）サブスクはキャリアセットでの割引を希望しますか？</p>
        <div className="flex gap-2 mt-2">
          <button onClick={()=> selectSingle('subsDiscountPreference','はい（割引対象のキャリア・プランがあれば優先したい）')} className={`p-3 rounded ${answers.subsDiscountPreference=== 'はい（割引対象のキャリア・プランがあれば優先したい）'? 'bg-blue-500':'bg-gray-700'}`}>はい（割引対象のキャリア・プランがあれば優先したい）</button>
          <button onClick={()=> selectSingle('subsDiscountPreference','いいえ（サブスクは別で契約する予定）')} className={`p-3 rounded ${answers.subsDiscountPreference=== 'いいえ（サブスクは別で契約する予定）'? 'bg-blue-500':'bg-gray-700'}`}>いいえ（サブスクは別で契約する予定）</button>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="btn-secondary">戻る</button>
        <button onClick={onNext} className="btn-primary">次へ進む</button>
      </div>
    </div>
  );
}


// Phase2Device.tsx
"use client";
import React from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  onNext: () => void;
  onBack: () => void;
}

const purchaseMethods = [
  "Appleなど正規ストア・家電量販店で本体のみ購入したい",
  "キャリアで端末を購入したい（通常購入）",
  "キャリアで端末を購入したい（返却・交換プログラムを利用する）",
  "どれが最もお得か分からないので、すべてのパターンを比較したい",
];

export default function Phase2Device({ answers, setAnswers, onNext, onBack }: Props) {
  const toggle = (key: keyof Phase2Answers, value: string) => setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));
  const toggleArr = (key: keyof Phase2Answers, value: string) => setAnswers((prev) => ({ ...prev, [key]: [...(prev[key] as string[] ?? []), value] } as Phase2Answers));

  return (
    <div>
      <h2 className="text-xl font-bold">⑥ 端末・購入形態</h2>

      <div className="mt-4">
        <p>Q9. 新しい端末も一緒に購入する予定ですか？</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => toggle('buyingDevice','はい（端末も一緒に購入する）')} className={`p-3 rounded ${answers.buyingDevice=== 'はい（端末も一緒に購入する）'? 'bg-blue-500':'bg-gray-700'}`}>はい（端末も一緒に購入する）</button>
          <button onClick={() => toggle('buyingDevice','いいえ（SIMのみ契約する予定）')} className={`p-3 rounded ${answers.buyingDevice=== 'いいえ（SIMのみ契約する予定）'? 'bg-blue-500':'bg-gray-700'}`}>いいえ（SIMのみ契約する予定）</button>
        </div>
      </div>

      {answers.buyingDevice && answers.buyingDevice.includes('はい') && (
        <div className="mt-4">
          <p>Q9-2. 端末の購入方法として、近い考え方を選んでください（複数選択可）</p>
          <div className="grid gap-2 mt-2">
            {purchaseMethods.map((m)=> (
              <button key={m} onClick={()=> setAnswers((prev)=> ({ ...prev, devicePurchaseMethods: [...(prev.devicePurchaseMethods ?? []), m] }))} className={`p-3 rounded ${(answers.devicePurchaseMethods ?? []).includes(m)? 'bg-blue-500':'bg-gray-700'}`}>{m}</button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="btn-secondary">戻る</button>
        <button onClick={onNext} className="btn-primary">次へ進む</button>
      </div>
    </div>
  );
}


// Phase2Overseas.tsx
"use client";
import React from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Phase2Overseas({ answers, setAnswers, onNext, onBack }: Props) {
  const select = (key: keyof Phase2Answers, value: any) => setAnswers((prev) => ({ ...prev, [key]: value } as Phase2Answers));

  return (
    <div>
      <h2 className="text-xl font-bold">⑦ 海外利用・特殊ニーズ（網羅版）</h2>

      <div className="mt-4">
        <p>Q12. 海外でスマホを利用する予定はありますか？</p>
        <div className="grid gap-2 mt-2">
          <button onClick={()=> select('overseasUse','はい（短期旅行・年数回レベル）')} className={`p-3 rounded ${answers.overseasUse=== 'はい（短期旅行・年数回レベル）'? 'bg-blue-500':'bg-gray-700'}`}>はい（短期旅行・年数回レベル）</button>
          <button onClick={()=> select('overseasUse','はい（長期滞在・留学・海外出張など）')} className={`p-3 rounded ${answers.overseasUse=== 'はい（長期滞在・留学・海外出張など）'? 'bg-blue-500':'bg-gray-700'}`}>はい（長期滞在・留学・海外出張など）</button>
          <button onClick={()=> select('overseasUse','いいえ（国内利用のみ）')} className={`p-3 rounded ${answers.overseasUse=== 'いいえ（国内利用のみ）'? 'bg-blue-500':'bg-gray-700'}`}>いいえ（国内利用のみ）</button>
        </div>
      </div>

      {answers.overseasUse && answers.overseasUse.startsWith('はい') && (
        <div className="mt-4">
          <p>Q12-2. 海外利用時の希望に近いものを選んでください</p>
          <div className="grid gap-2 mt-2">
            <button onClick={()=> select('overseasPreference','海外でも日本と同じように通信したい（ローミング含め使い放題が希望）')}>海外でも日本と同じように通信したい（ローミング含め使い放題が希望）</button>
            <button onClick={()=> select('overseasPreference','現地でSNSや地図だけ使えればOK（低速・少量でも可）')}>現地でSNSや地図だけ使えればOK（低速・少量でも可）</button>
            <button onClick={()=> select('overseasPreference','必要に応じて現地SIMを使うので、特に希望はない')}>必要に応じて現地SIMを使うので、特に希望はない</button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <p>Q13. デュアルSIM（2回線利用）を検討していますか？</p>
        <div className="flex gap-2 mt-2">
          <button onClick={()=> select('dualSim','はい（メイン＋サブで使い分けたい）')} className={`p-3 rounded ${answers.dualSim=== 'はい（メイン＋サブで使い分けたい）'? 'bg-blue-500':'bg-gray-700'}`}>はい（メイン＋サブで使い分けたい）</button>
          <button onClick={()=> select('dualSim','はい（海外用と国内用で使い分けたい）')} className={`p-3 rounded ${answers.dualSim=== 'はい（海外用と国内用で使い分けたい）'? 'bg-blue-500':'bg-gray-700'}`}>はい（海外用と国内用で使い分けたい）</button>
          <button onClick={()=> select('dualSim','いいえ（1回線のみの予定）')} className={`p-3 rounded ${answers.dualSim=== 'いいえ（1回線のみの予定）'? 'bg-blue-500':'bg-gray-700'}`}>いいえ（1回線のみの予定）</button>
        </div>
      </div>

      <div className="mt-4">
        <p>Q14. 特殊な利用目的がありますか？（複数選択可）</p>
        <div className="grid gap-2 mt-2">
          {['副回線として安価なプランを探している（メインとは別）','法人契約または業務用利用を検討している','子ども・高齢者向けなど家族のサブ回線用途','IoT機器・見守り用など特殊用途','特になし'].map((s)=> (
            <button key={s} onClick={()=> setAnswers((prev)=> ({ ...prev, specialUses: [...(prev.specialUses ?? []), s] }))} className={`p-3 rounded ${(answers.specialUses ?? []).includes(s)? 'bg-blue-500':'bg-gray-700'}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="btn-secondary">戻る</button>
        <button onClick={onNext} className="btn-primary">次へ進む</button>
      </div>
    </div>
  );
}


// Phase2Payment.tsx
"use client";
import React from "react";
import { Phase2Answers } from "@/types/types";

interface Props {
  answers: Phase2Answers;
  setAnswers: (a: Phase2Answers | ((prev: Phase2Answers) => Phase2Answers)) => void;
  onNext: () => void;
  onBack: () => void;
}

const paymentOptions = [
  "クレジットカード（楽天カード / dカード / au PAY カード / PayPayカード など）",
  "デビットカード",
  "銀行口座引き落とし",
  "プリペイドカード / チャージ式決済",
  "その他 / 特になし",
];

export default function Phase2Payment({ answers, setAnswers, onNext, onBack }: Props) {
  const toggle = (key: keyof Phase2Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: [...(prev[key] as string[] ?? []), value] } as Phase2Answers));
  };

  return (
    <div>
      <h2 className="text-xl font-bold">⑧ 通信料金の支払い方法</h2>

      <div className="mt-4">
        <p>Q15. 通信料金の支払いに利用予定の方法を選んでください（複数選択可）</p>
        <div className="grid gap-2 mt-2">
          {paymentOptions.map((p)=> (
            <button key={p} onClick={()=> toggle('paymentMethods', p)} className={`p-3 rounded ${(answers.paymentMethods ?? []).includes(p)? 'bg-blue-500':'bg-gray-700'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="btn-secondary">戻る</button>
        <button onClick={onNext} className="btn-primary">診断結果へ</button>
      </div>
    </div>
  );
}


// Note: The above files are templates that respect the exact question wording and choices you provided.
// They intentionally keep UI logic minimal and focus on correct step separation, branching and type-safe updates.
// Integrate them into your Next.js project under the exact file names you asked for (Phase2.tsx, Phase2Data.tsx, etc.).
