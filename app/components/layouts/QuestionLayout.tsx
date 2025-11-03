"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface QuestionLayoutProps {
  answeredCount: number;
  totalCount: number;
  children: React.ReactNode;
}

export default function QuestionLayout({
  answeredCount,
  totalCount,
  children,
}: QuestionLayoutProps) {
  const rawPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
  const percent = Math.round(Math.max(0, Math.min(100, rawPercent)));
  const [widthPercent, setWidthPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidthPercent(percent), 50);
    return () => clearTimeout(timer);
  }, [percent]);

  // 猫の幅（px）。画像サイズに合わせて必要なら数値変更
  const catWidth = 48;
  const half = catWidth / 2;

  // スマホアイコンの大きさ（必要なら数値調整OK）
  const phoneSize = 32;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* ステップと％表示 */}
      <div className="mb-2 text-sm text-sky-900 font-semibold flex justify-between">
        <span>
          ステップ {answeredCount} / {totalCount}
        </span>
      </div>

      {/* 進捗バー＋猫＋スマホ */}
      <div className="relative w-full mb-6">
        <div className="w-full bg-sky-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${widthPercent}%` }}
          />
        </div>

        {/* 猫：進捗の先端に追従（スマホの“前”に来るよう z-10） */}
        <Image
          src="/images/mascot-cat-walk.png?v=2"
          alt=""
          width={catWidth}
          height={catWidth}
          priority
          aria-hidden
          className="pointer-events-none select-none absolute -top-5 drop-shadow z-10"
          style={{ left: `calc(${widthPercent}% - ${half}px)` }}
        />

        {/* スマホ：バー右端で待機（猫の“後ろ”に来るよう z-0） */}
        <Image
          src="/images/step-phone-icon.png" // ← この画像名で public/images に保存してね
          alt=""
          width={phoneSize}
          height={phoneSize}
          aria-hidden
          className="pointer-events-none select-none absolute -top-6 right-0 translate-x-1/4 drop-shadow z-0"
        />
      </div>

      {children}
    </div>
  );
}
