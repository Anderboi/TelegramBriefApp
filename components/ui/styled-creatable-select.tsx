'use client';

import React, { useEffect, useState } from "react";
import { ClassNamesConfig } from "react-select";
import CreatableSelect, { CreatableProps } from "react-select/creatable";
import { cn } from '@/lib/utils';

interface StyledSelectOption {
  label: string;
  value: string;
}

type StyledSelectProps = Omit<
  CreatableProps<StyledSelectOption, false, any>,
  "onChange" | "value" | "options"
> & {
  options: StyledSelectOption[];
  value?: StyledSelectOption | null;
  placeholder?: string;
  isCreatable?: boolean;
  onChange?: (selectedValue: string | null) => void;
  onCreateOption?: (newOption: string) => void;
  createOptionPosition?: "first" | "last";
};

const classNamesStyled: ClassNamesConfig<StyledSelectOption, false, any> = {
  control: () =>
    "h-9 border px-2 !rounded-md border-red-300 !border-neutral-200 !focused:border-neutral-500 !focused:ring-neutral-500 dark:bg-neutral-900 dark:!text-neutral-50 dark:!border-neutral-600",
  input: () => "text-base sm:text-base dark:text-neutral-200",
  singleValue: () => "dark:text-neutral-50",
  placeholder: () => "dark:text-neutral-500",
  menu: () =>
    "z-[9999] !bg-white mt-1 border border-neutral-200 shadow-xl rounded-md dark:text-neutral-50 dark:!bg-neutral-800",
  menuList: () => "p-1",
  option: (state) =>
    cn(
      "px-3 py-2 rounded-sm text-sm cursor-pointer transition-colors",
      state.isFocused ? "bg-neutral-100 dark:bg-neutral-700" : "",
      state.isSelected
        ? "bg-primary text-white"
        : "text-neutral-900 dark:text-neutral-100",
    ),
  menuPortal: () => "dark:text-neutral-50 dark:!bg-neutral-800",
};

const StyledSelect: React.FC<StyledSelectProps> = ({
  options,
  value,
  placeholder = "Выбрать...",
  isCreatable = true,
  onChange,
  onCreateOption,
  createOptionPosition = "last",
  ...rest
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  return (
    <CreatableSelect
      options={options}
      value={options.find((option) => option.value === value?.value) || null}
      isSearchable
      isClearable={isCreatable}
      placeholder={placeholder}
      onChange={(selectedOption) => onChange?.(selectedOption?.value || null)}
      onCreateOption={onCreateOption}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      classNames={classNamesStyled}
      formatCreateLabel={(value) => `Создать '${value}'`}
      createOptionPosition={createOptionPosition}
      blurInputOnSelect
      menuPlacement="auto"
      menuPosition="fixed"
      unstyled
      menuPortalTarget={mounted ? document.body : null}
      {...rest}
    />
  );
};

export default StyledSelect;
