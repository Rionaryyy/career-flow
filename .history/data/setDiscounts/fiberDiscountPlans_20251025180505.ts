import { SetDiscountPlan } from "@/types/planTypes";

/**
 * ===================================================
 * 🌐 光回線セット割データベース（拡張版）
 * ---------------------------------------------------
 * - 各キャリアのモバイルプランに対して紐づけ可能
 * - applicablePlanIds により、対応するモバイルプランを明示
 * ===================================================
 */

export const fiberDiscountPlans: SetDiscountPlan[] = [
  // === ドコモ光 ===
  {
    planId: "set_docomo_fiber_home_1g",
    carrier: "docomo",
    planName: "ドコモ光 1Gbps 戸建て",
    setCategory: "光回線",
    fiberType: "戸建て",
    fiberSpeed: "1Gbps以上",
    setBaseFee: 5720,
    setDiscountAmount: 1100,
    applicablePlanIds: ["time_5min"], // 🟢 ドコモ系プランに適用
  },
  {
    planId: "set_docomo_fiber_apartment_1g",
    carrier: "docomo",
    planName: "ドコモ光 1Gbps マンション",
    setCategory: "光回線",
    fiberType: "集合住宅（マンション・アパートなど）",
    fiberSpeed: "1Gbps以上",
    setBaseFee: 4380,
    setDiscountAmount: 1100,
    applicablePlanIds: ["time_5min"],
  },
  {
    planId: "set_docomo_fiber_home_10g",
    carrier: "docomo",
    planName: "ドコモ光 10Gbps 戸建て",
    setCategory: "光回線",
    fiberType: "戸建て",
    fiberSpeed: "10Gbps以上",
    setBaseFee: 6820,
    setDiscountAmount: 1100,
    applicablePlanIds: ["time_5min"],
  },

  // === auひかり ===
  {
    planId: "set_au_fiber_home_1g",
    carrier: "au",
    planName: "auひかり 1Gbps 戸建て",
    setCategory: "光回線",
    fiberType: "戸建て",
    fiberSpeed: "1Gbps以上",
    setBaseFee: 5400,
    setDiscountAmount: 550,
    applicablePlanIds: ["hybrid_30x10"],
  },
  {
    planId: "set_au_fiber_apartment_1g",
    carrier: "au",
    planName: "auひかり 1Gbps マンション",
    setCategory: "光回線",
    fiberType: "集合住宅（マンション・アパートなど）",
    fiberSpeed: "1Gbps以上",
    setBaseFee: 4380,
    setDiscountAmount: 550,
    applicablePlanIds: ["hybrid_30x10"],
  },
  {
    planId: "set_au_fiber_home_10g",
    carrier: "au",
    planName: "auひかり 10Gbps 戸建て",
    setCategory: "光回線",
    fiberType: "戸建て",
    fiberSpeed: "10Gbps以上",
    setBaseFee: 6780,
    setDiscountAmount: 1100,
    applicablePlanIds: ["hybrid_30x10"],
  },

  // === SoftBank光 ===
  {
    planId: "set_softbank_fiber_home_1g",
    carrier: "softbank",
    planName: "SoftBank 光 戸建てプラン",
    setCategory: "光回線",
    fiberType: "戸建て",
    fiberSpeed: "1Gbps以上",
    setBaseFee: 5670,
    setDiscountAmount: 1100,
    applicablePlanIds: ["monthly_60min"],
  },
  {
    planId: "set_softbank_fiber_apartment_1g",
    carrier: "softbank",
    planName: "SoftBank 光 マンションプラン",
    setCategory: "光回線",
    fiberType: "集合住宅（マンション・アパートなど）",
    fiberSpeed: "1Gbps以上",
    setBaseFee: 4370,
    setDiscountAmount: 1100,
    applicablePlanIds: ["monthly_60min"],
  },
  {
    planId: "set_softbank_fiber_home_10g",
    carrier: "softbank",
    planName: "SoftBank 光 10Gbps 戸建てプラン",
    setCategory: "光回線",
    fiberType: "戸建て",
    fiberSpeed: "10Gbps以上",
    setBaseFee: 6780,
    setDiscountAmount: 1100,
    applicablePlanIds: ["monthly_60min"],
  },

  // === 楽天ひかり ===
  {
    planId: "set_rakuten_fiber_home_1g",
    carrier: "rakuten",
    planName: "楽天ひかり 1Gbps 戸建て",
    setCategory: "光回線",
    fiberType: "戸建て",
    fiberSpeed: "1Gbps以上",
    setBaseFee: 5280,
    setDiscountAmount: 1100,
    applicablePlanIds: ["unlimited_call"],
  },
  {
    planId: "set_rakuten_fiber_apartment_1g",
    carrier: "rakuten",
    planName: "楽天ひかり 1Gbps マンション",
    setCategory: "光回線",
    fiberType: "集合住宅（マンション・アパートなど）",
    fiberSpeed: "1Gbps以上",
    setBaseFee: 4180,
    setDiscountAmount: 1100,
    applicablePlanIds: ["unlimited_call"],
  },
  {
    planId: "set_rakuten_fiber_home_10g",
    carrier: "rakuten",
    planName: "楽天ひかり 10Gbps 戸建て",
    setCategory: "光回線",
    fiberType: "戸建て",
    fiberSpeed: "10Gbps以上",
    setBaseFee: 6480,
    setDiscountAmount: 1100,
    applicablePlanIds: ["unlimited_call"],
  },
];
