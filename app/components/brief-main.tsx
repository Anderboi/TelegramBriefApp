"use client";

import React from "react";
import { useState } from "react";
import useFormData from "../hooks/useFormData";
import generatePDF from "../utils/generatePDF";
import StepOne from "./brief-steps/step-one";
import { Button } from "@/components/ui/button";

const BriefMain: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useFormData("formData", {});

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const handleGeneratePDF = () => {
    generatePDF(formData);
  };

  return (
    <div className="w-100 p-6 shadow-xl rounded-2xl">
      {step === 1 && <StepOne onNext={handleNext} />}
      {/* Add other steps here */}
      {step > 1 && (
        <div>
          <Button className="">Начать заново</Button>
          <Button onClick={handleGeneratePDF}>Сгенерировать PDF</Button>
        </div>
      )}
    </div>
  );
};

export default BriefMain;
