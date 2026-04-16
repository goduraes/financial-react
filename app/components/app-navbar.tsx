import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useSidebar } from "./ui/sidebar";
import { useEffect } from "react";

const AppNavbar = () => {
    const { open, setOpen } = useSidebar();

    const isSidebarOpenValid = (str: string) => {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        const sidebarOpen = localStorage.getItem('sidebarOpen') || '';
        if (isSidebarOpenValid(sidebarOpen)) setOpen(!!JSON.parse(sidebarOpen));
    }, []);

    const changeSideBarState = () => {
        localStorage.setItem('sidebarOpen', JSON.stringify(!open));
        setOpen(!open);
    };

    return (
        <div onClick={changeSideBarState} className="cursor-pointer">
            {open ? <PanelLeftClose className="w-4.5" /> : <PanelLeftOpen className="w-4.5" />}
            <span className="sr-only">Toggle Sidebar</span>
        </div>
    )
}

export default AppNavbar;