import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { DataTable } from "~/components/data-table";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useApi } from "~/hooks/useApi";
import { appToast } from "~/lib/toast";
import { addTag, deleteTag, editTag, getTags } from "~/services/tags";

export type Tag = {
  id?: number
  color: string;
  name: string;
}

const Tags = () => {
  const ran = useRef(false);
  const [open, setOpen] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const [tagToDelete, setTagToDelete] = useState<Tag>();

  const columns: ColumnDef<Tag>[] = [
    { 
      accessorKey: "name", 
      header: "Tag",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex w-full gap-2">
            <div className="h-5 w-5 rounded-full" style={{ background: item.color }}></div>
            <span>{item.name}</span>
          </div>
        );
      }
    },
    {
        id: "actions",
        header: "Ações",
        meta: {
          width: "100px",
        },
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex gap-4">
                <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => {
                  reset({ id: item.id, name: item.name, color: item.color });
                  setOpen(true);
                }}>
                    <Pencil />
                </Button>
  
                <Button variant="destructive" size="icon" className="cursor-pointer" onClick={() => {
                  setTagToDelete(item);
                  setOpenDeleteConfirmation(true);
                }}>
                    <Trash />
                </Button>
            </div>
          )
        },
    },
  ];

  const { request, loading } = useApi();
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<Tag>();
  const onSubmit: SubmitHandler<Tag> = async (data) => await addAndEditTag(data);

  const loadTags = async () => {
    setTags([]);
    try {
      const loadedTags = await request(() => getTags());
      if (loadedTags && loadedTags.data) setTags(loadedTags.data);
    } catch (e) {}
  };

  const addAndEditTag = async (data: Tag) => {
    if (isSubmitting) return;
    try {
      const response = await request(() => data.id ? editTag(data.id, data.name, data.color) : addTag(data.name, data.color), true, false);
      if (response && response.data) {
        appToast.success(data.id ? 'Tag editada com sucesso!' : 'Tag adicionada com sucesso!');
        setOpen(false);
        reset();
        loadTags();
      }
    } catch (e) {}
  };

  const removeTag = async () => {
    try {
      const response = await request(() => deleteTag(tagToDelete?.id || 0), false);
      if (response && response.data) {
        appToast.success('Tag removida com sucesso!');
        setOpenDeleteConfirmation(false);
        setTagToDelete(undefined);
        loadTags();
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    loadTags();
  }, []);

  return (
    <div className="flex flex-col gap-4 h-[1200px]">
      <AppBreadcrumb data={[{ text: 'Tags' }]} />

      <div className="flex justify-end">
        <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => setOpen(true)}>
          <Plus />
        </Button>
      </div>

      <DataTable columns={columns} data={tags} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{watch('id') ? 'Editar tag' : 'Adicionar tag'}</DialogTitle>
            <DialogDescription /> 
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex justify-end items-end gap-4">
              <Field className="grid gap-2 w-14 outline-0">
                <Label htmlFor="color">Cor</Label>
                <Input id="color" {...register("color")} />
              </Field>
              <Field className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" className={errors.name ? 'border-red-500' : ''} {...register("name")} />
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar' }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDeleteConfirmation} onOpenChange={setOpenDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tagToDelete?.name}</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir esta tag?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <Button className="cursor-pointer" onClick={() => removeTag()}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar' }
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Tags;