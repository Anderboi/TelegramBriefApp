"use client";

import React from "react";
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
import { MaskedPhoneInput } from '@/components/ui/phone-input';

interface CommonInfoBlockProps {
  onNext: () => void;
}

const CommonInfoBlock: React.FC<CommonInfoBlockProps> = ({ onNext }) => {
  const { commonData, setCommonData } = useBriefStore();

  const form = useForm<CommonFormValues>({
    resolver: zodResolver(CommonDataSchema),
    mode:"onBlur",
    defaultValues: commonData || {
      clientName: "",
      clientSurname: "",
      clientPatronymic: "",
      email: "",
      phone: "+7",
      address: "",
      area: 0,
      contractNumber: "",
      startDate: new Date().toISOString().split("T")[0],
    },
  });

  const handleSubmit = (data: CommonFormValues) => {
    try {
      // Обновляем данные в store
      setCommonData(data);
      toast.success("Общая информация по объекту заполнена");
      // Move to the next step
      onNext();
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
              name="clientSurname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия*</FormLabel>
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
              name="clientName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя*</FormLabel>
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
              name="clientPatronymic"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отчество</FormLabel>
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
                  <FormLabel>Эл. почта*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={(e) => e.target.select()}
                      type="email"
                      inputMode="email"
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
                  <FormLabel>Номер телефона*</FormLabel>
                  <FormControl>
                    <MaskedPhoneInput {...field}/>
                    {/* <Input
                      {...field}
                      onFocus={(e) => e.target.select()}
                      type="tel"
                      inputMode="tel"
                    /> */}
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
                  <FormLabel>Адрес*</FormLabel>
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
                    <FormLabel>Площадь*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        type="number"
                        inputMode="numeric"
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
