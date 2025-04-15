"use client";

import React from "react";
import { useState } from "react";
import useFormData from "../hooks/useFormData";
import generatePDF from "../utils/generatePDF";
import StepOne from "./step-one";

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
    <div>
      {step === 1 && <StepOne onNext={handleNext} />}
      {/* Add other steps here */}
      {step > 1 && (
        <div>
          <button className="">Начать заново</button>
          <button onClick={handleGeneratePDF}>Сгенерировать PDF</button>
        </div>
      )}
    </div>
  );
};

export default BriefMain;
