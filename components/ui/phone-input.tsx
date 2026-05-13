"use client";

import React, { forwardRef } from "react";
import PhoneInput from "react-phone-number-input/input";
import { Input } from "@/components/ui/input"; // Путь до вашего shadcn компонента Input

export interface MaskedPhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  value?: string;
  onChange: (value?: string) => void;
}

export const MaskedPhoneInput = forwardRef<HTMLInputElement, MaskedPhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    return (
      <PhoneInput
        {...props}
        ref={ref}
        value={value}
        onChange={onChange}
        defaultCountry="RU" // Автоматически применяет маску +7 (999) 999-99-99
        inputComponent={Input} // Рендерим через shadcn для сохранения UI-дизайна
        placeholder="+7 (999) 999-99-99"
        className={className}
      />
    );
  },
);

MaskedPhoneInput.displayName = "MaskedPhoneInput";
