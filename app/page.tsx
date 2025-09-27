// app/page.tsx
import React from "react";
import DiagnosisFlow from "./components/DiagnosisFlow";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <DiagnosisFlow />
    </main>
  );
}
