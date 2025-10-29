"use client";
import DiagnosisFlow from "../components/DiagnosisFlow";

export default function DiagnosisPage() {
  return (
    <main className="min-h-dvh px-0 py-10">
      {/* ここが「カード周りの白背景」を猫柄にするラッパ */}
      <section
        className="
          relative
          before:content-[''] before:absolute before:inset-0 before:-z-10
          before:bg-[url('/images/calicocat.png')] before:bg-repeat
          before:bg-[length:72px_72px]  /* ← 小さめのサイズ */
          before:opacity-20              /* ← うっすら表示 */
          before:transform before:-rotate-12 /* ← 斜め配置 */
        "
      >
        <DiagnosisFlow />
      </section>
    </main>
  );
}
