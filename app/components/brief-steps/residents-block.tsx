"use client";

import React, { useEffect } from "react";
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
import { Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { ResidentsFormValues, ResidentsSchema } from "@/lib/schemas";
import { toast } from "sonner";
import FormBlock from "@/components/ui/formblock";
import { Switch } from "@/components/ui/switch";

interface ResidentsBlockProps {
  onNext: (data: ResidentsFormValues) => void;
  onBack: () => void;
}

const ResidentsBlock: React.FC<ResidentsBlockProps> = ({ onNext, onBack }) => {
  const form = useForm<ResidentsFormValues>({
    resolver: zodResolver(ResidentsSchema),
    defaultValues: {
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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("residentsData");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);

  function onSubmit(data: ResidentsFormValues) {
    try {
      // Save data to localStorage
      localStorage.setItem("residentsData", JSON.stringify(data));
      toast.success("Информация о проживающих заполнена");
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
        className="flex h-full flex-col justify-between"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-4 pb-8">
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
                            className="w-full"
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
                              <SelectItem value="man">Мужской</SelectItem>
                              <SelectItem value="woman">Женский</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    className="w-fit"
                    type="button"
                    onClick={() => removeAdult(index)}
                    variant="destructive"
                  >
                    <Trash2Icon size={20} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
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
              <div key={field.id} className="flex w-full items-end space-x-2">
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

                <Button
                  type="button"
                  onClick={() => removeChild(index)}
                  variant="destructive"
                >
                  <Trash2Icon size={20} />
                </Button>
              </div>
            ))}
            <Button
              className="w-full"
              type="button"
              variant="secondary"
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
                  {/* <FormLabel>Увлечения</FormLabel> */}
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
                    <div className="flex items-center gap-4">
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
        </div>
        {/* Кнопка */}
        <div className="flex justify-between">
          <Button
            variant={"secondary"}
            type="button"
            onClick={onBack}
            disabled={false}
          >
            Назад
          </Button>
          <Button type="submit">Далее</Button>
        </div>
      </form>
    </Form>
  );
};

export default ResidentsBlock;
