"use client"

import { useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoaderData } from "react-router";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useApi } from "~/hooks/useApi";
import { appToast } from "~/lib/toast";
import { editMe, getMe } from "~/services/me";

type Inputs = {
    name: string;
    email: string
}

const Profile = () => {
    const { request } = useApi();
    const { register, reset, handleSubmit } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => handleLogin(data);
    const ran = useRef(false);

    async function handleLogin(data: Inputs) {
        try {
          const me = await request(() => editMe(data.name, data.email), true, false);
          if (me && me.data) appToast.success('Perfil atualizado com sucesso!');
        } catch (e) {}
    };

    const getMeInfo = async () => {
        try {
          const me = await request(() => getMe());
          if (me && me.data) {
            reset({
                name: me.data.name,
                email: me.data.email,
            });
          }
        } catch (e) {}
    };

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;
        getMeInfo();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <AppBreadcrumb data={[{ text: 'Perfil' }]} />
            
            <Card size="sm" className="px-4">
                <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                    <div className="grid col-span-2 md:col-span-1 gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            type="name"
                            {...register("name")}
                        />
                    </div>
                    
                    <div className="grid col-span-2 md:col-span-1 gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...register("email")}
                        />
                    </div>

                    <div className="flex justify-end col-span-2">
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
  
export default Profile;