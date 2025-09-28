"use client";
import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Result from "./Result";
import Start from "./Start";
import { DiagnosisAnswers } from "@/types/types";

export default function DiagnosisFlow() {
  const [step, setStep] = useState<"start" | "phase1" | "phase2" | "result">("start");

  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    phase1: {
      includePoints: null,
      networkQuality: null,
      carrierType: null,
      supportPreference: null,
      contractLockPreference: null,
    },
    phase2: {
      dataUsage: null,
      speedLimitImportance: null,
      tetheringNeeded: null,
      tetheringUsage: null,
      callFrequency: null,
      callPriority: null,
      callOptionsNeeded: null,
      callPurpose: null,
      familyLines: null,
      setDiscount: null,
      infraSet: null,
      ecosystem: null,
      ecosystemMonthly: null,
      subs: null,
      subsDiscountPreference: null,
      buyingDevice: null,
      devicePurchaseMethods: null,
      overseasUse: null,
      overseasPreference: null,
      dualSim: null,
      specialUses: null,
      paymentMethods: null,
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      {step === "start" && <Start onNext={() => setStep("phase1")} />}

      {step === "phase1" && (
        <Phase1
          answers={answers.phase1}
          setAnswers={(updater) =>
            setAnswers((prev) => ({
              ...prev,
              phase1:
                typeof updater === "function"
                  ? (updater as any)(prev.phase1)
                  : updater,
            }))
          }
          onNext={() => setStep("phase2")}
          onBack={() => setStep("start")}
        />
      )}

      {step === "phase2" && (
        <Phase2
          answers={answers.phase2}
          setAnswers={(updater) =>
            setAnswers((prev) => ({
              ...prev,
              phase2:
                typeof updater === "function"
                  ? (updater as any)(prev.phase2)
                  : updater,
            }))
          }
          onNext={() => setStep("result")}
          onBack={() => setStep("phase1")}
        />
      )}

      {step === "result" && (
        <Result
          answers={answers}
          onRestart={() => {
            setAnswers({
              phase1: {
                includePoints: null,
                networkQuality: null,
                carrierType: null,
                supportPreference: null,
                contractLockPreference: null,
              },
              phase2: {
                dataUsage: null,
                speedLimitImportance: null,
                tetheringNeeded: null,
                tetheringUsage: null,
                callFrequency: null,
                callPriority: null,
                callOptionsNeeded: null,
                callPurpose: null,
                familyLines: null,
                setDiscount: null,
                infraSet: null,
                ecosystem: null,
                ecosystemMonthly: null,
                subs: null,
                subsDiscountPreference: null,
                buyingDevice: null,
                devicePurchaseMethods: null,
                overseasUse: null,
                overseasPreference: null,
                dualSim: null,
                specialUses: null,
                paymentMethods: null,
              },
            });
            setStep("start");
          }}
        />
      )}
    </div>
  );
}
