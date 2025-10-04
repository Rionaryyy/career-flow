"use client";
import DiagnosisFlow from "../components/DiagnosisFlow";

export default function DiagnosisPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto w-full">
        <DiagnosisFlow />
      </div>
    </main>
  );
}
