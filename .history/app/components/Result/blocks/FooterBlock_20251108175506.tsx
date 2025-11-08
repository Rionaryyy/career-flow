"use client";

interface Props {
  onRestart: () => void;
}

export default function FooterBlock({ onRestart }: Props) {
  const handleRestart = () => {
    // 保存キーの両方を削除
    localStorage.removeItem("careerFlowAnswers");
    localStorage.removeItem("diagnosis_answers");

    console.log("🧹 診断データをリセットしました（全キー削除）");
    onRestart();
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
