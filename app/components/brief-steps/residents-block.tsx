"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { ResidentsFormValues, ResidentsSchema } from "@/lib/schemas";
import { toast } from "sonner";
import FormBlock from "@/components/ui/formblock";
import { Switch } from "@/components/ui/switch";
import BottomButtonBlock from '@/components/ui/bottom-button-block';
import BriefBlockMain from '@/components/ui/brief-block-main';
import { useBriefStore } from "@/lib/store/briefStore";
import RemoveIconButton from '@/components/remove-icon-button';

interface ResidentsBlockProps {
  onNext: () => void;
  onBack: () => void;
}

const ResidentsBlock: React.FC<ResidentsBlockProps> = ({ onNext, onBack }) => {
  const { residentsData, setResidentsData } = useBriefStore();
  
  const form = useForm<ResidentsFormValues>({
    resolver: zodResolver(ResidentsSchema),
    mode: "onBlur",
    defaultValues: residentsData || {
      adults: [{ height: 0, gender: "" }],
      children: [],
      hasPets: false,
      petDetails: "",
      hobbies: "",
      healthIssues: "",
    },
  });

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  const {
    fields: adultFields,
    append: addAdult,
    remove: removeAdult,
  } = useFieldArray({
    control,
    name: "adults",
  });

  const {
    fields: childFields,
    append: addChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: "children",
  });

  const watchHasPets = watch("hasPets");

  function onSubmit(data: ResidentsFormValues) {
    try {
      // Save data to localStorage
      setResidentsData(data);
      toast.success("Информация о проживающих заполнена");
      // Move to the next step
      onNext();
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <BriefBlockMain title="Проживающие">
          {/* Взрослые */}
          <FormBlock title="Взрослые">
            <>
              {adultFields.map((block, index) => (
                <div key={block.id} className="flex items-end space-x-2">
                  <FormField
                    control={control}
                    name={`adults.${index}.height`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Рост</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            min={80}
                            max={280}
                            placeholder="Рост (см)"
                            type="number"
                            inputMode="numeric"
                            onFocus={(e) => e.target.select()}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`adults.${index}.gender`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Пол</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Пол" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Мужской</SelectItem>
                              <SelectItem value="female">Женский</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <RemoveIconButton onClick={() => removeAdult(index)} />
                </div>
              ))}
              <Button
                type="button"
                variant="default"
                className="w-full"
                onClick={() => addAdult({ height: 0, gender: "" })}
              >
                Добавить взрослого
              </Button>

              {errors.adults && (
                <p className="text-red-600">{errors.adults.message}</p>
              )}
            </>
          </FormBlock>

          {/* Дети */}
          <FormBlock title="Дети">
            {childFields.map((field, index) => (
              <div key={field.id} className="flex items-end space-x-2">
                <FormField
                  control={control}
                  name={`children.${index}.age`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Возраст</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          min={0}
                          max={18}
                          placeholder="Возраст"
                          type="number"
                          inputMode="numeric"
                          className="w-full"
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                          onFocus={(e) => e.target.select()}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <RemoveIconButton onClick={() => removeChild(index)} />
                
              </div>
            ))}
            <Button
              className="w-full"
              type="button"
              variant="default"
              onClick={() => addChild({ age: 0 })}
            >
              Добавить ребенка
            </Button>
          </FormBlock>

          {/* Увлечения */}
          <FormBlock title="Увлечения">
            <FormField
              control={control}
              name="hobbies"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Увлечения членов семьи, и что необходимо предусмотреть для них в новом интерьере?"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </FormBlock>

          {/* Ограничения по здоровью */}
          <FormBlock title="Ограничения по здоровью">
            <FormField
              control={control}
              name="healthIssues"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Ограничения по здоровью</FormLabel> */}
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Укажите ограничения по здоровью. Что может помешать вам жить в новом интерьере?"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </FormBlock>

          {/* Домашние животные */}
          <section className="space-y-4">
            <FormField
              control={control}
              name="hasPets"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Есть домашние животные?</FormLabel> */}
                  <FormControl>
                    <div className="flex items-center gap-4 px-4 pt-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm">Есть домашние животные?</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {watchHasPets && (
              <FormBlock title="Что предусмотреть для домашних животных?">
                <FormField
                  control={control}
                  name="petDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Опишите домашних животных и что необходимо предусмотреть для них."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FormBlock>
            )}
          </section>
        </BriefBlockMain>
        {/* Кнопка */}
        <BottomButtonBlock onBack={onBack} />
      </form>
    </Form>
  );
};

export default ResidentsBlock;
