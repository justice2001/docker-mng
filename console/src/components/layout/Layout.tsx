import { SidebarProvider } from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/layout/AppSiderBar.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='p-4'>
                {children}
            </main>
        </SidebarProvider>
    )
}
