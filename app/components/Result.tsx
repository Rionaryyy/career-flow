"use client";

import { DiagnosisAnswers } from "@/types/types";
import { useState, useEffect } from "react";
import {
  TwitterIcon,
  MessageCircleIcon,
  InstagramIcon,
  ArrowUpIcon,
} from "lucide-react";

interface ResultProps {
  answers: DiagnosisAnswers;
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: ResultProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const summary = `📶 キャリア診断結果\n
- ポイント還元重視: ${answers.phase1.includePoints ? "はい" : "いいえ"}
- 通信品質重視: ${answers.phase1.networkQuality ? "高い" : "普通"}
- 希望キャリア: ${answers.phase1.carrierType || "未選択"}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    summary
  )}&url=${encodeURIComponent(currentUrl)}`;
  const lineLink = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <section className="max-w-3xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">診断結果</h2>

      <div className="bg-white p-6 rounded-xl shadow text-left whitespace-pre-wrap">
        {summary}
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-4">📤 診断結果をシェアしよう！</h3>

      <div className="flex flex-wrap justify-center gap-4">
        {/* Twitter */}
        <a
          href={twitterLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500 transition transform hover:scale-110 shadow"
        >
          <TwitterIcon className="w-6 h-6" />
        </a>

        {/* LINE */}
        <a
          href={lineLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition transform hover:scale-110 shadow"
        >
          <MessageCircleIcon className="w-6 h-6" />
        </a>

        {/* Instagram（コピー用） */}
        <button
          onClick={handleCopy}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600 transition transform hover:scale-110 shadow"
        >
          <InstagramIcon className="w-6 h-6" />
        </button>
      </div>

      {copied && (
        <p className="text-green-600 mt-2 text-sm">✅ Instagram用にコピーしました！</p>
      )}

      <button
        onClick={onRestart}
        className="mt-8 inline-flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-full transition shadow"
      >
        <ArrowUpIcon className="w-5 h-5" />
        最初から診断する
      </button>
    </section>
  );
}
