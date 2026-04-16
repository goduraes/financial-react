import { useEffect, useRef, useState } from "react";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { useApi } from "~/hooks/useApi";
import { getUsers } from "~/services/users";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import AppPagination from "~/components/app-pagination";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Pencil, Trash } from "lucide-react";

export type User = {
    id: number
    name: string;
    role: string;
    email: string
}

export const columns: ColumnDef<User>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "E-mail" },
    { accessorKey: "role", header: "Role" },
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

const Users = () => {
    const { request } = useApi();
    const ran = useRef(false);
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [perPage, setPerPage] = useState(10);
    
    const loadUsers = async (page: number, perPage: number, search = '') => {
        setUsers([]);
        try {
          const users = await request(() => getUsers(page, perPage, search));
          if (users && users.data) {
            setUsers(users.data);
            setTotalPages(users.totalPages);
          }
        } catch (e) {}
    };

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        loadUsers(page, perPage, search);
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <AppBreadcrumb data={[{ text: 'Admin' }, { text: 'Usuários' }]} />

            <Input
                id="name" 
                type="text" 
                placeholder="Pesquise por nome ou e-mail"
                className="w-full md:w-1/2 lg:w-1/3"
                onChange={(e) => setSearch(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === "Enter") loadUsers(page, perPage, search);
                }}
            />

            <DataTable columns={columns} data={users} />

            <AppPagination
                page={page}
                totalPages={totalPages}
                perPage={perPage}
                onPageChange={(newPage) => {
                    if (newPage === page) return;
                    setPage(newPage);
                    loadUsers(newPage, perPage, search);
                }}
                onPerPageChange={(newPerPage) => {
                    if (newPerPage === perPage) return;
                    setPerPage(newPerPage);
                    loadUsers(page, newPerPage, search);
                }}
            />
        </div>
    );
}

export default Users;