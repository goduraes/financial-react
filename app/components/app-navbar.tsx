import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useSidebar } from "./ui/sidebar";
import { useEffect } from "react";

const AppNavbar = () => {
    const { toggleSidebar, isMobile, open, setOpen } = useSidebar();

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
    }, []);1

    const changeSideBarState = () => {
        localStorage.setItem('sidebarOpen', JSON.stringify(!open));
        toggleSidebar()
    };

    const navBarWidth = () => {
        if (isMobile) return '100%';
        if (open) return 'calc(100% - 256px)';
        return 'calc(100% - 66px)';
    }

    return (
        <div className={`fixed h-12.5 p-3.5 flex justify-between items-center bg-background md:bg-primary-foreground transition-[width] duration-200 ease-linear`} style={{ width: navBarWidth() }}>
            <div onClick={changeSideBarState} className="cursor-pointer">
                {open ? <PanelLeftClose className="w-4.5" /> : <PanelLeftOpen className="w-4.5" />}
                <span className="sr-only">Toggle Sidebar</span>
            </div>
            <span>Finanças Pessoais</span>
            <div></div>
        </div>   
    )
}

export default AppNavbar;