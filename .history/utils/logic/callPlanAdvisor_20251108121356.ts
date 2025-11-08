import { DiagnosisAnswers } from "@/types/types";

/**
 * 📞 通話傾向からおすすめのかけ放題タイプを提案する
 * ---------------------------------------------------
 * Phase2 CallSection 用の補助ロジック。
 * 通話時間・頻度から最適な「時間制限型 / 月間制限型 / ハイブリッド / 無制限」を推定。
 * Markdown 形式でUIに出力可能。
 */
export function suggestCallPlan(answers: DiagnosisAnswers): string {
  // ✅ ID対応（Phase2設計統一済）
  const duration =
    answers.callDuration ||
    answers.unknownCallUsageDuration ||
    "";
  const freq =
    answers.callFrequencyPerWeek ||
    answers.unknownCallFrequency ||
    "";

  if (!duration || !freq) {
    return "⚠️ 通話傾向の情報が不足しているため、アドバイスを表示できません。";
  }

  let totalMinutes = "";
  let recommendation = "";
  let reason = "";

  // ================================
  // 🟩 5分以内
  // ================================
  if (duration.includes("5") && duration.includes("分")) {
    if (freq.includes("1") || freq.includes("2")) {
      totalMinutes = "約20〜30分／月";
      recommendation =
        "従量課金（かけ放題なし）・5分 or 10分定額（時間制限型）・月間60〜70分定額（月間制限型）・10分×30回（ハイブリッド型）";
      reason =
        "通話が少ないため基本は「かけ放題なし」。短時間通話が定期的にある場合や今後増える可能性がある場合は、時間制限・月間・ハイブリッド型も比較候補として有効です。";
    } else if (freq.includes("3") || freq.includes("4")) {
      totalMinutes = "約60〜70分／月";
      recommendation =
        "5分 or 10分定額（時間制限型）・月間60〜70分定額（月間制限型）・10分×30回（ハイブリッド型）";
      reason =
        "通話頻度が増え、月間通話時間も中程度。短時間定額を基本に、月間やハイブリッド型を組み合わせて検討するのが現実的です。";
    } else if (freq.includes("5") || freq.includes("6")) {
      totalMinutes = "約90〜100分／月";
      recommendation =
        "5分 or 10分定額（時間制限型）・10分×30〜50回（ハイブリッド型）";
      reason =
        "頻度が高く、通話合計も多くなる層。短時間通話が中心でも、ハイブリッド型を加えることでコスト効率を維持できます。";
    } else if (freq.includes("毎日")) {
      totalMinutes = "約120〜150分／月";
      recommendation =
        "5分 or 10分定額（時間制限型）・10分×50回（ハイブリッド型）";
      reason =
        "毎日短時間通話を行う層。5〜10分定額をベースに、通話回数が多い場合はハイブリッド型の方が柔軟で効率的です。";
    }
  }

  // ================================
  // 🟨 15分以内
  // ================================
  else if (duration.includes("15")) {
    if (freq.includes("1") || freq.includes("2")) {
      totalMinutes = "約30〜40分／月";
      recommendation =
        "従量課金（かけ放題なし）・10分 or 15分定額（時間制限型）・月間60〜100分定額（月間制限型）・10分×30回（ハイブリッド型）";
      reason =
        "通話回数は少ないため基本はかけ放題なしが最適。ただし1回が長めな傾向がある場合、時間制限・月間・ハイブリッド型も比較対象として有効です。";
    } else if (freq.includes("3") || freq.includes("4")) {
      totalMinutes = "約70〜90分／月";
      recommendation =
        "10分 or 15分定額（時間制限型）・月間60〜100分定額（月間制限型）・10分×30回（ハイブリッド型）";
      reason =
        "通話頻度・時間とも中程度。15分定額を軸に、月間制限やハイブリッド型を組み合わせて比較するのがおすすめです。";
    } else if (freq.includes("5") || freq.includes("6")) {
      totalMinutes = "約100〜130分／月";
      recommendation =
        "10分 or 15分定額（時間制限型）・10分×30〜50回（ハイブリッド型）";
      reason =
        "頻繁に中程度の通話を行う層。10〜15分定額で大半をカバー可能ですが、回数が多ければハイブリッド型も効果的です。";
    } else if (freq.includes("毎日")) {
      totalMinutes = "約150〜180分／月";
      recommendation =
        "10分 or 15分定額（時間制限型）・10分×50回（ハイブリッド型）・無制限かけ放題（時間制限なし）";
      reason =
        "毎日通話する層。ハイブリッド上位や無制限かけ放題を含め、通話量に応じた選択が望ましいです。";
    }
  }

  // ================================
  // 🟧 30分以内
  // ================================
  else if (duration.includes("30")) {
    if (freq.includes("1") || freq.includes("2")) {
      totalMinutes = "約60〜80分／月";
      recommendation =
        "従量課金（かけ放題なし）・30分定額（時間制限型）・月間60〜100分定額（月間制限型）";
      reason =
        "通話回数は少ないが、1回の通話が長い傾向。基本は従量課金で十分だが、30分通話が頻発する場合は時間制限・月間定額も検討対象です。";
    } else if (freq.includes("3") || freq.includes("4")) {
      totalMinutes = "約120〜150分／月";
      recommendation =
        "30分定額（時間制限型）・無制限かけ放題（時間制限なし）";
      reason =
        "通話時間・頻度とも多くなる層。30分定額を基本に、通話時間がさらに長くなりがちな人は無制限も検討。";
    } else if (freq.includes("5") || freq.includes("6") || freq.includes("毎日")) {
      totalMinutes = "約150〜240分／月";
      recommendation =
        "30分定額（時間制限型）・無制限かけ放題（時間制限なし）";
      reason =
        "長めの通話を頻繁に行う層。30分定額では足りないケースも多く、無制限が現実的です。";
    }
  }

  // ================================
  // 🔴 30分以上
  // ================================
  else if (duration.includes("30分以上") || duration.includes("over")) {
    if (freq.includes("1") || freq.includes("2")) {
      totalMinutes = "約90〜120分／月";
      recommendation =
        "無制限かけ放題（時間制限なし）・月間100分定額（月間制限型）";
      reason =
        "通話頻度は低いが1回が非常に長く、合計100分を超えることも。無制限が基本だが、頻度が少なければ月間100分定額も現実的。";
    } else {
      totalMinutes = "約180〜400分／月";
      recommendation = "無制限かけ放題（時間制限なし）";
      reason =
        "長時間通話が頻発する層。時間制限付きでは対応不可能で、無制限プラン一択です。";
    }
  }

  if (!recommendation) {
    return "📞 通話傾向に合致するプランが見つかりませんでした。";
  }

  // 🎨 Markdown整形で返却
  return `
🕒 **想定月間通話時間**  
→ ${totalMinutes}

📋 **おすすめプランタイプ**  
→ ${recommendation}

💬 **アドバイス**  
${reason}
`;
}
