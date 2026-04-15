import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import AppSidebar from "~/components/app-sidebar"
import { getToken } from "~/services/auth";
import { useMe } from "~/hooks/useMe";
import { useApi } from "~/hooks/useApi";
import { getMe } from "~/services/me";
import AppLoadingScreen from "~/components/app-loading-screen";
import { useLoading } from "~/hooks/useLoading";
import { Card } from "~/components/ui/card";
import { Wallet } from "lucide-react"
import AppNavbar from "~/components/app-navbar";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { request } = useApi();
  const { user, setUser } = useMe();
  const { loadingScreen } = useLoading();
  
  useEffect(() => {
    if (!getToken()) navigate('/login');
    else getMeInfo();
  }, []);

  const getMeInfo = async () => {
    try {
      const me = await request(() => getMe());
      if (me && me.data) setUser(me.data);
    } catch (e) {}
};

  return (
    <SidebarProvider>
      {loadingScreen ? <AppLoadingScreen /> : null}
      {user ? <AppSidebar /> : null}

      <main className={`h-screen w-full ${!user ? 'hidden' : ''}`}>
        <div className="stick h-12.5 pr-5 pl-2 w-full flex justify-between items-center">
          <AppNavbar />
          <Link to="/"><Wallet /></Link>
          <div></div>
        </div>
        <div className="h-[calc(100%-50px)] overflow-y-auto">
          <Card className="mr-5 ml-3 mb-2 mt-1 p-4 min-h-[calc(100%-12px)]">
            <Outlet />
          </Card>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default ProtectedRoute;