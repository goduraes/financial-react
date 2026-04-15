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
import { login } from "../services/auth";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

type Inputs = {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => handleLogin(data.email, data.password)

  async function handleLogin(email: string, password: string) {
    try {
      const auth = await request(() => login({ email, password }));
      if(auth && auth.data && auth.data.token) {
        localStorage.setItem('token', auth.data.token);
        navigate('/');
      }
    } catch (e) {}
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required {...register("password")} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="button" className="w-full" onClick={() => handleSubmit(onSubmit)()}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
