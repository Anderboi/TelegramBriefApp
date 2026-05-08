"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import CommonInfoBlock from "./brief-steps/commoninfo-block";
import { PDFDownloadLink, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";
import ResidentsBlock from "./brief-steps/residents-block";
import PremisesBlock from "./brief-steps/premises-block";
import DemolitionBlock from "./brief-steps/demolition-block";
import ConstructionInfoBlock from "./brief-steps/constructioninfo-block";
import EquipmentBlock from "./brief-steps/equipment-block";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { useBriefStore } from "@/lib/store/briefStore";
import { useRouter, useSearchParams } from "next/navigation";

const BriefMain: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Читаем текущий шаг из URL (по умолчанию 1)
  const stepParam = searchParams.get("step");
  const step = stepParam ? parseInt(stepParam, 10) : 1;

  const [isHydrated, setIsHydrated] = useState(false);

  const store = useBriefStore();

  // Решение проблемы Hydration Mismatch в Next.js
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleNext = (data?: any) => {
    router.push(`?step=${step + 1}`);
  };

  const handleBack = () => {
    router.push(`?step=${step - 1}`);
  };

  const handleReset = () => {
    // Вызов функции очистки (убедитесь, что resetBrief есть в вашем store)
    if (store.resetBrief) {
      store.resetBrief();
    }
    router.push("?step=1");
  };

  // Пока хранилище не загрузилось из localStorage (на клиенте), не рендерим форму,
  // чтобы избежать ошибок гидратации Next.js
  if (!isHydrated) {
    return null; // или лоадер <div className="spinner">Загрузка...</div>
  }

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
        store.commonData &&
        store.residentsData &&
        store.premisesData &&
        store.demolitionData && (
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
                  commonData={store.commonData}
                  residentsData={store.residentsData || undefined}
                  premisesData={store.premisesData || undefined}
                  constructionData={store.constructionData || undefined}
                  demolitionData={store.demolitionData || undefined}
                  equipmentData={store.equipmentData || undefined}
                />
              }
              fileName={`brief_${store.commonData.clientSurname}_${
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
              onClick={handleReset}
              className="flex-1 sm:flex-none"
            >
              Начать заново
            </Button>

            {/* Temp PDF prewiew */}
            <PDFViewer
              style={{ width: "100%", height: "500px" }}
              className="hidden md:block"
            >
              <PDFDocument
                commonData={store.commonData}
                residentsData={store.residentsData || undefined}
                premisesData={store.premisesData || undefined}
                constructionData={store.constructionData || undefined}
                demolitionData={store.demolitionData || undefined}
                equipmentData={store.equipmentData || undefined}
              />
            </PDFViewer>
          </div>
        )}
    </>
  );
};

export default BriefMain;
