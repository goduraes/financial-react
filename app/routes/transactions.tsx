import { Pencil, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { Button } from "~/components/ui/button";
import { useApi } from "~/hooks/useApi";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import AppPagination from "~/components/app-pagination";
import TransactionsFilters, { type InputsFilters } from "~/components/transations-filters";
import ModalRegisterTransaction from "~/components/modal-register-transaction";
import { getTransactions } from "~/services/transactions";
import { format } from "date-fns";

const Transactions = () => {
  const { request } = useApi();
  const [filters, setFilters] = useState<InputsFilters>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [Transactions, setTransactions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const columns: ColumnDef<any>[] = [
    { accessorKey: "description", header: "Descrição", meta: { width: "25%" } },
    { accessorKey: "value", header: "Valor", meta: { width: "25%" } },
    {
      accessorKey: "date",
      header: "Data",
      meta: { width: "25%" },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <span>{item.date ? format(item.date, "dd/MM/yyyy"): "-"}</span>
        );
      },
    },
    { accessorKey: "tag_name", header: "Tag", meta: { width: "25%" } },
    {
      id: "actions",
      header: "Ações",
      meta: { width: "100px" },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-4">
            <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => setOpen(true)}>
              <Pencil />
            </Button>
  
            <Button variant="destructive" size="icon" className="cursor-pointer">
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];

  const loadTransactions = async () => {
    setTransactions([]);
    try {
      const loadedTags = await request(() => getTransactions());
      if (loadedTags && loadedTags.data) setTransactions(loadedTags.data);
    } catch (e) {}
  };

  useEffect(() => {
    if (!filters) return;
    loadTransactions();
    console.log(filters);
  }, [filters]);

  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb data={[{ text: 'Transações' }]} />

      <div className="flex justify-end">
        <Button variant="secondary" size="icon" className="cursor-pointer" onClick={() => setOpen(true)}>
          <Plus />
        </Button>
      </div>

      <TransactionsFilters emitFilters={(filter) => setFilters(filter)} />

      <DataTable columns={columns} data={Transactions} />
      
      {totalPages ? (
        <AppPagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={(newPage) => console.log(newPage)}
            onPerPageChange={(newPerPage) => console.log(newPerPage)}
        />
      ): null}

      <ModalRegisterTransaction open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default Transactions;