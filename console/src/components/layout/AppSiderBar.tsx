import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    BookDashedIcon,
    Container,
    Disc3Icon,
    Gauge,
    HardDriveIcon,
    Layers,
    LayoutPanelLeftIcon,
    LibraryBigIcon,
    LucideProps,
    NetworkIcon
} from "lucide-react";

interface SidebarItems {
    groupName: string;
    children: {
        name: string;
        url: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    }[]
}

export function AppSidebar() {
    const sidebarItems: SidebarItems[] = [
        {
            groupName: "Dashboard",
            children: [
                {
                    name: "Apps",
                    url: "/apps",
                    icon: LayoutPanelLeftIcon
                },
                {
                    name: "Dashboard",
                    url: "/",
                    icon: Gauge
                }
            ]
        },
        {
            groupName: "Manager",
            children: [
                {
                    name: "Stacks",
                    url: "/stack",
                    icon: Layers
                },
                {
                    name: "Containers",
                    url: "/container",
                    icon: Container
                },
                {
                    name: "Images",
                    url: "/images",
                    icon: Disc3Icon
                },
                {
                    name: "Networks",
                    url: "/network",
                    icon: NetworkIcon
                },
                {
                    name: "Volumes",
                    url: "/volume",
                    icon: HardDriveIcon
                }
            ]
        },
        {
            groupName: "Deploy",
            children: [
                {
                    name: "Registry",
                    url: "/registry",
                    icon: LibraryBigIcon
                },
                {
                    name: "Template",
                    url: "/template",
                    icon: BookDashedIcon
                }
            ]
        }
    ]

    return (
        <Sidebar>
            <SidebarHeader/>
            <SidebarContent>
                {sidebarItems.map((item) => (
                    <SidebarGroup>
                        <SidebarGroupLabel>{item.groupName}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.children.map(menu => (
                                    <SidebarMenuItem key={menu.name}>
                                        <SidebarMenuButton asChild isActive={"Apps" === menu.name}>
                                            <a href={menu.url}>
                                                <menu.icon/>
                                                <span>{menu.name}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    )
}
