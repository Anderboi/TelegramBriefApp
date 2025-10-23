"use client";

import React, {  useEffect } from "react";
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
import BottomButtonBlock from "@/components/ui/bottom-button-block";
import BriefBlockMain from "@/components/ui/brief-block-main";

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
    const storedData = localStorage.getItem("commonInfoBlockData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      form.setValue("clientName", parsedData.clientName);
      form.setValue("clientSurname", parsedData.clientSurname);
      form.setValue("email", parsedData.email);
      form.setValue("phone", parsedData.phone);
      form.setValue("address", parsedData.address);
      form.setValue("area", parsedData.area);
      form.setValue("contractNumber", parsedData.contractNumber);
      form.setValue("startDate", parsedData.startDate);
    }
  }, [form]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("commonInfoBlockData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
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
                  <FormItem className="//w-full">
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
                  <FormItem className="//w-full">
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
          <BottomButtonBlock/>
        </BriefBlockMain>
      </form>
    </Form>
  );
};

export default CommonInfoBlock;
