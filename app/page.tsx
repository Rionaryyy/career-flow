"use client";

import DiagnosisFlow from "./components/DiagnosisFlow";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">キャリア診断アプリ</h1>
      <DiagnosisFlow />
    </main>
  );
}
