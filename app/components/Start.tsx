"use client";

interface StartProps {
  onNext: () => void;
}

export default function Start({ onNext }: StartProps) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-bold">キャリア診断へようこそ</h1>
      <p>いくつかの質問に答えるだけで、あなたに最適なプランを提案します。</p>
      <button
        onClick={onNext}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        診断をはじめる
      </button>
    </div>
  );
}
