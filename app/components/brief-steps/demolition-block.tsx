"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DemolitionSchema, DemolitionType } from "@/lib/schemas";
import FormBlock from "@/components/ui/formblock";
import BottomButtonBlock from '@/components/ui/bottom-button-block';
import BriefBlockMain from '@/components/ui/brief-block-main';

interface DemolitionBlockProps {
  onNext: (data: DemolitionType) => void;
  onBack: () => void;
}

const DemolitionBlock: React.FC<DemolitionBlockProps> = ({
  onNext,
  onBack,
}) => {
  const form = useForm<DemolitionType>({
    resolver: zodResolver(DemolitionSchema),
    defaultValues: {
      planChange: false,
      entranceDoorChange: false,
      furnitureDemolition: false,
      windowsChange: false,
    },
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("demolitionData");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  function onSubmit(data: DemolitionType) {
    try {
      // Save data to localStorage
      localStorage.setItem("demolitionData", JSON.stringify(data));
      toast.success("Информация по демонтажу сохранена");
      // Move to the next step
      onNext(data);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col justify-between"
      >
        <BriefBlockMain title="Информация по демонтажу">
          <FormBlock title="">
            <FormField
              control={form.control}
              name="planChange"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>Демонтаж перегородок</FormLabel>
                  <FormControl>
                    <Switch
                      className="!m-0"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("planChange") && (
              <FormField
                control={form.control}
                name="planChangeInfo"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormControl>
                      <Textarea
                        placeholder="Подробная информация по необходимому демонтажу."
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                    Подробная информация по необходимому демонтажу.
                  </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </FormBlock>
          <FormBlock title="">
            <FormField
              control={form.control}
              name="entranceDoorChange"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>Замена входной двери</FormLabel>
                  <FormControl>
                    <Switch
                      className="!m-0"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("entranceDoorChange") && (
              <FormField
                control={form.control}
                name="enteranceDoorType"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormControl>
                      <Textarea
                        placeholder="Предпочтительный тип входной двери. Более подробное
                    описание."
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                    Предпочтительный тип входной двери. Более подробное
                    описание.
                  </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </FormBlock>
          <FormBlock title="">
            <FormField
              control={form.control}
              name="windowsChange"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>Замена окон</FormLabel>
                  <FormControl>
                    <Switch
                      className="!m-0"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("windowsChange") && (
              <FormField
                control={form.control}
                name="windowsType"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormControl>
                      <Textarea
                        placeholder=" Предпочтительный тип окон. Более подробное описание."
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                    Предпочтительный тип окон. Более подробное описание.
                  </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </FormBlock>
          <FormBlock title="">
            <FormField
              control={form.control}
              name="furnitureDemolition"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>Демонтаж встроенной мебели</FormLabel>
                  <FormControl>
                    <Switch
                      className="!m-0"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch("furnitureDemolition") && (
              <FormField
                control={form.control}
                // TODO Change pets
                name="furnitureToDemolish"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormControl>
                      <Textarea
                        placeholder="Описание демонтируемой мебели."
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>
                    Описание демонтируемой мебели.
                  </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </FormBlock>
        </BriefBlockMain>
        {/* Кнопка */}
        <BottomButtonBlock onBack={onBack}/>
      </form>
    </Form>
  );
};

export default DemolitionBlock;
