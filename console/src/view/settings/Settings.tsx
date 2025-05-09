import { DynamicIcon, IconName } from "lucide-react/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router";

export const Settings: React.FC = () => {
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const navCN = (path: string) => {
        const baseClassName = " flex items-center gap-2 dark:text-gray-50 flex items-center gap-1 ";
        if (pathname === path) {
            return " text-gray-900 font-semibold  " + baseClassName;
        } else {
            return " text-gray-400 " + baseClassName;
        }
    }

    const navList: {
        name: string;
        icon: IconName,
        link: string
    }[] = [
        {
            "name": t("setting.basic"),
            "icon": "settings",
            "link": "/settings/basic"
        },
        {
            "name": t("setting.node"),
            "icon": "network",
            "link": "/settings/node"
        }
    ]

    return (
        <div>
            <div className="mx-auto grid gap-2 ">
                <h1 className="font-semibold text-2xl">{t("general.settings")}</h1>
            </div>
            <div className="flex mt-2">
                <div className="flex flex-col gap-2 py-4 pl-2 pr-20">
                    {navList.map(nav => <div className="text-gray-500 grid gap-4 dark:text-gray-400">
                        <a href={nav.link} className={navCN(nav.link)}>
                            <DynamicIcon name={nav.icon} size="1rem"/>
                            {nav.name}
                        </a>
                    </div>)}
                </div>
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}