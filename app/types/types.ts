// app/types/types.ts

export type DiagnosisAnswers = {
  includePoints: string;            // ポイント還元を考慮するか
  qualityPriority: string;          // 通信品質の重視度
  carrierType: string;              // 希望キャリア種別
  supportPreference: string;        // サポート体制（←追加）
  contractLockPreference: string;   // 契約期間・解約金の重視度（←追加）
  ecosystemUse: string;             // 経済圏利用
  dataUsage: string;                // データ容量
  callFrequency: string;            // 通話頻度
  familyDiscount: string;           // 家族割
  bundleDiscount: string;           // セット割
};
