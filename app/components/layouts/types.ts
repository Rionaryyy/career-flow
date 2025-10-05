// app/components/layouts/types.ts
export interface Question<T> {
  id: keyof T;
  question: string;
  type: "checkbox" | "radio";
  options: string[];
  condition?: (answers: T) => boolean;
  section?: string; // ← 追加
}
