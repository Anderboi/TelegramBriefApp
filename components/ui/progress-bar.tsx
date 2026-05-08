"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from './button';

const steps = [
  { id: 1, label: "Общая" },
  { id: 2, label: "Жильцы" },
  { id: 3, label: "Помещения" },
  { id: 4, label: "Демонтаж" },
  { id: 5, label: "Монтаж" },
  { id: 6, label: "Наполнение" },
];

export const ProgressBar = ({
  step,
  
}: {
  step: number;
}) => {
  const router = useRouter();

  const handleStepClick = (targetStep: number) => {
    // UX практика: позволяем кликать только на пройденные шаги или на один вперед
    if (targetStep <= step + 1) {
      router.push(`?step=${targetStep}`);
    }
  };
  
  return (
    <>
      <nav aria-label="Progress" className="w-full mb-4 md:mb-8">
        <ol className="flex items-center w-full md:gap-2">
          {steps.map((s, idx) => {
            const isCompleted = s.id < step;
            const isActive = s.id === step;
            return (
              <li
                key={s.id}
                className={cn(
                  "relative flex items-center ",
                  idx !== steps.length - 1 ? "w-full" : "",
                )}
              >
                {/* Круг шага */}
                <Button
                  size={"icon"}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => handleStepClick(s.id)}
                  className={cn(
                    "relative cursor-pointer z-10 flex //h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-200",
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : isActive
                        ? "border-primary bg-white text-primary ring-4 ring-primary/10 hover:bg-gray-100"
                        : "border-gray-300 bg-white text-gray-500 hover:border-gray-400",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6 stroke-[3]" />
                  ) : (
                    <span className="text-sm font-bold">{s.id}</span>
                  )}

                  {/* Подпись (Адаптивная) */}
                  <span
                    className={cn(
                      "absolute -bottom-7 w-max text-[14px] sm:text-xs font-medium transition-colors",
                      isActive ? "text-primary font-bold" : "text-gray-400",
                      // На мобилках скрываем все подписи, кроме активной, если мало места
                      "hidden sm:block",
                    )}
                  >
                    {s.label}
                  </span>
                </Button>

                {/* Линия-соединитель */}
                {idx !== steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute  left-[50%] top-1/2 -z-10 h-[3px] w-full -translate-y-1/2 transition-colors duration-500 rounded-full",
                      isCompleted ? "bg-primary" : "bg-gray-400",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {/* <div
        className="progress-bar-container flex w-full mb-5"
        // style={{ display: "flex", marginBottom: 20 }}
      >
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: 8,
              marginRight: index < totalSteps - 1 ? 8 : 0,
              borderRadius: 4,
              backgroundColor: index + 1 <= step ? "#242831" : "#e0e0e0",
              transition: "background-color 0.3s ease",
            }}
            title={`Шаг ${index + 1}`}
          />
        ))}
      </div> */}
    </>
  );
};
