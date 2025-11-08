import { SetDiscountPlan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

/**
 * 📡 ポケットWi-Fi セット割フィルター（value と日本語ラベル両対応版）
 */
export function filterByPocketWifiSet(
  answers: DiagnosisAnswers,
  allPocketPlans: SetDiscountPlan[],
  mobilePlanId?: string
): SetDiscountPlan[] {
  const { pocketWifiCapacity, pocketWifiSpeed } = answers;

  // ① ユーザー回答を正規化（日本語でも value でも同じ形に寄せる）
  const normCapacity = normalizeCapacity(pocketWifiCapacity);
  const normSpeed = normalizeSpeed(pocketWifiSpeed);

  // ② モバイルプランに紐づくものだけ対象
  let result = allPocketPlans.filter(
    (p) =>
      (!p.applicablePlanIds || !mobilePlanId) ||
      p.applicablePlanIds.includes(mobilePlanId)
  );

  // ③ プラン側も正規化して下限以上を残す
  result = result.filter((p) => {
    const planCap = normalizeCapacity(p.routerCapacity);
    const planSpd = normalizeSpeed(p.routerSpeed);

    return (
      rankCapacity(planCap) >= rankCapacity(normCapacity) &&
      rankSpeed(planSpd) >= rankSpeed(normSpeed)
    );
  });

  // ④ キャリアごとに最安だけ残す
  const cheapestByCarrier = Object.values(
    result.reduce((acc, plan) => {
      const actual = plan.setBaseFee - plan.setDiscountAmount;
      const carrier = plan.carrier;
      if (
        !acc[carrier] ||
        actual < acc[carrier].setBaseFee - acc[carrier].setDiscountAmount
      ) {
        acc[carrier] = plan;
      }
      return acc;
    }, {} as Record<string, SetDiscountPlan>)
  );

  console.log("📡 ポケットWi-Fiフィルター適用結果:", {
    mobilePlanId,
    rawCapacity: pocketWifiCapacity,
    rawSpeed: pocketWifiSpeed,
    normCapacity,
    normSpeed,
    count: result.length,
    matched: result.map((m) => ({
      carrier: m.carrier,
      capacity: m.routerCapacity,
      speed: m.routerSpeed,
      actual: m.setBaseFee - m.setDiscountAmount,
    })),
    cheapest: cheapestByCarrier.map((p) => ({
      carrier: p.carrier,
      planName: p.planName,
      actual: p.setBaseFee - p.setDiscountAmount,
    })),
  });

  return cheapestByCarrier;
}

/* ===== ユーティリティ ===== */

// 容量を "20gb" / "50gb" / "100gb" / "unlimited" に揃える
function normalizeCapacity(raw?: string | null): string {
  if (!raw) return "20gb";

  const v = raw.trim();

  // 新しい value 想定
  if (/^\d+gb$/i.test(v)) return v.toLowerCase();
  if (v.toLowerCase() === "unlimited") return "unlimited";

  // 旧ラベル対応
  if (v.includes("〜20")) return "20gb";
  if (v.includes("〜50")) return "50gb";
  if (v.includes("100")) return "100gb";
  if (v.includes("無制限")) return "unlimited";

  // デフォルト
  return "20gb";
}

// 速度を "100mbps" / "300mbps" / "500mbps" / "1gbps" ... に揃える
function normalizeSpeed(raw?: string | null): string {
  if (!raw) return "100mbps";

  const v = raw.trim().toLowerCase();

  // すでに value が来てる場合を許容
  if (v.endsWith("mbps") || v.endsWith("gbps")) return v;

  // 旧ラベルパターン
  if (v.includes("100mbps") || v.includes("100mbps程度")) return "100mbps";
  if (v.includes("300mbps")) return "300mbps";
  if (v.includes("500mbps")) return "500mbps";
  if (v.includes("1gbps") || v.includes("最大1gbps")) return "1gbps";
  if (v.includes("2gbps") || v.includes("最大2gbps")) return "2gbps";
  if (v.includes("4gbps") || v.includes("最大4gbps")) return "4gbps";
  if (v.includes("10gbps") || v.includes("最大10gbps")) return "10gbps";

  return "100mbps";
}

// 容量のランク付け（下限比較用）
function rankCapacity(cap: string): number {
  switch (cap) {
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

// 速度のランク付け（下限比較用）
function rankSpeed(spd: string): number {
  switch (spd) {
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
