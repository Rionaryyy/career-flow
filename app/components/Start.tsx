// app/components/Start.tsx
"use client";

type StartProps = {
  onNext: () => void;
};

export default function Start({ onNext }: StartProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-white mb-8">📱 回線診断</h1>
      <p className="text-center text-gray-300 mb-8">
        あなたに最適なキャリア／プランの候補を提案します。質問はフェーズ①・②で合計多数ありますが、ページを進めるだけでOKです。
      </p>
      <div className="text-center">
        <button
          onClick={onNext}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-lg font-semibold shadow-lg"
        >
          診断を始める
        </button>
      </div>
    </div>
  );
}
