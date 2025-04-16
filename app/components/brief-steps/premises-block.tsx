"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import StyledSelect from "@/components/ui/styled-creatable-select";
import { toast } from "sonner";
import { roomList } from "@/lib/templates";
import {
  PremisesFormValues,
  PremisesSchema,
} from "@/lib/schemas";
import FormBlock from "@/components/ui/formblock";
import StyledSelect from "@/components/ui/styled-creatable-select";

interface PremisesBlockProps {
  onNext: (data: PremisesFormValues) => void;
  onBack: () => void;
}
const PremisesBlock: React.FC<PremisesBlockProps> = ({ onNext, onBack }) => {
  const [options, setOptions] = useState(roomList);

  const form = useForm<PremisesFormValues>({
    resolver: zodResolver(PremisesSchema),
    defaultValues: {
      rooms: [{ name: "", order: 1 }],
    },
  });

  // const watchFields = form.watch();

  const {
    fields: roomFields,
    append,
    move,
    remove,
    update,
  } = useFieldArray({
    control: form.control,
    name: "rooms",
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("premisesData");
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
  }, [form]);


  function onSubmit(data: PremisesFormValues) {
    try {
      // Save data to localStorage
      localStorage.setItem("premisesData", JSON.stringify(data));
      toast.success("Помещения сохранены");
      // Move to the next step
      onNext(data);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при попытке сохранения данных");
    }
  }

  const handleCreateOption = (inputValue: string, index: number) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prev) => [...prev, newOption]);
    form.setValue(`rooms.${index}.name`, inputValue);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col w-100 justify-between"
      >
        <div className="space-y-4 pb-8">
          <FormBlock title="">
            {roomFields.map((room, index) => (
              <article key={index} className="flex w-full items-center gap-2">
                <span className="px-4">{room.order}</span>
                <FormField
                  control={form.control}
                  name={`rooms.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <FormControl>
                        <StyledSelect
                          placeholder="Помещение..."
                          options={options}
                          onChange={(val) => field.onChange(val)}
                          value={
                            options.find(
                              (option) => option.value === field.value
                            ) || null
                          }
                          onCreateOption={(inputValue) =>
                            handleCreateOption(inputValue, index)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => remove(index)}
                  size={"sm"}
                >
                  <Trash2Icon size={20} />
                </Button>
              </article>
            ))}
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() =>
                append({
                  // id: uuidv4(),
                  name: "rooms",
                  order: roomFields.length + 1,
                  // project_id: projectId,
                })
              }
            >
              Добавить помещение
            </Button>
          </FormBlock>
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

export default PremisesBlock;
