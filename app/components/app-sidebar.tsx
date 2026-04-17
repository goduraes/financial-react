import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "~/components/ui/sidebar"
import {
  Home,
  Settings,
  Users,
  Wallet,
  ArrowLeftRight,
  Tags
} from "lucide-react"
import NavUser from "./nav-user"
import NavMain from "./nav-main"
import { Link } from "react-router";
import { useIsMobile } from "~/hooks/use-mobile";

const data = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Transações",
    url: "/transations",
    icon: ArrowLeftRight,
  },
  {
    title: "Tags",
    url: "/tags",
    icon: Tags,
  },
  {
    title: "Admin",
    icon: Settings,
    roles: ['ADMIN'],
    items: [
      {
        title: "Usuários",
        icon: Users,
        url: "/admin/users",
      },
    ],
  },
];

const AppSidebar = () => {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex justify-center">
          <Link to="/" onClick={() => isMobile ? toggleSidebar() : null}><Wallet /></Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;