import { DiagnosisAnswers } from "@/types/types";
import { SetDiscountPlan } from "@/types/planTypes";

/**
 * 📶 ルーターセット割フィルター（value対応＋旧ラベル互換版）
 */
export function filterByRouterSet(
  answers: DiagnosisAnswers,
  setPlans: SetDiscountPlan[],
  mobilePlanId?: string
): SetDiscountPlan[] {
  const { routerCapacity, routerSpeed } = answers;

  // ルーターカテゴリ限定
  let result = setPlans.filter((p) => p.setCategory === "ルーター");

  // モバイルプラン紐づけ
  if (mobilePlanId) {
    result = result.filter(
      (p) =>
        !p.applicablePlanIds || p.applicablePlanIds.includes(mobilePlanId)
    );
  }

  // 💾 容量フィルター
  if (routerCapacity && routerCapacity !== "any") {
    const normalizedCapacity = normalizeCapacity(routerCapacity);
    result = result.filter((p) => {
      const planCap = normalizeCapacity(p.routerCapacity);
      return rankCapacity(planCap) >= rankCapacity(normalizedCapacity);
    });
  }

  // ⚙️ 速度フィルター
  if (routerSpeed && routerSpeed !== "any") {
    const normalizedSpeed = normalizeSpeed(routerSpeed);
    result = result.filter((p) => {
      const planSpd = normalizeSpeed(p.routerSpeed);
      return rankSpeed(planSpd) >= rankSpeed(normalizedSpeed);
    });
  }

  // 🧮 キャリアごとに最安プラン抽出
  const bestByCarrier = Object.values(
    result.reduce((acc, plan) => {
      const actualCost = plan.setBaseFee - plan.setDiscountAmount;
      const carrier = plan.carrier;
      if (
        !acc[carrier] ||
        actualCost < acc[carrier].setBaseFee - acc[carrier].setDiscountAmount
      ) {
        acc[carrier] = plan;
      }
      return acc;
    }, {} as Record<string, SetDiscountPlan>)
  );

  // 🧾 ログ出力
  console.log("📶 ルーターフィルター適用結果:", {
    mobilePlanId,
    routerCapacity,
    routerSpeed,
    count: result.length,
    matched: result.map((p) => ({
      carrier: p.carrier,
      capacity: p.routerCapacity,
      speed: p.routerSpeed,
      実質料金: p.setBaseFee - p.setDiscountAmount,
    })),
    最安プラン: bestByCarrier.map((p) => ({
      carrier: p.carrier,
      planName: p.planName,
      実質料金: p.setBaseFee - p.setDiscountAmount,
    })),
  });

  return bestByCarrier;
}

/* ===== ユーティリティ ===== */

// 容量を "50gb" / "100gb" / "unlimited" に揃える
function normalizeCapacity(raw?: string | null): string {
  if (!raw) return "50gb";
  const v = raw.trim().toLowerCase();

  // value 形式
  if (/^\d+gb$/i.test(v)) return v;
  if (v === "unlimited") return "unlimited";

  // 日本語ラベル対応
  if (v.includes("20")) return "20gb";
  if (v.includes("50")) return "50gb";
  if (v.includes("100")) return "100gb";
  if (v.includes("無制限")) return "unlimited";

  return "50gb";
}

// 速度を "300mbps" / "500mbps" / "1gbps" / "2gbps" などに揃える
function normalizeSpeed(raw?: string | null): string {
  if (!raw) return "300mbps";
  const v = raw.trim().toLowerCase();

  // value形式
  if (v.endsWith("mbps") || v.endsWith("gbps")) return v;

  // 日本語対応
  if (v.includes("100mbps")) return "100mbps";
  if (v.includes("300mbps")) return "300mbps";
  if (v.includes("500mbps")) return "500mbps";
  if (v.includes("1gbps")) return "1gbps";
  if (v.includes("2gbps")) return "2gbps";
  if (v.includes("4gbps")) return "4gbps";
  if (v.includes("10gbps")) return "10gbps";

  return "300mbps";
}

// 容量ランク比較
function rankCapacity(c: string): number {
  switch (c) {
    case "20gb":
      return 1;
    case "50gb":
      return 2;
    case "100gb":
      return 3;
    case "unlimited":
      return 4;
    default:
      return 1;
  }
}

// 速度ランク比較
function rankSpeed(s: string): number {
  switch (s) {
    case "100mbps":
      return 1;
    case "300mbps":
      return 2;
    case "500mbps":
      return 3;
    case "1gbps":
      return 4;
    case "2gbps":
      return 5;
    case "4gbps":
      return 6;
    case "10gbps":
      return 7;
    default:
      return 1;
  }
}
