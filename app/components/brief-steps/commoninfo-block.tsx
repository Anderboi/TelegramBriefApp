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
import { CommonDataSchema, CommonFormValues } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import FormBlock from "@/components/ui/formblock";
import { toast } from "sonner";

interface CommonInfoBlockProps {
  onNext: (data: CommonFormValues) => void;
}

const CommonInfoBlock: React.FC<CommonInfoBlockProps> = ({ onNext }) => {
  // const [data, setData] = useState<Record<string, string>>({});

  const form = useForm<CommonFormValues>({
    resolver: zodResolver(CommonDataSchema),
    defaultValues: {
      clientName: "",
      clientSurname: "",
      email: "",
      phone: "",
      address: "",
      area: 0,
      contractNumber: "",
      startDate: new Date().toLocaleDateString(),
    },
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("commonInfoBlockData");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  const handleSubmit = (data: CommonFormValues) => {
    console.log(data);
    try {
      // Save data to localStorage
      localStorage.setItem("commonInfoBlockData", JSON.stringify(data));
      toast.success("Общая информация по объекту заполнена");
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
          <div className="flex items-end space-x-2">
            <FormField
              name="clientName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
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
            <FormField
              name="clientSurname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
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
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Эл. почта</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onFocus={(e) => e.target.select()}
                    type="email"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер телефона</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onFocus={(e) => e.target.select()}
                    type="tel"
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
          <div className="flex items-end space-x-4">
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
                      // value={
                      //   field.value &&
                      //   new Date(field.value).toISOString().split("T")[0]
                      // }
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

export default CommonInfoBlock;
