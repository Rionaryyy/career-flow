import { fiberDiscountPlans } from "@/data/setDiscounts/fiberDiscountPlans";
import { routerDiscountPlans } from "@/data/setDiscounts/routerDiscountPlans";
import { pocketWifiDiscountPlans } from "@/data/setDiscounts/pocketWifiDiscountPlans";
import { Plan } from "@/types/planTypes";
import { DiagnosisAnswers } from "@/types/types";

export interface SetDiscountResult {
  fiberDiscount: number;
  routerDiscount: number;
  pocketWifiDiscount: number;
  electricDiscount: number;
  gasDiscount: number;
  fiberBaseFee: number;
  routerBaseFee: number;
  pocketWifiBaseFee: number;
  debug?: string;
}

/**
 * 🏠 セット割ロジック（Phase2対応版・完全安定）
 * -----------------------------------------------------
 * - 光回線 / ルーター / ポケットWi-Fi / 電気 / ガス対応
 * - normalizeSpeed / normalizeCapacity / normalizeFiberType による完全揺れ吸収
 * - carrier / speed / type を正規化比較
 */
export function calcSetDiscounts(plan: Plan, answers: DiagnosisAnswers): SetDiscountResult {
  let fiberDiscount = 0;
  let routerDiscount = 0;
  let pocketWifiDiscount = 0;
  let electricDiscount = 0;
  let gasDiscount = 0;
  let fiberBaseFee = 0;
  let routerBaseFee = 0;
  let pocketWifiBaseFee = 0;

  // === Utility: normalize general text ===
  const normalize = (t?: string) =>
    t
      ?.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      )
      .replace(/\s+/g, "")
      .trim()
      .toLowerCase() || "";

  const selected = Array.isArray(answers.setDiscount)
    ? answers.setDiscount.map((s) => normalize(s))
    : [];



  // === 🌐 光回線セット ===
  if (selected.includes("fiber") || (answers.fiberType && answers.fiberSpeed)) {
    const type = normalizeFiberType(answers.fiberType);
    const speed = normalizeSpeed(answers.fiberSpeed);



    const match = fiberDiscountPlans.find(
      (p) =>
        normalize(p.carrier) === normalize(plan.carrier) &&
        (!p.fiberType || normalizeFiberType(p.fiberType) === type) &&
        (!p.fiberSpeed || normalizeSpeed(p.fiberSpeed).includes(speed))
    );

    if (match) {
      fiberDiscount = match.setDiscountAmount ?? 0;
      fiberBaseFee = match.setBaseFee ?? 0;
      
    }
  }

  // === 📶 ホームルーターセット ===
  if (selected.includes("router") || (answers.routerCapacity && answers.routerSpeed)) {
    const speed = normalizeSpeed(answers.routerSpeed);

    const match = routerDiscountPlans.find(
      (p) =>
        normalize(p.carrier) === normalize(plan.carrier) &&
        (!p.routerSpeed || normalizeSpeed(p.routerSpeed) === speed)
    );

    if (match) {
      routerDiscount = match.setDiscountAmount ?? 0;
      routerBaseFee = match.setBaseFee ?? 0;
      
    }
  }

  // === 📡 ポケットWi-Fiセット ===
  if (selected.includes("pocketwifi") || answers.pocketWifiCapacity || answers.pocketWifiSpeed) {
    const cap = normalizeCapacity(answers.pocketWifiCapacity);
    const speed = normalizeSpeed(answers.pocketWifiSpeed);

    const match = pocketWifiDiscountPlans.find(
      (p) =>
        normalize(p.carrier) === normalize(plan.carrier) &&
        ((p.routerCapacity && normalizeCapacity(p.routerCapacity) === cap) ||
          (p.routerSpeed && normalizeSpeed(p.routerSpeed) === speed))
    );

    if (match) {
      pocketWifiDiscount = match.setDiscountAmount ?? 0;
      pocketWifiBaseFee = match.setBaseFee ?? 0;
      
    }
  }

  // === 🔌 電気・ガスセット ===
  const raw = selected.join(",");
  if (
    (raw.includes("electric") || raw.includes("電気")) &&
    plan.supportsElectricSet &&
    plan.energyDiscountRules
  ) {
    const match = plan.energyDiscountRules.find(
      (r) => normalize(r.type).includes("electric") || r.type === "電気"
    );
    if (match) electricDiscount = match.discount;
  }

  if (
    (raw.includes("gas") || raw.includes("ガス")) &&
    plan.supportsGasSet &&
    plan.energyDiscountRules
  ) {
    const match = plan.energyDiscountRules.find(
      (r) => normalize(r.type).includes("gas") || r.type === "ガス"
    );
    if (match) gasDiscount = match.discount;
  }

  const debug = `📦 fiber=${fiberDiscount}, router=${routerDiscount}, pocket=${pocketWifiDiscount}, electric=${electricDiscount}, gas=${gasDiscount}`;

  return {
    fiberDiscount,
    routerDiscount,
    pocketWifiDiscount,
    electricDiscount,
    gasDiscount,
    fiberBaseFee,
    routerBaseFee,
    pocketWifiBaseFee,
    debug,
  };
}

/* ===========================================================
   🧰 Utility: 正規化関数群（揺れ・全角・「以上」・日英対応）
=========================================================== */
function normalizeSpeed(raw?: string): string {
  if (!raw) return "";
  const v = raw.trim().toLowerCase();

  // Gbps 系
  if (v.match(/10\s*g|10\s*gbps|10\s*ギガ/)) return "10gbps";
  if (v.match(/5\s*g|5\s*gbps|5\s*ギガ/)) return "5gbps";
  if (v.match(/4\s*g|4\s*gbps|4\s*ギガ/)) return "4gbps";
  if (v.match(/2\s*g|2\s*gbps|2\s*ギガ/)) return "2gbps";
  if (v.match(/1\s*g|1\s*gbps|1\s*ギガ/)) return "1gbps";

  // Mbps 系
  if (v.match(/100\s*m|100\s*mbps|100\s*メガ/)) return "100mbps";
  if (v.match(/300\s*m|300\s*mbps|300\s*メガ/)) return "300mbps";
  if (v.match(/500\s*m|500\s*mbps|500\s*メガ/)) return "500mbps";

  // 「以上」「最大」「～」を削除して単位統一
  return v
    .replace(/以上|最大|～|bps/g, "")
    .replace(/ギガ/, "gbps")
    .replace(/メガ/, "mbps")
    .trim();
}

function normalizeCapacity(raw?: string): string {
  if (!raw) return "";
  const v = raw.trim().toLowerCase();
  if (v.includes("20")) return "20gb";
  if (v.includes("50")) return "50gb";
  if (v.includes("100")) return "100gb";
  if (v.includes("無制限") || v.includes("unlimited")) return "unlimited";
  return v.replace(/gb|以上|程度|〜/g, "").trim();
}

function normalizeFiberType(raw?: string): string {
  if (!raw) return "";
  const v = raw.trim().toLowerCase();
  if (v.includes("house") || v.includes("戸建")) return "戸建て";
  if (v.includes("apartment") || v.includes("集合") || v.includes("マンション"))
    return "集合住宅（マンション・アパートなど）";
  return v;
}
