"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    width?: string
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  manualSorting?: boolean
  enableSorting?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
  manualSorting = false,
  enableSorting = false,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([])

  const isControlled = manualSorting

  const sorting = isControlled ? externalSorting ?? [] : internalSorting
  const onSortingChange = isControlled
    ? externalOnSortingChange ?? (() => {})
    : setInternalSorting

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : [],
    },
    onSortingChange: enableSorting ? onSortingChange : undefined,
    getCoreRowModel: getCoreRowModel(),

    ...(enableSorting
      ? manualSorting
        ? { manualSorting: true }
        : { getSortedRowModel: getSortedRowModel() }
      : {}),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort =
                  enableSorting && header.column.getCanSort()

                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.columnDef.meta?.width }}
                    onClick={
                      canSort
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={
                      canSort
                        ? "cursor-pointer select-none"
                        : "select-none"
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2 font-semibold">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {/* ícone só se puder ordenar */}
                        {canSort &&
                          ({
                            asc: <MoveUp className="w-4 h-4" />,
                            desc: <MoveDown className="w-4 h-4" />,
                          }[
                            header.column.getIsSorted() as string
                          ] ?? <ArrowDownUp className="w-4 h-4" />)}
                      </div>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {data.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.columnDef.meta?.width }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                Nenhum resultado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}