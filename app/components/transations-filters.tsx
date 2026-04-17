import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { ComboboxMultiple, type OptionComboMultiple } from "~/components/combobox-multiple";
import { DatePickerWithRange } from "~/components/date-picker-range";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Field } from "~/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useApi } from "~/hooks/useApi";
import { getTags } from "~/services/tags";
import type { Tag } from "~/routes/tags";
import { startOfMonth, lastDayOfMonth, format } from 'date-fns';

type FormData = {
  from: Date
  to?: Date
}

export type InputsFilters = {
  search: string
  tags: string[];
  period?: FormData;
  type: string
}

const TransationsFilters = ({ emitFilters }: { emitFilters: (filter: InputsFilters) => void }) => {
  const ran = useRef(false);
  const { request } = useApi();
  const [tags, setTags] = useState<OptionComboMultiple[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
  } = useForm<InputsFilters>({ 
    defaultValues: {
        search: '',
        tags: [],
        type: "all",
        period: { 
            from: startOfMonth(new Date()), 
            to: lastDayOfMonth(new Date())
        },
    }});
  const onSubmit: SubmitHandler<InputsFilters> = (data) => emitFilters(data);

  const loadTags = async () => {
    setTags([]);
    try {
      const loadedTags = await request(() => getTags(), false, false);
      if (loadedTags && loadedTags.data) {
        const tagsFormatted = loadedTags.data.map((el: Tag) => ({ label: el.name, value: String(el.id), color: el.color }));
        setTags(tagsFormatted)
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    loadTags();
    handleSubmit(onSubmit)();
  }, []);

  return (
    <Card size="sm" className="bg-transparent px-4">
    <h2 className="text-md font-semibold">Filtros</h2>
    
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field>
            <InputGroup>            
            <InputGroupInput
                id="search"
                placeholder="Pesquisar"
                {...register("search")} 
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
            </InputGroup>
        </Field>

        <Field>
            <Controller
            name="tags"
            control={control}
            render={({ field }) => {
                return (
                <ComboboxMultiple
                    placeholder="Tags"
                    items={tags}
                    value={field.value}
                    onChange={field.onChange}
                />
                )
            }}
            />
        </Field>
        
        <Field>            
            <Controller
            name="period"
            control={control}
            render={({ field }) => (
                <DatePickerWithRange
                value={field.value}
                onChange={field.onChange}
                />
            )}
            />
        </Field>

        <Field>
            <Controller
            name="type"
            control={control}
            render={({ field }) => (
                <Select
                value={field.value}
                onValueChange={field.onChange}
                >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>

                <SelectContent position="popper">
                    <SelectGroup>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="R" className="text-green-600">Receitas</SelectItem>
                    <SelectItem value="D" className="text-destructive">Despesas</SelectItem>
                    </SelectGroup>
                </SelectContent>
                </Select>
            )}
            />
        </Field>
        </div>
        
        <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" className="cursor-pointer" onClick={() => reset()}>
            <Search /> 
            Limpar
        </Button>
        <Button type="submit" className="cursor-pointer">
            <Search /> 
            Buscar
        </Button>
        </div>
    </form>
    </Card>
  );
}

export default TransationsFilters;