// 🧩 統合後の診断回答型（Phase1+Phase2を統合）
export interface DiagnosisAnswers {
  // === 基本条件（旧Phase1） ===
  includePoints: string | null;
  networkQuality: string | null;
  carrierType: string | null;
  considerCardAndPayment?: string | null;
  considerPointInActualCost?: string | null;
  supportPreference: string | null;
  contractLockPreference: string | null;
  compareAxis?: string;
  comparePeriod?: string;
  contractMethod?: string | null;
  appCallUnlimited?: string | null;
  includeSubscription?: string;

  // === 詳細条件（旧Phase2） ===
  dataUsage?: string | null;
  speedLimitImportance?: string | null;
  tetheringNeeded?: string | boolean | null;
  tetheringUsage?: string | null;

  callDuration?: string | null;
  callFrequencyPerWeek?: string | null;
  familyCallRatio?: string | null;
  overseasCallDuration?: string | null;
  overseasCallFrequencyPerWeek?: string | null;
  callOptionsNeeded?: string | null;

  needCallPlan?: string | null;
  callPlanType?: string[];
  timeLimitPreference?: string | null;
  monthlyLimitPreference?: string | null;
  hybridCallPreference?: string | null;
  needInternationalCallUnlimited?: string;
  internationalCallCarrier?: string[];

  familyLines?: string | null;
  setDiscount?: string | null;
  infraSet?: string | null;
  fiberUsage?: string;
  fiberType?: string;
  fiberSpeed?: string;
  hasElectricSet?: boolean;
  hasGasSet?: boolean;

  shoppingList?: string[] | null;
  shoppingMonthly?: string | null;
  paymentList?: string[] | null;
  paymentMonthly?: string | null;
  paymentEcosystem?: string[];
  linkedBank?: string[];
  monthlyShoppingSpend?: number;

  videoSubscriptions?: string[] | null;
  musicSubscriptions?: string[] | null;
  bookSubscriptions?: string[] | null;
  gameSubscriptions?: string[] | null;
  cloudSubscriptions?: string[] | null;
  otherSubscriptions?: string[] | null;
  subscriptionMonthly?: string | null;

  // === 端末・デバイス関連 ===
  devicePreference?: string | null;
  devicePurchaseMethods?: string[] | null;
  devicePurchase?: "sim_only" | "device_carrier" | "device_store" | null;
  deviceModel?: string | null;
  deviceStorage?: string | null;
  buyingDevice?: string | null;
  oldDevicePlan?: string | null;
  couponUsed?: boolean;

  // === 海外利用関連 ===
  overseasUse?: string | null;
  overseasPreference?: string | null;
  overseasSupport?: string | null;
  dualSim?: string | null;
  specialUses?: string[] | null;
  stayDuration?: string | null;
  usageType?: string | null;

  // === 支払い・カード関連 ===
  mainCard?: string[];
  cardDetail?: string;
  paymentTiming?: string | null;
  paymentMethod?: string | null;
  monthlyBarcodeSpend?: number;
  shoppingEcosystem?: string;

  // === セット割・Wi-Fi関連 ===
  routerCapacity?: string;
  routerSpeed?: string;
  pocketWifiCapacity?: string;
  pocketWifiSpeed?: string;

  // 🔹自由入力・拡張用
  [key: string]: any;
}
