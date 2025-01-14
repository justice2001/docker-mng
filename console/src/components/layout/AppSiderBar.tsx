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
import { useTranslation } from "react-i18next";

interface SidebarItems {
    groupName: string;
    children: {
        name: string;
        url: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    }[]
}

export function AppSidebar() {
    const { t } = useTranslation();

    const sidebarItems: SidebarItems[] = [
        {
            groupName: t("menu.dashboard"),
            children: [
                {
                    name: t("menu.apps"),
                    url: "/apps",
                    icon: LayoutPanelLeftIcon
                },
                {
                    name: t("menu.dashboard"),
                    url: "/",
                    icon: Gauge
                }
            ]
        },
        {
            groupName: t("menu.manager"),
            children: [
                {
                    name: t("menu.stacks"),
                    url: "/stack",
                    icon: Layers
                },
                {
                    name: t("menu.container"),
                    url: "/container",
                    icon: Container
                },
                {
                    name: t("menu.image"),
                    url: "/images",
                    icon: Disc3Icon
                },
                {
                    name: t("menu.network"),
                    url: "/network",
                    icon: NetworkIcon
                },
                {
                    name: t("menu.volumes"),
                    url: "/volume",
                    icon: HardDriveIcon
                }
            ]
        },
        {
            groupName: t("menu.deploy"),
            children: [
                {
                    name: t("menu.registry"),
                    url: "/registry",
                    icon: LibraryBigIcon
                },
                {
                    name: t("menu.template"),
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
