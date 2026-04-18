"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "~/components/ui/sidebar"
import { useMe } from "~/hooks/useMe"

const NavMain = ({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    roles?: string[];
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      roles?: string[];
    }[]
  }[]
}) => {
  const location = useLocation();
  const { user } = useMe();
  const { toggleSidebar, open, isMobile } = useSidebar();

  const changeSideBarState = () => {
    if (open || isMobile) return;
    localStorage.setItem('sidebarOpen', JSON.stringify(true));
    toggleSidebar();
};
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (user && item.roles && !item.roles.includes(user.role)) return;

          if (item.items) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={!!item.items.find((el) => el.url === location.pathname)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild onClick={() => changeSideBarState()}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title} >
                          <SidebarMenuSubButton asChild isActive={location.pathname === subItem.url}>
                            <Link to={subItem.url} onClick={() => isMobile ? toggleSidebar() : null}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={location.pathname === item.url}>
                <Link to={item.url || ''} onClick={() => isMobile ? toggleSidebar() : null}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain;