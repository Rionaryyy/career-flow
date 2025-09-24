"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Answer = string;


  <h1 className="text-3xl font-bold text-center mb-4">📱 キャリア診断テスト</h1>  // ←この1行を追加


const questions = [
  { key: "family", text: "家族割や光回線割を利用しますか？", options: ["はい", "いいえ"] },
  { key: "data", text: "月のデータ使用量は？", options: ["1GB未満", "1〜5GB", "10〜20GB", "30GB以上/無制限"] },
  { key: "call", text: "通話はどのくらいしますか？", options: ["ほとんどしない", "短時間が多い", "長電話が多い"] },
  { key: "device", text: "端末はどうしますか？", options: ["最新を分割購入", "SIMフリーを一括購入"] },
  { key: "priority", text: "どの経済圏を重視しますか？", options: ["楽天", "PayPay", "dポイント", "Ponta/au PAY", "特にない"] },
  { key: "support", text: "サポート体制は？", options: ["店舗サポート必要", "オンラインで十分"] },
  { key: "stability", text: "料金と速度どちらを優先しますか？", options: ["料金の安さ", "速度の安定性"] },
  { key: "overseas", text: "海外利用は想定しますか？", options: ["はい", "いいえ"] },
  { key: "subscription", text: "動画や音楽のサブスク割引は使いたいですか？", options: ["はい", "いいえ"] },
  { key: "payment", text: "支払い方法は？", options: ["クレカOK", "口座振替希望"] },
  { key: "dual", text: "複数回線（デュアルSIM）を使いますか？", options: ["はい", "いいえ"] },
  { key: "term", text: "長期利用を想定しますか？", options: ["はい", "いいえ"] },
];

const resultsDB = [
  {
    name: "ahamo",
    price: "20GB 2,970円",
    strengths: "ドコモ回線安定・5分かけ放題込み",
    econ: "dポイント",
  },
  {
    name: "LINEMO",
    price: "3GB 990円 / 20GB 2,728円",
    strengths: "シンプル・格安・LINE使い放題",
    econ: "PayPay",
  },
  {
    name: "楽天モバイル",
    price: "無制限 3,278円",
    strengths: "楽天市場SPU・無制限",
    econ: "楽天経済圏",
  },
  {
    name: "UQモバイル",
    price: "15GB 2,728円 / 20GB 3,278円",
    strengths: "au回線・Pontaポイント",
    econ: "au経済圏",
  },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option: Answer) => {
    const q = questions[step];
    setAnswers({ ...answers, [q.key]: option });
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  // 簡易診断ロジック
  const getResults = () => {
    if (answers.priority === "楽天") return [resultsDB[2], resultsDB[0]];
    if (answers.priority === "PayPay") return [resultsDB[1], resultsDB[3]];
    if (answers.priority === "dポイント") return [resultsDB[0], resultsDB[1]];
    if (answers.priority === "Ponta/au PAY") return [resultsDB[3], resultsDB[0]];
    return [resultsDB[1], resultsDB[2]];
  };

  const results = getResults();

  if (!finished) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* プログレスバー */}
          <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* 質問カード */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-md"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {questions[step].text}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {questions[step].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="p-4 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          🎉 診断結果
        </h2>

        {/* 比較表 */}
        <table className="w-full text-left bg-white shadow-md rounded-2xl overflow-hidden border">
          <thead className="bg-blue-200 text-gray-900">
            <tr>
              <th className="p-3">項目</th>
              {results.map((r, idx) => (
                <th key={idx} className="p-3">{r.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3 font-semibold text-gray-900">料金</td>
              {results.map((r, idx) => (
                <td key={idx} className="p-3 text-gray-800">{r.price}</td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-semibold text-gray-900">特徴</td>
              {results.map((r, idx) => (
                <td key={idx} className="p-3 text-gray-800">{r.strengths}</td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-3 font-semibold text-gray-900">経済圏</td>
              {results.map((r, idx) => (
                <td key={idx} className="p-3 text-gray-800">{r.econ}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </motion.div>
    </main>
  );
}






