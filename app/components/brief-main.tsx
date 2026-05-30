"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import confetti from "canvas-confetti";
import CommonInfoBlock from "./brief-steps/commoninfo-block";
import { PDFDownloadLink, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import PDFDocument from "./PDFDocument";
import ResidentsBlock from "./brief-steps/residents-block";
import PremisesBlock from "./brief-steps/premises-block";
import DemolitionBlock from "./brief-steps/demolition-block";
import ConstructionInfoBlock from "./brief-steps/constructioninfo-block";
import EquipmentBlock from "./brief-steps/equipment-block";
import EngineeringBlock from './brief-steps/engineering-block';
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { useBriefStore } from "@/lib/store/briefStore";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from 'lucide-react';

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

  useEffect(() => {
    if (step > 7 && isHydrated) {
      const duration = 3 * 1000; // Анимация длится 3 секунды
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 100,
      };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Запускаем конфетти с двух сторон экрана (имитация хлопушек)
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      // Очистка интервала при размонтировании (если пользователь быстро уйдет со страницы)
      return () => clearInterval(interval);
    }
  }, [step, isHydrated]);

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
      paddingTop: 12,
      paddingBottom: 12,
      borderRadius: 50,
      fontWeight: "bold",
      alignSelf: "center",
    },
  });

  return (
    <>
      <ProgressBar step={step} />
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
      {step === 7 && (
        <EngineeringBlock onNext={handleNext} onBack={handleBack} />
      )}
      {/* Add other steps here */}
      {step > 7 &&
        store.commonData &&
        store.residentsData &&
        store.premisesData &&
        store.demolitionData && (
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-12 px-4 animate-in fade-in zoom-in duration-500">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-sm border border-green-200">
              <CheckCircle2 className="size-12 text-green-600" />
            </div>
            <h2 className="m-3 text-2xl text-balance font-extrabold tracking-tight text-foreground">
              Отличная работа! ТЗ готово.
            </h2>
            <p className="mb-8 text-sm text-muted-foreground text-balance">
              Вы успешно заполнили все разделы. Вы можете скачать документ в PDF
              формате.
            </p>

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
                  engineeringData={store.engineeringData || undefined}
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
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="rounded-full w-full mt-4"
            >
              Начать заново
            </Button>
            <small className="p-4 leading-4 text-muted-foreground">
              Информация сохранена на вашем устройстве и будет доступна при
              следующем посещении.
            </small>
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
                engineeringData={store.engineeringData || undefined}
              />
            </PDFViewer>
          </div>
        )}
    </>
  );
};

export default BriefMain;
