"use client"

import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import { Input  } from "~/components/ui/input";
import { Label  } from "~/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { useForm, type SubmitHandler } from "react-hook-form";
import { useApi } from "../hooks/useApi";
import { login, setToken } from "../services/auth";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

type Inputs = {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => handleLogin(data.email, data.password)

  const handleLogin = async (email: string, password: string) => {
    try {
      const auth = await request(() => login({ email, password }));
      if(auth && auth.data && auth.data.token) {
        setToken(auth.data.token);
        navigate('/');
      }
    } catch (e) {}
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Faça login na sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para acessar sua conta
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register("password")} />
            </div>
            <button type="submit" className="hidden"></button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="button" className="w-full" onClick={() =>  loading ? null : handleSubmit(onSubmit)()}>
            { loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar' }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;