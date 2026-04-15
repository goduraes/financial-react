import { useEffect, useRef, useState } from "react";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { useApi } from "~/hooks/useApi";
import { getUsers } from "~/services/users";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";

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
]

const Users = () => {
    const { request } = useApi();
    const ran = useRef(false);
    const [users, setUsers] = useState<User[]>([]);
    
    const loadUsers = async () => {
        setUsers([]);
        try {
          const users = await request(() => getUsers());
          if (users && users.data) setUsers(users.data);
        } catch (e) {}
    };

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        loadUsers();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <AppBreadcrumb data={[{ text: 'Admin' }, { text: 'Usuários' }]} />

            <DataTable columns={columns} data={users} />
        </div>
    );
}

export default Users;