import { useEffect, useRef, useState } from "react";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { useApi } from "~/hooks/useApi";
import { changeRoleUser, getUsers, toggleUserStatus } from "~/services/users";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import AppPagination from "~/components/app-pagination";
import { Input } from "~/components/ui/input";
import { format } from 'date-fns'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { appToast } from "~/lib/toast";

export type User = {
    id: number
    name: string;
    role: string;
    email: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

const Users = () => {
    const { request } = useApi();
    const ran = useRef(false);
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const columns: ColumnDef<User>[] = [
      { accessorKey: "id", header: "ID", meta: { width: "14,28%" } },
      { accessorKey: "name", header: "Name", meta: { width: "14,28%" } },
      { accessorKey: "email", header: "E-mail", meta: { width: "14,28%" } },
      { 
        accessorKey: "role", 
        header: "Role", 
        meta: { width: "14,28%" }, 
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Select value={item.role} onValueChange={(value) => {
              updateUsersRole(item.id, value);
              item.role = value;
            }}>
              <SelectTrigger className="w-full min-w-48">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="COMMON">COMMON</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )
        },
      },
      {
        accessorKey: "created_at",
        header: "Data de criação",
        meta: { width: "14,28%" },
        cell: ({ row }) => {
            const item = row.original;
            return <span>{item.created_at ? format(item.created_at, "dd/MM/yyyy HH:mm") : '-'}</span>
        },
      },
      {
        accessorKey: "updated_at",
        header: "Data de edição",
        meta: { width: "14,28%" },
        cell: ({ row }) => {
            const item = row.original;
            return <span>{item.updated_at ? format(item.updated_at, "dd/MM/yyyy HH:mm") : '-'}</span>
        },
      },
      { 
        accessorKey: "is_active", 
        header: "Ativo", 
        meta: { width: "14,28%" }, 
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Switch
              id="switch-focus-mode"
              checked={item.is_active}
              onCheckedChange={(value) => {
                updateUsersStatus(item.id, value);
                item.is_active = value;
              }}
            />
          );
        },
      },
    ];
    
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

    const updateUsersRole = async (id: number, role: string) => {
      try {
        const user = await request(() => changeRoleUser(id, role), true, false);
        if (user && user.data) {
          appToast.success('Usuário atualizado com sucesso!');
        }
      } catch (e) {
        loadUsers(page, perPage, search);
      }
    };

    const updateUsersStatus = async (id: number, is_active: boolean) => {
      try {
        const user = await request(() => toggleUserStatus(id, is_active), true, false);
        if (user && user.data) {
          appToast.success('Usuário atualizado com sucesso!');
        }
      } catch (e) {
        loadUsers(page, perPage, search);
      }
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
                    if (e.key === "Enter") {
                      setPage(1)
                      loadUsers(1, perPage, search);
                    };
                }}
            />

            <DataTable columns={columns} data={users} />

            {totalPages ? (
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
            ): null}
        </div>
    );
}

export default Users;