import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "~/components/ui/dialog";
import { Field, FieldDescription } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useApi } from "~/hooks/useApi";
import { getTags } from "~/services/tags";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePicker } from "./date-picker";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import type { OptionComboMultiple } from "./combobox-multiple";
import type { Tag } from "~/routes/tags";
import { addTransactions, editTagTransactions } from "~/services/transactions";
import { appToast } from "~/lib/toast";

export type Transactions = {
  id?: number
  description: string;
  value: number;
  type: string;
  date: Date;
  tag_id: string;
}

const ModalRegisterTransaction = ({ 
    open, 
    onOpenChange 
}: { 
    open: boolean, 
    onOpenChange: (open: boolean) => void 
}) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const { request } = useApi();
    const { register, handleSubmit, setValue, watch, reset, control, formState: { errors, isSubmitting } } = useForm<Transactions>({
        defaultValues: {
            type: 'INCOME',
            tag_id: ''
        }
    });
    const onSubmit: SubmitHandler<Transactions> = async (data) => await addAndEditTransaction(data);

    const addAndEditTransaction = async (data: Transactions) => {
        if (isSubmitting) return;
        try {
        const response = await request(() => data.id ? editTagTransactions(data) : addTransactions(data), true, false);
        if (response && response.data) {
            appToast.success(data.id ? 'Transactions editada com sucesso!' : 'Transactions adicionada com sucesso!');
            onOpenChange(false);
            reset();
            loadTags();
        }
        } catch (e) {}
    };

    const loadTags = async () => {
        setTags([]);
        try {
            const loadedTags = await request(() => getTags(), false, false);
            if (loadedTags && loadedTags.data) setTags(loadedTags.data);
        } catch (e) {}
    };

    useEffect(() => {
        if (!open) return;
        loadTags();
    }, [open]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {watch("id") ? "Editar transação" : "Adicionar transação"}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Tabs defaultValue="INCOME">
              <TabsList variant="default" className="flex gap-4 w-full">
                <TabsTrigger
                  value="INCOME"
                  className={`cursor-pointer ${watch("type") === "INCOME" ? "!bg-green-600" : ""}`}
                  onClick={() => setValue("type", "INCOME")}
                >
                  Receitas
                </TabsTrigger>
                <TabsTrigger
                  value="EXPENSE"
                  className={`cursor-pointer ${watch("type") === "EXPENSE" ? "!bg-destructive" : ""}`}
                  onClick={() => setValue("type", "EXPENSE")}
                >
                  Despesas
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Field className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                className={errors.description ? "border-red-500" : ""}
                {...register("description", {
                  required: "Descrição é obrigatória",
                })}
              />
              {errors.description && (
                <FieldDescription className="text-destructive text-xs">
                  {errors.description.message}
                </FieldDescription>
              )}
            </Field>
            <Field className="grid gap-2">
              <Label htmlFor="name">Valor</Label>
              <Input
                id="name"
                className={errors.value ? "border-red-500" : ""}
                {...register("value", { required: "Valor é obrigatório" })}
              />
              {errors.value && (
                <FieldDescription className="text-destructive text-xs">
                  {errors.value.message}
                </FieldDescription>
              )}
            </Field>
            <Field className="grid gap-2">
              <Label htmlFor="type">Data</Label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Data é obrigatória" }}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    className={errors.date ? "!border-red-500" : ""}
                  />
                )}
              />
              {errors.date && (
                <FieldDescription className="text-destructive text-xs">
                  {errors.date.message}
                </FieldDescription>
              )}
            </Field>
            <Field className="grid gap-2">
              <Label htmlFor="type">Tag</Label>
              <Controller
                name="tag_id"
                control={control}
                rules={{ required: "Tag é obrigatória" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors.tag_id ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Selecione a tag" />
                    </SelectTrigger>

                    <SelectContent position="popper">
                      <SelectGroup>
                        {tags.map((tag) => (
                            <SelectItem key={tag.id} value={String(tag.id)}>
                                <div className="w-5 h-5 rounded-full" style={{ background: tag.color }}></div>
                                <span>{tag.name}</span>
                            </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tag_id && (
                <FieldDescription className="text-destructive text-xs">
                  {errors.tag_id.message}
                </FieldDescription>
              )}
            </Field>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
}

export default ModalRegisterTransaction;