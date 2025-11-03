import { Campaign } from "@/types/planTypes";

export const campaigns: Campaign[] = [
  {
    campaignName: "他社から乗り換え（SIMのみ）MNPキャンペーン",
    campaignId: "time_5min",
    carrier: "ahamo（NTTドコモ系）",
    targetPlanIds: ["ahamo_sim_only"],
    cashbackAmount: 20000,
    cashbackType: "dポイント",
    conditions: ["MNP", "SIMのみ", "他社から乗り換え"],
    description:
      "他社からMNPで「SIMのみ」契約＋エントリーで、翌々月以降5ヶ月間に分けて合計20,000ポイント還元。端末購入を伴う契約は対象外（セレクトラ掲載）。",
  },
  {
    campaignName: "MNP／新規契約でPayPayポイントプレゼント",
    campaignId: "cp_linemomnp",
    carrier: "LINEMO（ソフトバンク系）",
    targetPlanIds: ["linemo_bestplan", "linemo_bestplanV"],
    cashbackAmount: 20000,
    cashbackType: "PayPayポイント",
    conditions: ["MNP", "新規契約"],
    description:
      "対象プラン契約でMNPなら20,000、新規なら10,000相当PayPayポイント付与。ソフトバンク・ワイモバイル等からの乗り換え除外。オンライン限定。",
  },
  {
    campaignName: "SIMのみMNPでau PAY残高還元キャンペーン",
    campaignId: "cp_uq_mnp",
    carrier: "UQ mobile（KDDI系）",
    targetPlanIds: ["uq_sim_only"],
    cashbackAmount: 20000,
    cashbackType: "au PAY残高",
    conditions: ["MNP", "SIMのみ", "増量オプションⅡ加入", "クーポン入力"],
    description:
      "SIMのみMNP＋増量オプションⅡ加入で最大20,000円相当au PAY残高還元。オンライン限定。時期により15,000円の場合もあり。",
  },
  {
    campaignName: "SIMのみ契約でPayPayポイントキャッシュバック",
    campaignId: "cp_ymobile_sim",
    carrier: "Y!mobile（ソフトバンク系）",
    targetPlanIds: ["ymobile_sim_only"],
    cashbackAmount: 20000,
    cashbackType: "PayPayポイント",
    conditions: [
      "他社MNP",
      "SIM／eSIM契約",
      "オンライン申込",
      "データ増量オプション加入",
    ],
    description:
      "他社回線からのMNPで最大20,000PayPayポイント還元。オンライン申込＋データ増量オプション契約必須。",
  },
  {
    campaignName: "新規契約・他社からの乗り換えでポイント還元",
    campaignId: "unlimited_call",
    carrier: "楽天モバイル",
    targetPlanIds: ["unlimited_call"],
    cashbackAmount: 20000,
    cashbackType: "楽天ポイント",
    conditions: ["新規契約", "MNP"],
    description:
      "新規またはMNPで初回契約時、最大14,000〜20,000ポイント還元。端末購入併用キャンペーンあり。ポイントは期間・用途限定。",
  },
  {
    campaignName: "新規・MNP契約・端末セットなど各種キャンペーン",
    campaignId: "monthly_60min",
    carrier: "ソフトバンク（大手キャリア）",
    targetPlanIds: ["sb_plan_various"],
    cashbackAmount: 43872,
    cashbackType: "割引",
    conditions: ["新規契約", "MNP", "端末セット"],
    description:
      "端末購入時の値引き型キャンペーン。対象機種で最大43,872円割引。フォネット掲載例あり。",
  },
  {
    campaignName: "新規契約／プラン変更で月額割引＋事務手数料無料",
    campaignId: "cp_mineo_discount",
    carrier: "mineo（MVNO）",
    targetPlanIds: ["mineo_dual_plans"],
    cashbackAmount: 3828,
    cashbackType: "月額割引",
    conditions: ["新規契約", "プラン変更"],
    description:
      "最大6ヶ月間638円割引（計3,828円）＋事務手数料無料。デュアルタイプ対象。2025年11月25日終了予定。",
  },
  {
    campaignName: "紹介キャンペーンで現金キャッシュバック",
    campaignId: "cp_qtmobile_referral",
    carrier: "QT mobile（MVNO）",
    targetPlanIds: ["qtmobile_referral"],
    cashbackAmount: 5000,
    cashbackType: "現金",
    conditions: ["紹介", "被紹介", "継続利用6ヶ月以上"],
    description:
      "紹介者・被紹介者双方に5,000円現金還元。6ヶ月以上継続利用必須。紹介数上限あり。",
  },
];
