import { DiagnosisAnswers } from "@/types/types";

export interface FlowSectionProps {
  answers: DiagnosisAnswers;
  onChange: (updated: Partial<DiagnosisAnswers>) => void;
  onNext?: () => void;
  onBack?: () => void;
  // ✅ BasicConditions 用に optional プロパティを追加
  defaultValues?: DiagnosisAnswers;
  onSubmit?: (updated: DiagnosisAnswers) => void;
}
