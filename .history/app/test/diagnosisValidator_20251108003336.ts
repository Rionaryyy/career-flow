// app/test/diagnosisValidator.ts
import { DiagnosisAnswers} from "../../types/types";
import { Plan } from "../../types/planTypes";

interface ValidationResult {
  planId: string;
  carrier: string;
  planName: string;
  checks: { label: string; passed: boolean; note?: string }[];
}

const callTypeMap: Record<string, string[]> = {
  "1回あたり": ["time"],
  "合計通話時間": ["monthly"],
  "ハイブリッド": ["hybrid"],
  "無制限（完全定額）": ["unlimited"],
};

export function validateDiagnosisResult(
  answers: { phase1?: Partial<DiagnosisAnswers>; phase2?: Partial<DiagnosisAnswers> },
  plans: Plan[]
): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const plan of plans) {
    const p: any = plan;
    const phase1 = answers.phase1 || {};
    const phase2 = answers.phase2 || {};
    const checks: ValidationResult["checks"] = [];

    // ------------------------------
    // 🟩 Phase1 チェック
    // ------------------------------

    // 経済圏特典（includePoints）
    if (phase1.includePoints !== undefined && p.economySupport !== undefined) {
      const ok = phase1.includePoints === "はい" ? p.economySupport : true;
      checks.push({
        label: "経済圏特典考慮",
        passed: ok,
        note: ok ? undefined : "経済圏非対応プラン",
      });
    }

    // 実質料金にポイント還元を含めるか（considerPointInActualCost）
    if (phase1.considerPointInActualCost !== undefined && p.economySupport !== undefined) {
      const ok = phase1.considerPointInActualCost === "はい" ? p.economySupport : true;
      checks.push({
        label: "ポイント還元実質考慮",
        passed: ok,
        note: ok ? undefined : "ポイント非考慮プラン",
      });
    }

    // 通信品質
    if (phase1.networkQuality && p.networkQuality) {
      const ok = p.networkQuality === phase1.networkQuality || p.networkQuality === "高";
      checks.push({
        label: "通信品質（Phase1）",
        passed: ok,
        note: ok ? undefined : `条件:${phase1.networkQuality}, 実際:${p.networkQuality}`,
      });
    }

    // キャリアタイプ
    if (phase1.carrierType && p.planType) {
      const ok = p.planType.includes(phase1.carrierType);
      checks.push({
        label: "キャリアタイプ",
        passed: ok,
        note: ok ? undefined : `条件:${phase1.carrierType}, 実際:${p.planType}`,
      });
    }

    // サポート体制（supportPreference）
    if (phase1.supportPreference && p.supportLevel) {
      const ok = p.supportLevel === phase1.supportPreference || p.supportLevel === "高";
      checks.push({
        label: "サポート重視度",
        passed: ok,
        note: ok ? undefined : `条件:${phase1.supportPreference}, 実際:${p.supportLevel}`,
      });
    }

    // 契約縛り
    if (phase1.contractLockPreference && p.contractType) {
      const ok = p.contractType === phase1.contractLockPreference;
      checks.push({
        label: "契約縛り",
        passed: ok,
        note: ok ? undefined : `条件:${phase1.contractLockPreference}, 実際:${p.contractType}`,
      });
    }

    // ------------------------------
    // 🟦 Phase2 チェック
    // ------------------------------

    if (phase2.dataUsage) {
      const planGB = Number(p.maxDataGB ?? 0);
      const condGB =
        phase2.dataUsage.includes("100")
          ? 100
          : phase2.dataUsage.includes("50")
          ? 50
          : phase2.dataUsage.includes("20")
          ? 20
          : 0;
      const ok = planGB >= condGB;
      checks.push({
        label: "データ容量",
        passed: ok,
        note: ok ? undefined : `条件:${condGB}GB, 実際:${planGB}GB`,
      });
    }

    if (phase2.tetheringNeeded) {
      const ok = p.tetheringAvailable === true;
      checks.push({
        label: "テザリング対応",
        passed: ok,
        note: ok ? undefined : "プランでテザリング非対応",
      });

      if (phase2.tetheringUsage && p.tetheringUsage) {
        const needGB = Number(phase2.tetheringUsage.match(/\d+/)?.[0] || 0);
        const planGB = Number(p.tetheringUsage || 0);
        const okUsage = planGB >= needGB;
        checks.push({
          label: "テザリング容量",
          passed: okUsage,
          note: okUsage ? undefined : `条件:${needGB}GB, 実際:${planGB}GB`,
        });
      }
    }

    if (phase2.callPlanType && p.callType) {
      const allowed = phase2.callPlanType.flatMap((j) => callTypeMap[j] ?? []);
      const ok = allowed.includes(p.callType);
      checks.push({
        label: "通話タイプ",
        passed: ok,
        note: ok ? undefined : `条件:${phase2.callPlanType.join(",")} / 実際:${p.callType}`,
      });
    }

    if (phase2.mainCard && p.supportedPaymentMethods) {
      const ok = phase2.mainCard.some((m) => p.supportedPaymentMethods.includes(m));
      checks.push({
        label: "支払方法",
        passed: ok,
        note: ok
          ? undefined
          : `条件:${phase2.mainCard.join(",")} / 実際:${p.supportedPaymentMethods.join(",")}`,
      });
    }

    if (phase2.overseasSupport && p.overseasSupport !== undefined) {
      const ok =
        (phase2.overseasSupport === "はい" && p.overseasSupport) ||
        (phase2.overseasSupport === "いいえ" && !p.overseasSupport);
      checks.push({
        label: "海外対応",
        passed: ok,
        note: ok ? undefined : `条件:${phase2.overseasSupport}, 実際:${p.overseasSupport}`,
      });
    }

    // 合計金額整合性
    if (typeof p.total === "number") {
      const ok = !isNaN(p.total);
      checks.push({
        label: "合計金額算出",
        passed: ok,
        note: ok ? undefined : "totalがNaN",
      });
    }

    const expected =
      (p.baseFee ?? 0) +
      (p.callOptionFee ?? 0) -
      ((p.familyDiscount ?? 0) +
        (p.studentDiscount ?? 0) +
        (p.economyDiscount ?? 0) +
        (p.deviceDiscount ?? 0) +
        (p.fiberDiscountAmount ?? 0) +
        (p.routerDiscountAmount ?? 0) +
        (p.pocketDiscountAmount ?? 0));
    const diff = Math.abs((p.total ?? 0) - expected);
    if (p.total !== undefined) {
      const ok = diff < 10;
      checks.push({
        label: "割引反映整合性",
        passed: ok,
        note: ok ? undefined : `差額:${diff}円`,
      });
    }

    results.push({
      planId: p.planId,
      carrier: p.carrier,
      planName: p.planName,
      checks,
    });
  }

  return results;
}

export function printValidationReport(results: ValidationResult[]) {
  console.log("\n=== 🔍 総合整合性チェック結果（Phase1 + Phase2） ===\n");
  let passCount = 0;
  let warnCount = 0;

  for (const r of results) {
    console.log(`📱 ${r.carrier} (${r.planName})`);
    for (const c of r.checks) {
      const symbol = c.passed ? "✅" : "⚠️";
      console.log(`  ${symbol} ${c.label}${c.note ? " → " + c.note : ""}`);
      if (c.passed) passCount++;
      else warnCount++;
    }
    console.log("--------------------------------");
  }

  console.log(`✅ 成功: ${passCount}項目, ⚠️ 注意: ${warnCount}項目\n`);
}
