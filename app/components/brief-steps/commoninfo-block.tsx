"use client";

import React, { useEffect } from "react";
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
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import BriefBlockMain from "@/components/ui/brief-block-main";
import { useBriefStore } from "@/lib/store/briefStore";

interface CommonInfoBlockProps {
  onNext: (data: CommonFormValues) => void;
}

const CommonInfoBlock: React.FC<CommonInfoBlockProps> = ({ onNext }) => {
  const { commonData, setCommonData } = useBriefStore();
  
  const form = useForm<CommonFormValues>({
    resolver: zodResolver(CommonDataSchema),
    defaultValues: {
      clientName: commonData?.clientName || "",
      clientSurname: commonData?.clientSurname || "",
      email: commonData?.email || "",
      phone: commonData?.phone || "",
      address: commonData?.address || "",
      area: commonData?.area || 0,
      contractNumber: commonData?.contractNumber || "",
      startDate: commonData?.startDate || new Date().toISOString().split("T")[0],
    },
  });

  // Обновляем форму при изменении данных в store
  useEffect(() => {
    if (commonData) {
      form.reset({
        clientName: commonData.clientName || "",
        clientSurname: commonData.clientSurname || "",
        email: commonData.email || "",
        phone: commonData.phone || "",
        address: commonData.address || "",
        area: commonData.area || 0,
        contractNumber: commonData.contractNumber || "",
        startDate: commonData.startDate || new Date().toISOString().split("T")[0],
      });
    }
 }, [commonData, form]);

  const handleSubmit = (data: CommonFormValues) => {
    try {
      // Обновляем данные в store
      setCommonData(data);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
        <BriefBlockMain title="Общая информация">
          <FormBlock title="Клиент">
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
          </FormBlock>
          <FormBlock title="Объект">
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        type="number"
                        step="1"
                        min="0"
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

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="//w-full">
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
          </FormBlock>
          <BottomButtonBlock />
        </BriefBlockMain>
      </form>
    </Form>
  );
};

export default CommonInfoBlock;
