"use client";
import DiagnosisFlow from "../components/DiagnosisFlow";

export default function DiagnosisPage() {
  return (
    // ページ全体を白背景にしてポップな印象に
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      {/* DiagnosisFlow の親 div は透明のままでOK */}
      <DiagnosisFlow />
    </main>
  );
}
