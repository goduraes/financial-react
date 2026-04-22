import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useApi } from "../hooks/useApi";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOffIcon, Loader2 } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Field, FieldDescription } from "~/components/ui/field";
import { useState } from "react";
import { registerUser } from "~/services/users";
import { appToast } from "~/lib/toast";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { request, loading } = useApi();
  const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm<Inputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const onSubmit: SubmitHandler<Inputs> = (data) => handleRegister(data);

  const handleRegister = async (data: Inputs) => {
    const { name, email, password } = data;
    try {
      const response = await request(() => registerUser({ name, email, password }));
      if (response && response.data) {
        appToast.success('Usuário registrado com sucesso!');
        navigate('/login');
        reset();
      }
    } catch (e) {}
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Faça registro da sua conta</CardTitle>
          <CardDescription>
            Insira os dados abaixo para registrar sua conta
          </CardDescription>
          <CardAction>
            <Link to="/login" className="p-1">Login</Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Field className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" className={errors.name ? 'border-red-500' : ''} {...register("name", { required: "Nome é obrigatório" })} />
              {errors.name && <FieldDescription className="text-destructive text-xs">{errors.name.message}</FieldDescription>}
            </Field>

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
              <InputGroup className={(errors.password || errors.confirmPassword) ? 'border-red-500' : ''}>
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { 
                    required: "Senha é obrigatório",
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i,
                      message: "Use pelo menos 8 caracteres, com letras e números."
                    }
                  })}
                />
                <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <Eye />}
                </InputGroupAddon>
              </InputGroup>
              {errors.password && <FieldDescription className="text-destructive text-xs">{errors.password.message}</FieldDescription>}
            </Field>

            <Field className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmação de Senha</Label>
              <InputGroup className={errors.confirmPassword ? 'border-red-500' : ''}>
                <InputGroupInput
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register("confirmPassword", { validate: (value) => value === getValues("password") || "As senhas não coincidem" })}
                />
                <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOffIcon /> : <Eye />}
                </InputGroupAddon>
              </InputGroup>
              {errors.confirmPassword && <FieldDescription className="text-destructive text-xs">{errors.confirmPassword.message}</FieldDescription>}
            </Field>
            
            <button type="submit" className="hidden"></button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            className="w-full"
            onClick={() => (loading ? null : handleSubmit(onSubmit)())}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Cadastrar"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

