import { DButton } from "@/components/common/DButton";
import { FileExplorer } from "@/components/components/explorer/FileExplorer";
import { FileItem } from "common";
import apiRequest from "@/utils/api-request";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

export const DataExplorer = () => {
    const navigate = useNavigate();
    const { node, stack } = useParams();
    const { t } = useTranslation();

    const [ path, setPath ] = useState<string>("/");
    const [ fileList, setFileList ] = useState<FileItem[]>([]);

    useEffect(() => {
        getFileList("/");
    }, [])

    const getFileList = async (path: string = "/") => {
        setPath(path)
        const res = await apiRequest.get(`/data/${node}/${stack}?path=${path}`);
        setFileList(res.data)
    }

    return (<div>
        <div className="mb-4 flex items-center gap-3">
            <DButton size="sm" variant="outline" icon={<ChevronLeft />} onClick={() => {
                navigate(-1);
            }}>{t('general.back')}</DButton>
            <div>Stack: {node}/{stack}</div>
            <div>{t('explorer.path')}: {path}</div>
        </div>
        <FileExplorer list={fileList} path={path} onRoute={getFileList} />
    </div>);
}