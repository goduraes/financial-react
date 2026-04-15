import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useSidebar } from "./ui/sidebar";

const AppNavbar = () => {
    const { toggleSidebar, open } = useSidebar();
    return (
        <div onClick={toggleSidebar} className="cursor-pointer">
            {open ? <PanelLeftClose className="w-4.5" /> : <PanelLeftOpen className="w-4.5" />}
            <span className="sr-only">Toggle Sidebar</span>
        </div>
    )
}

export default AppNavbar;