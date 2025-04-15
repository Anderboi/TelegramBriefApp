"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { CommonDataSchema, CommonDataType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import FormBlock from "@/components/ui/formblock";
import { toast } from "sonner";

interface StepOneProps {
  onNext: (data: CommonDataType) => void;
}

const StepOne: React.FC<StepOneProps> = ({ onNext }) => {
  // const [data, setData] = useState<Record<string, string>>({});

  const form = useForm<CommonDataType>({
    resolver: zodResolver(CommonDataSchema),
    defaultValues: {
      address: "",
      area: 0,
      contractNumber: "",
    },
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("stepOneData");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  const handleSubmit = (data: CommonDataType) => {
    try {
      // Save data to localStorage
      localStorage.setItem("stepOneData", JSON.stringify(data));
      toast.success("Информация о проживающих заполнена");
      // Move to the next step
      onNext(data);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormBlock title="Общая информация">
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onFocus={(e) => e.target.select()}
                    type="address"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-end space-x-2">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Площадь</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={(e) => e.target.select()}
                      type="address"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-end space-x-2">
            <FormField
              control={form.control}
              name="contractNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Номер договора</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={(e) => e.target.select()}
                      type="text"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-end space-x-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Дата начала проекта</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value &&
                        new Date(field.value).toISOString().split("T")[0]
                      }
                      type="date"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="finalDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Дата окончания проекта</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      type="date"
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}
          </div>
        </FormBlock>
        <div className="flex justify-end">
          <Button type="submit">Далее</Button>
        </div>
      </form>
    </Form>
  );
};

export default StepOne;
