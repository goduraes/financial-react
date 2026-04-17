import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import type { Tag } from "~/routes/tags";
import { addTransactions, editTransactions } from "~/services/transactions";
import { appToast } from "~/lib/toast";
import type { Transaction } from "~/routes/transactions";
import { getContrastColor } from "~/helper/tag-color";
import { currencyFormat, currencyFormatToNumber } from "~/helper/currency";

export type TransactionsInputs = {
  id?: number
  description: string;
  value: string;
  type: string;
  date: Date;
  tag_id: string;
}

export type TransactionsInputsNumberValue =
  Omit<TransactionsInputs, "value"> & {
    value: number;
  };

const ModalRegisterTransaction = ({ 
    open, 
    onOpenChange,
    onSuccess,
    transaction
}: { 
    open: boolean, 
    onOpenChange: (open: boolean) => void,
    onSuccess: () => void;
    transaction?: Transaction
}) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const { request } = useApi();
    const { register, handleSubmit, setValue, watch, reset, control, formState: { errors, isSubmitting } } = useForm<TransactionsInputs>({
      defaultValues: {
        id: undefined,
        description: '',
        value: 'R$ 0.00',
        date: undefined,
        type: 'INCOME',
        tag_id: ''
      }
    });
    const onSubmit: SubmitHandler<TransactionsInputs> = async (data) => await addAndEditTransaction(data);

    const addAndEditTransaction = async (data: TransactionsInputs) => {
        if (isSubmitting) return;
        try {
          const dataRequest: TransactionsInputsNumberValue = { ...data, value: currencyFormatToNumber(data.value) };
          const response = await request(() => data.id ? editTransactions(dataRequest) : addTransactions(dataRequest), true, false);
        if (response && response.data) {
            appToast.success(data.id ? 'Transactions editada com sucesso!' : 'Transactions adicionada com sucesso!');
            onOpenChange(false);
            reset();
            onSuccess();
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
        if (transaction) {
          reset({
            id: transaction.id,
            description: transaction.description,
            value: transaction.value ? currencyFormat(transaction.value) : 'R$ 0,00',
            date: transaction.date,
            tag_id: String(transaction.tag_id),
            type: transaction.type
          })
        } else {
          reset({
            id: undefined,
            description: '',
            value: 'R$ 0,00',
            date: undefined,
            type: 'INCOME',
            tag_id: ''
          });
        }
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
            <Tabs defaultValue={transaction ? transaction.type : 'INCOME'}>
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
              <Controller
                name="value"
                control={control}
                rules={{ 
                  required: "Valor é obrigatória",
                  validate: (v) => currencyFormatToNumber(v) > 0 || "Valor é obrigatório",
                }}
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className={errors.value ? "border-red-500" : ""}
                    onChange={(e) => {
                      const number = currencyFormatToNumber(e.target.value);
                      field.onChange(currencyFormat(number));
                    }}
                    inputMode="numeric"
                  />
                )}
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
                              <span className="flexinnline px-1.5 py-[3px] font-medium rounded-sm text-sm" style={{ background: `${tag.color}`, color: getContrastColor(tag.color) }}>
                                {tag.name}
                              </span>
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