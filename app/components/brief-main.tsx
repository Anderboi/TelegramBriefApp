"use client";

import React from "react";
import { useState } from "react";
import StepOne from "./brief-steps/step-one";
import { PDFDownloadLink, StyleSheet } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";
import { CommonDataType, ResidentsFormValues } from "@/lib/schemas";
import ResidentsBlock from "./brief-steps/residents-block";

const BriefMain: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [commonData, setCommonData] = useState<CommonDataType | null>(null);
  const [residentsData, setResidentsData] =
    useState<ResidentsFormValues | null>(null);

  const handleNext = (data: CommonDataType | ResidentsFormValues) => {
    if (step === 1) {
      setCommonData(data as CommonDataType);
    } else if (step === 2) {
      setResidentsData(data as ResidentsFormValues);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const styles = StyleSheet.create({
    downloadButton: {
      backgroundColor: "tomato",
      color: "white",
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: 8,
      fontWeight: "bold",
      alignSelf: "center",
    },
  });

  return (
    <div className="w-100 p-6 shadow-xl rounded-2xl">
      {step === 1 && <StepOne onNext={handleNext} />}
      {step === 2 && <ResidentsBlock onNext={handleNext} onBack={handleBack} />}
      {/* Add other steps here */}
      {step > 2 && commonData && residentsData && (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">
            Вы успешно заполнили техниеское задание на разработку
            дизайн-проекта.
          </h3>
          <p>Скачайте документ в PDF формате.</p>
          <small className="pb-20">
            Некоторое время информация в форме будет храниться у вас на
            устройстве.
          </small>
          <PDFDownloadLink
            style={styles.downloadButton}
            document={
              <PDFDocument data={commonData} residents={residentsData} />
            }
            fileName="project_brief.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? "Документ загрудается..." : "Скачать PDF"
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default BriefMain;
