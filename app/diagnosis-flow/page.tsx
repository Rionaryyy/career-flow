"use client";
import DiagnosisFlow from "../components/DiagnosisFlow";

export default function DiagnosisPage() {
  return (
    // ページ全体の背景をグレーに設定
    <main className="min-h-screen shadow-blue-900/40 py-10 px-4">
      {/* DiagnosisFlow の親 div は透明のままでOK */}
      <DiagnosisFlow />
    </main>
  );
}
