import { DButton } from "@/components/common/DButton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NodeData } from "@/constants/stack-constants";
import apiRequest from "@/utils/api-request";
import { EditIcon, LinkIcon, ServerIcon, TrashIcon, UnlinkIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const NodeSetting: React.FC = () => {
    const { t } = useTranslation()
    const [ servers, setServers ] = useState<NodeData[]>([]);

    useEffect(() => {
        getServers();
    }, [])

    const getServers = async () => {
        const servers = await apiRequest.get("/overview/servers");
        setServers(servers.data.servers);
    }

    return (<>
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead>{t("setting.node.name")}</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>{t("setting.node.status")}</TableHead>
                    <TableHead>{t("general.action")}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {servers.map((item) => (<TableRow>
                    <TableCell>
                        <div className="flex items-center gap-1">
                            <ServerIcon size={14} />
                            {item.nodeName}
                        </div>
                    </TableCell>
                    <TableCell>{item.nodeIp}:{item.nodeMngPort}</TableCell>
                    <TableCell>
                        <Badge variant="outline">
                            {item.nodeInfo.nodeStatus === 'connected' ? <LinkIcon size={14} color="green" /> : <UnlinkIcon size={14} color="red" />}
                            <span className="ml-1">{t(`setting.node.status.${item.nodeInfo.nodeStatus}`)}</span>
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <DButton  icon={<EditIcon />} size="sm" variant="link">{t("general.edit")}</DButton>
                            {item.nodeInfo.nodeStatus !== 'connected' && <DButton icon={<LinkIcon />} size="sm" variant="link">{t("setting.node.reconnect")}</DButton>}
                            <DButton icon={<TrashIcon />} size="sm" variant="link" className="text-red-500">{t("general.remove")}</DButton>
                        </div>
                    </TableCell>
                </TableRow>))}
            </TableBody>
        </Table>
    </>);
}