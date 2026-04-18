import { Loader2, Pencil, Plus, Trash, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { Button } from "~/components/ui/button";
import { useApi } from "~/hooks/useApi";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import AppPagination from "~/components/app-pagination";
import TransactionsFilters from "~/components/transations-filters";
import { deleteTransactions, getTransactions, type getTransactionsFilter } from "~/services/transactions";
import { format } from "date-fns";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { appToast } from "~/lib/toast";
import ModalRegisterTransaction from "~/components/modal-register-transaction";
import { getContrastColor } from "~/helper/tag-color";
import { currencyFormat } from "~/helper/currency";
import type { Summary } from "./home";

export type Transaction = {
  id?: number
  user_id: number
  description: string
  value: number
  type: "INCOME" | "EXPENSE"
  date: Date
  tag_id: number | null
  created_at?: string
  updated_at?: string | null
  tag_name: string | null
  tag_color: string | null
}

export type SortingTransaction = {
  sortBy: string;
  order: string;
}

const cards = [
  { label: "Receitas", icon: TrendingUp, prop: "total_income", valueClass: "text-green-600" },
  { label: "Despesas",  icon: TrendingDown, prop: "total_expense", valueClass: "text-destructive" },
  {
    label: "Resultado",
    icon: Wallet,
    prop: "balance",
    valueFunc: (val: number) => {
      if (val > 0) return "text-green-600";
      if (val < 0) return "text-destructive";
      return '';
    },
  },
];

const Transactions = () => {
  const { request, loading } = useApi();
  const [filters, setFilters] = useState<getTransactionsFilter>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [summary, setSummary] = useState<Summary>();
  const [Transactions, setTransactions] = useState<Transaction[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortingFilter, setSortingFilter] = useState<SortingTransaction>();

  const [open, setOpen] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  const [transactionToDelete, setTransactionToDelete] = useState<Transaction>();
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>();

  const columns: ColumnDef<Transaction>[] = [
    { accessorKey: "description", header: "Descrição", meta: { width: "25%" } },
    {
      accessorKey: "value",
      header: "Valor",
      meta: { width: "25%" },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <span className={`font-bold ${item.type === "INCOME" ? "text-green-600" : "text-destructive"}`}>
            {item.type === "INCOME" ? '' : '-'} {currencyFormat(item.value)} 
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Data",
      meta: { width: "25%" },
      cell: ({ row }) => {
        const item = row.original;
        return <span>{item.date ? format(item.date, "dd/MM/yyyy") : "-"}</span>;
      },
    },
    {
      accessorKey: "tag_name",
      header: "Tag",
      meta: { width: "25%" },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <span className="flexinnline px-1.5 py-[3px] font-medium rounded-sm text-sm" style={{ background: `${item.tag_color}`, color: getContrastColor(item.tag_color) }}>
            {item.tag_name}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      enableSorting: false,
      meta: { width: "100px" },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-4">
            <Button
              variant="secondary"
              size="icon"
              className="cursor-pointer"
              onClick={() => {
                setTransactionToEdit(item);
                setOpen(true);
              }}
            >
              <Pencil />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="cursor-pointer"
              onClick={() => {
                setTransactionToDelete(item);
                setOpenDeleteConfirmation(true);
              }}
            >
              <Trash />
            </Button>
          </div>
        );
      },
    },
  ];

  const loadTransactions = async (data: getTransactionsFilter) => {
    setTransactions([]);
    setSummary(undefined);
    try {
      const loadedTags = await request(() => getTransactions(data));
      if (loadedTags && loadedTags.data) {
        setSummary(loadedTags.data.summary);
        setTransactions(loadedTags.data.transactions);
        setTotalPages(loadedTags.totalPages);
      }
    } catch (e) {}
  };

  const removeTransaction = async () => {
    if (!filters) return;
    try {
      const response = await request(() => deleteTransactions(transactionToDelete?.id || 0), false);
      if (response && response.data) {
        appToast.success('Transação removida com sucesso!');
        setOpenDeleteConfirmation(false);
        setTransactionToDelete(undefined);
        loadTransactions({ page, perPage, ...sortingFilter, ...filters });
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!filters) return;
    setPage(1)
    loadTransactions({ page: 1, perPage, ...sortingFilter, ...filters });
  }, [filters]);

  useEffect(() => {
    if (!filters) return;
    loadTransactions({ page, perPage, ...sortingFilter, ...filters });
  }, [page, perPage, sortingFilter]);

  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb data={[{ text: "Transações" }]} />

      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="icon"
          className="cursor-pointer"
          onClick={() => {
            setTransactionToEdit(undefined);
            setOpen(true);
          }}
        >
          <Plus />
        </Button>
      </div>

      <TransactionsFilters emitFilters={(filter) => setFilters(filter)} />

      <div className="flex flex-wrap justify-end gap-4 my-4">
        {cards.map((card, i) => {
          const value =
            summary && summary[card.prop as keyof Summary]
              ? summary[card.prop as keyof Summary]
              : 0;
          const valueFuncClass = card.valueFunc ? card.valueFunc(value) : "";

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex justify-center items-center gap-2 text-xs">
                <card.icon
                  className={`w-4 h-4 ${valueFuncClass} ${card.valueClass}`}
                />
                <span>{card.label}</span>
              </div>
              <span
                className={`font-bold ${valueFuncClass} ${card.valueClass}`}
              >
                {currencyFormat(value)}
              </span>
            </div>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={Transactions}
        enableSorting
        manualSorting
        sorting={sorting}
        onSortingChange={(updater) => {
          const newSorting = typeof updater === "function" ? updater(sorting) : updater;
          setSorting(newSorting);
          const sort = newSorting[0];
          setSortingFilter(sort ? { sortBy: sort.id, order: sort.desc ? "desc" : "asc" } : undefined)
        }}
      />

      {totalPages ? (
        <AppPagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={(newPage) => {
            if (newPage === page) return;
            setPage(newPage);
          }}
          onPerPageChange={(newPerPage) => {
            if (newPerPage === perPage) return;
            setPerPage(newPerPage);
          }}
        />
      ) : null}

      <ModalRegisterTransaction
        open={open}
        onOpenChange={setOpen}
        transaction={transactionToEdit}
        onSuccess={() => {
          if (filters) loadTransactions({ page, perPage, ...sortingFilter, ...filters });
        }}
      />

      <AlertDialog
        open={openDeleteConfirmation}
        onOpenChange={setOpenDeleteConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {transactionToDelete?.description}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <Button
              className="cursor-pointer"
              onClick={() => removeTransaction()}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Confirmar"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Transactions;