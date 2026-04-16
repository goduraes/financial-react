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
import { Link, useNavigate } from "react-router";
import { Eye, EyeOffIcon, Loader2 } from "lucide-react";
import { Field, FieldDescription } from "~/components/ui/field";
import { InputGroup, InputGroupInput, InputGroupAddon } from "~/components/ui/input-group";
import { useState } from "react";

type Inputs = {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate();
  const { request, loading } = useApi();
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => handleLogin(data.email, data.password);
  const [showPassword, setShowPassword] = useState(false);

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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Faça login na sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para acessar sua conta
          </CardDescription>
          <CardAction>
            <Link to="/register">Sign Up</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className={errors.email ? 'border-red-500' : ''}
                {...register("email", { 
                  required: "E-mail é obrigatório", 
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                    message: "E-mail inválido"
                  }
                })} 
              />
              {errors.email && <FieldDescription className="text-destructive text-xs">{errors.email.message}</FieldDescription>}
            </Field>

            <Field className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <InputGroup className={errors.password ? 'border-red-500' : ''}>
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { required: "Informe sua senha" })}
                />
                <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <Eye />}
                </InputGroupAddon>
              </InputGroup>
              {errors.password && <FieldDescription className="text-destructive text-xs">{errors.password.message}</FieldDescription>}
            </Field>

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