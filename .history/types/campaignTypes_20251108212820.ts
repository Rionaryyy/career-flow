// types/campaignTypes.ts
export interface Campaign {
  id: string;
  campaignName: string;
  campaignId: string;
  carrier: string;
  targetPlanId: string; // カンマ区切り対応
  cashbackAmount: string;
  cashbackType: string;
  conditions: string;
  campaignDetails: string;
  displayName: string;
}
