"use client";

import React from "react";

interface ResultProps {
  answers: any; // 実際は DiagnosisAnswers 型に置き換え
  onRestart: () => void;
}

export default function Result({ answers, onRestart }: ResultProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareText = encodeURIComponent(
    `私のキャリア診断結果はこちら！ #キャリア診断 ${shareUrl}`
  );

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("URLをコピーしました！");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto px-4">
      {/* 結果内容 */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">診断結果</h2>
        <p>ここに診断結果を表示</p>
      </div>

      {/* 共有ボタン */}
      <div className="flex flex-wrap gap-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Twitterで共有
        </a>
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          LINEで共有
        </a>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          URLをコピー
        </button>
      </div>

      {/* 再診断ボタン */}
      <button
        onClick={onRestart}
        className="mt-6 px-6 py-3 bg-blue-400 text-white rounded hover:bg-blue-500 transition"
      >
        診断をやり直す
      </button>
    </div>
  );
}
