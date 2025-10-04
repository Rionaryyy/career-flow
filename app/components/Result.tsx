// app/components/Result.tsx
"use client";

import { DiagnosisAnswers } from "@/types/types";
import { useState } from "react";
import {
  TwitterIcon,
  InstagramIcon,
  MessageCircleIcon,
  RefreshCwIcon,
} from "lucide-react";


interface ResultProps {
  answers: DiagnosisAnswers;
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: ResultProps) {
  const [copied, setCopied] = useState(false);

  // 共有する内容
  const summary = `キャリア診断結果:
- ポイント還元重視: ${answers.phase1.includePoints ? "はい" : "いいえ"}
- 通信品質重視: ${answers.phase1.networkQuality ? "高い" : "普通"}
- 希望キャリア: ${answers.phase1.carrierType || "未選択"}
`;

  // コピー機能
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("コピー失敗", err);
    }
  };

  // SNSシェアリンク作成
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(summary);

  const twitterLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const lineLink = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`;
  // Instagramは直接シェアできないので、コピー案内用にしておく

  return (
    <section className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">診断結果</h2>

      <div className="bg-white p-4 rounded shadow">
        <pre className="whitespace-pre-wrap">{summary}</pre>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* コピー */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
        >
          <MessageCircleIcon className="w-5 h-5" />
          コピー
        </button>
        {copied && <span className="text-green-600">コピーしました！</span>}

        {/* Twitter */}
        <a
          href={twitterLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-400 text-white px-3 py-2 rounded hover:bg-blue-500 transition"
        >
          <TwitterIcon className="w-5 h-5" />
          Twitter
        </a>

        {/* LINE */}
        <a
          href={lineLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-400 text-white px-3 py-2 rounded hover:bg-green-500 transition"
        >
          <MessageCircleIcon className="w-5 h-5" />
          LINE
        </a>

        {/* Instagram（シェア不可なのでコピー案内） */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-pink-500 text-white px-3 py-2 rounded hover:bg-pink-600 transition"
        >
          <InstagramIcon className="w-5 h-5" />
          Instagram用にコピー
        </button>

        {/* 再スタート */}
        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-gray-300 text-black px-3 py-2 rounded hover:bg-gray-400 transition"
        >
          <RefreshCwIcon className="w-5 h-5" />

          最初から
        </button>
      </div>
    </section>
  );
}
