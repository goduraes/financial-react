"use client"

import { EyeOffIcon, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoaderData } from "react-router";
import AppBreadcrumb from "~/components/app-breadcrumb";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Field, FieldDescription } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { InputGroup, InputGroupInput, InputGroupAddon } from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { useApi } from "~/hooks/useApi";
import { appToast } from "~/lib/toast";
import { editMe, editPasswordMe, getMe } from "~/services/me";
import register from "./register";

type InputsPersonalData = {
    name: string;
    email: string;
}

type InputsPasswordData = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const Profile = () => {
    const ran = useRef(false);
    const { request } = useApi();

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const personalDataForm = useForm<InputsPersonalData>();
    const passwordForm = useForm<InputsPasswordData>();

    const handlePersonalData = async (data: InputsPersonalData) => {
        try {
          const me = await request(() => editMe(data.name, data.email), true, false);
          if (me && me.data) appToast.success('Perfil atualizado com sucesso!');
        } catch (e) {}
    };

    const handlePasswordlData = async (data: InputsPasswordData) => {
        try {
          const me = await request(() => editPasswordMe(data.currentPassword, data.newPassword), true, false);
          if (me && me.data) {
            appToast.success('Senha atualizada com sucesso!');
            passwordForm.reset();
          }
        } catch (e) {}
    };

    const getMeInfo = async () => {
        try {
          const me = await request(() => getMe());
          if (me && me.data) {
            personalDataForm.reset({
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
                <form onSubmit={personalDataForm.handleSubmit(handlePersonalData)} className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Field className="flex gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                type="name"
                                className={personalDataForm.formState.errors.name ? 'border-red-500' : ''}
                                {...personalDataForm.register("name", { required: 'Nome é obrigatório' })}
                            />
                            {personalDataForm.formState.errors.name && (
                                <FieldDescription className="text-destructive text-xs">{personalDataForm.formState.errors.name.message}</FieldDescription>
                            )}
                        </Field>
                        
                        <Field className="flex gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                className={personalDataForm.formState.errors.email ? 'border-red-500' : ''}
                                {...personalDataForm.register("email", { 
                                    required: "E-mail é obrigatório", 
                                    pattern: {
                                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                                        message: "E-mail inválido"
                                    }
                                })}
                            />
                            {personalDataForm.formState.errors.email && (
                                <FieldDescription className="text-destructive text-xs">{personalDataForm.formState.errors.email.message}</FieldDescription>
                            )}
                        </Field>
                    </div>

                    <div className="flex justify-end col-span-2">
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Card>

            <Card size="sm" className="px-4">
                <h2 className="text-lg font-semibold">Senha</h2>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordlData)} className="flex flex-col gap-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Field className="flex gap-2">
                            <Label htmlFor="name">Senha Atual</Label>
                            <InputGroup className={passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''}>
                                <InputGroupInput
                                    id="currentPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    {...passwordForm.register("currentPassword", { required: "Informe sua senha atual" })}
                                />
                                <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOffIcon /> : <Eye />}
                                </InputGroupAddon>
                            </InputGroup>
                            {passwordForm.formState.errors.currentPassword && (
                                <FieldDescription className="text-destructive text-xs">{passwordForm.formState.errors.currentPassword.message}</FieldDescription>
                            )}
                        </Field>

                        <Field className="flex gap-2">
                            <Label htmlFor="name">Nova Senha</Label>
                            <InputGroup className={passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}>
                                <InputGroupInput
                                    id="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...passwordForm.register("newPassword", { 
                                        required: "Informe sua nova senha",
                                        pattern: {
                                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i,
                                            message: "Use pelo menos 8 caracteres, com letras e números."
                                        }
                                    })}
                                />
                                <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <EyeOffIcon /> : <Eye />}
                                </InputGroupAddon>
                            </InputGroup>
                            {passwordForm.formState.errors.newPassword && (
                                <FieldDescription className="text-destructive text-xs">{passwordForm.formState.errors.newPassword.message}</FieldDescription>
                            )}
                        </Field>

                        <Field className="flex gap-2">
                            <Label htmlFor="name">Confirmação da Nova Senha</Label>
                            <InputGroup className={passwordForm.formState.errors.confirmNewPassword ? 'border-red-500' : ''}>
                                <InputGroupInput
                                    id="confirmNewPassword"
                                    type={showConfirmNewPassword ? 'text' : 'password'}
                                    {...passwordForm.register("confirmNewPassword", { 
                                        required: "Confirme sua nova senha",
                                        validate: (value) => value === passwordForm.getValues("newPassword") || "As senhas não coincidem" 
                                    })}
                                />
                                <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                                    {showConfirmNewPassword ? <EyeOffIcon /> : <Eye />}
                                </InputGroupAddon>
                            </InputGroup>
                            {passwordForm.formState.errors.confirmNewPassword && (
                                <FieldDescription className="text-destructive text-xs">{passwordForm.formState.errors.confirmNewPassword.message}</FieldDescription>
                            )}
                        </Field>
                    </div>

                    <div className="flex justify-end col-span-3">
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
  
export default Profile;