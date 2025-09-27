"use client";

interface StartProps {
  onStart: () => void;
}

export default function Start({ onStart }: StartProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-xl">
        <h1 className="text-3xl font-bold mb-4">キャリア診断へようこそ</h1>
        <p className="text-gray-600 mb-6">
          いくつかの質問に答えるだけで、あなたに最適な携帯キャリアの候補を提案します。
        </p>
        <button
          onClick={onStart}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          診断をはじめる
        </button>
      </div>
    </div>
  );
}
