import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar"
import AppSidebar from "~/components/app-sidebar"
import { getToken } from "~/services/auth";
import { useMe } from "~/hooks/useMe";
import { useApi } from "~/hooks/useApi";
import { getMe } from "~/services/me";
import AppLoadingScreen from "~/components/app-loading-screen";
import { useLoading } from "~/hooks/useLoading";
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
        <AppNavbar />
        <div className="px-4 pb-4 mt-[50px]">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default ProtectedRoute;