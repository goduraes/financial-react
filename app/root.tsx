import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";
import { useEffect } from "react";
import { Toaster } from "~/components/ui/sonner"
import { setNavigate } from "./services/navigation";

import "./app.css";
import { TooltipProvider } from "~/components/ui/tooltip";
import { UserProvider } from "./contexts/userProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const saved = localStorage.getItem("darkTheme");
    const isDark = saved ? JSON.parse(saved) : true;
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const App = () => {
  const nav = useNavigate();

  useEffect(() => {
    setNavigate(nav);
  }, [nav]);
  
  return (
    <UserProvider>
      <TooltipProvider>
        <Outlet />
        <Toaster position="top-center" />
      </TooltipProvider>
    </UserProvider>
  );
}

export { Layout };
export default App;
