// app/diagnosis-flow/page.tsx
"use client";
import DiagnosisFlow from "../components/DiagnosisFlow";

export default function DiagnosisPage() {
  return (
    <main className="calico-page min-h-dvh px-0 py-10">
      <div className="relative z-10">
        <DiagnosisFlow />
      </div>
    </main>
  );
}
