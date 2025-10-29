"use client";

import React from "react";
import { useState } from "react";
import CommonInfoBlock from "./brief-steps/commoninfo-block";
import { PDFDownloadLink, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";
import {
  CommonFormValues,
  ConstructionFormValues,
  DemolitionType,
  EquipmentBlockFormValues,
  PremisesFormValues,
  ResidentsFormValues,
} from "@/lib/schemas";
import ResidentsBlock from "./brief-steps/residents-block";
import PremisesBlock from "./brief-steps/premises-block";
import DemolitionBlock from "./brief-steps/demolition-block";
import ConstructionInfoBlock from "./brief-steps/constructioninfo-block";
import EquipmentBlock from "./brief-steps/equipment-block";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";

const BriefMain: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [commonData, setCommonData] = useState<CommonFormValues | null>(null);
  const [residentsData, setResidentsData] =
    useState<ResidentsFormValues | null>(null);
  const [premisesData, setPremisesData] = useState<PremisesFormValues>({
    rooms: [],
  });
  const [demolitionData, setDemolitionData] = useState<DemolitionType>();
  const [constructionData, setConstructionData] =
    useState<ConstructionFormValues | null>(null);
  const [equipmentData, setEquipmentData] =
    useState<EquipmentBlockFormValues | null>(null);

  const handleNext = (
    data:
      | CommonFormValues
      | ResidentsFormValues
      | PremisesFormValues
      | DemolitionType
      | ConstructionFormValues
      | EquipmentBlockFormValues
  ) => {
    if (step === 1) {
      setCommonData(data as CommonFormValues);
    } else if (step === 2) {
      setResidentsData(data as ResidentsFormValues);
    } else if (step === 3) {
      setPremisesData(data as PremisesFormValues);
    } else if (step === 4) {
      setDemolitionData(data as DemolitionType);
    } else if (step === 5) {
      setConstructionData(data as ConstructionFormValues);
    } else if (step === 6) {
      setEquipmentData(data as EquipmentBlockFormValues);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const styles = StyleSheet.create({
    downloadButton: {
      backgroundColor: "tomato",
      width: "100%",
      textAlign: "center",
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
    <>
      <ProgressBar step={step} totalSteps={6} />
      {step === 1 && <CommonInfoBlock onNext={handleNext} />}
      {step === 2 && <ResidentsBlock onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <PremisesBlock onNext={handleNext} onBack={handleBack} />}
      {step === 4 && (
        <DemolitionBlock onNext={handleNext} onBack={handleBack} />
      )}
      {step === 5 && (
        <ConstructionInfoBlock onNext={handleNext} onBack={handleBack} />
      )}
      {step === 6 && <EquipmentBlock onNext={handleNext} onBack={handleBack} />}
      {/* Add other steps here */}
      {step > 6 &&
        commonData &&
        residentsData &&
        premisesData &&
        demolitionData && (
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">
              Вы успешно заполнили техниеское задание на разработку
              дизайн-проекта.
            </h3>
            <p>Вы можете скачать документ в PDF формате.</p>
            <small className="pb-20">
              Информация сохранена на вашем устройстве и будет доступна при
              следующем посещении.
            </small>
            <PDFDownloadLink
              style={styles.downloadButton}
              document={
                <PDFDocument
                  commonData={commonData}
                  residentsData={residentsData || undefined}
                  premisesData={premisesData || undefined}
                  constructionData={constructionData || undefined}
                  demolitionData={demolitionData || undefined}
                  equipmentData={equipmentData || undefined}
                />
              }
              fileName={`brief_${commonData.clientSurname}_${
                new Date().toISOString().split("T")[0]
              }.pdf`}
            >
              {({ loading }) => (
                <>
                {/* <Button className="flex-1 sm:flex-none" disabled={loading}> */}
                  {loading ? "Подготовка документа..." : "Скачать PDF"}
                {/* </Button> */}
                </>
              )}
            </PDFDownloadLink>
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="flex-1 sm:flex-none"
            >
              Начать заново
            </Button>

            {/* Temp PDF prewiew */}
            <PDFViewer style={{ width: "100%", height: "500px" }}>
              <PDFDocument
                commonData={commonData}
                residentsData={residentsData || undefined}
                premisesData={premisesData || undefined}
                constructionData={constructionData || undefined}
                demolitionData={demolitionData || undefined}
                equipmentData={equipmentData || undefined}
              />
            </PDFViewer>
          </div>
        )}
    </>
  );
};

export default BriefMain;
