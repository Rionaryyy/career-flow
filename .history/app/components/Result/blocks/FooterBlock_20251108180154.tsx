"use client";

interface Props {
  onRestart: () => void;
}

export default function FooterBlock({ onRestart }: Props) {
  const handleRestart = () => {
    // 🔹 localStorageの完全クリア
    localStorage.removeItem("careerFlowAnswers");
    sessionStorage.clear(); // ← 念のためセッションも消す
    console.log("🧹 診断データをリセットしました");

    // 🔹 キャッシュ対策：ページを完全リロード
    onRestart();
    window.location.reload(); // ← これを追加
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleRestart}
        className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-lg font-semibold shadow-md transition-all duration-200"
      >
        🔄 もう一度診断する
      </button>
    </div>
  );
}
