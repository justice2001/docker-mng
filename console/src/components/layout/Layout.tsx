import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSiderBar.tsx';
import { TerminalProvider } from '../provider/TerminalProvider';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <TerminalProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TerminalProvider>
  );
}
