import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { DataTable } from "~/components/data-table";
import { Button } from "~/components/ui/button";

export type Tag = {
  id: number
  color: string;
  name: string;
}

export const columns: ColumnDef<Tag>[] = [
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
        const item = row.original
        return (
          <div className="flex gap-4">
              <Button variant="secondary" size="icon" className="cursor-pointer">
                  <Pencil />
              </Button>

              <Button variant="destructive" size="icon" className="cursor-pointer">
                  <Trash />
              </Button>
          </div>
        )
      },
  },
]

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb data={[{ text: 'Tags' }]} />

      <DataTable columns={columns} data={tags} />
    </div>
  );
}

export default Tags;