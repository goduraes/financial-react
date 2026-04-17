import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { Button } from "~/components/ui/button";
import { useApi } from "~/hooks/useApi";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import AppPagination from "~/components/app-pagination";
import TransationsFilters, { type InputsFilters } from "~/components/transations-filters";

export const columns: ColumnDef<any>[] = [
  { accessorKey: "id", header: "ID", meta: { width: "16,66%" } },
  { accessorKey: "name", header: "Name", meta: { width: "16,66%" } },
  { accessorKey: "email", header: "E-mail", meta: { width: "16,66%" } },
  { accessorKey: "role", header: "Role", meta: { width: "16,66%" } }
];

const Transations = () => {
  const ran = useRef(false);
  const { request } = useApi();
  const [filters, setFilters] = useState<InputsFilters>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [transations, setTransations] = useState<any[]>([]);

  useEffect(() => {
    if (!filters) return;
    console.log(filters);
  }, [filters]);

  return (
    <div className="flex flex-col gap-4">
      <AppBreadcrumb data={[{ text: 'Transações' }]} />

      <div className="flex justify-end">
        <Button variant="secondary" size="icon" className="cursor-pointer">
          <Plus />
        </Button>
      </div>

      <TransationsFilters emitFilters={(filter) => setFilters(filter)} />

      <DataTable columns={columns} data={transations} />
      
      {totalPages ? (
        <AppPagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={(newPage) => console.log(newPage)}
            onPerPageChange={(newPerPage) => console.log(newPerPage)}
        />
      ): null}
    </div>
  );
}

export default Transations;