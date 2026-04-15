import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "~/components/ui/sidebar"
import {
  Home,
  Settings,
  Users
} from "lucide-react"
import NavUser from "./nav-user"
import NavMain from "./nav-main"

const data = [
  {
    title: "Home",
    url: "/",
    icon: Home,
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
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader />
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