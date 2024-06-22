import React from "react";
import { ProList } from "@ant-design/pro-components";
import {
    ApiOutlined,
    CodeOutlined,
    DeleteOutlined,
    DockerOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { Badge, Button, Space } from "antd";
import ChipsetOutlined from "../../icon/ChipsetOutlined";
import MemoryOutlined from "../../icon/MemoryOutlined";
import ServerOutlined from "../../icon/ServerOutlined";
import { NodeData, NodeInfo } from "../../../../common/types/daemon.ts";

const statusMap: Record<string, {
    status: "success" | "default" | "processing" | "error" | "warning";
    text: string
}> = {
    "connected": {
        status: "success",
        text: "已连接，运行中"
    },
    "disconnected": {
        status: "error",
        text: "链接断开"
    },
    "registered": {
        status: "processing",
        text: "连接中"
    },
    "performance": {
        status: "warning",
        text: "性能警告"
    }
};

type NodeListProps = {
    lists: NodeData[]
}

const nodeList: React.FC<NodeListProps> = (props: NodeListProps) => {
    return (
        <>
            <ProList<NodeData>
                dataSource={props.lists}
                metas={{
                    avatar: {
                        render: () => <ServerOutlined style={{ fontSize: 22, color: "#1D63ED" }} />
                    },
                    title: {
                        dataIndex: "nodeName"
                    },
                    description: {
                        dataIndex: "nodeIp"
                    },
                    content: {
                        dataIndex: "nodeInfo",
                        render: (data) => {
                            const dt = data as unknown as NodeInfo;
                            return (
                                <Space size={"large"}>
                                    <Space direction={"vertical"}>
                                        <div><ChipsetOutlined /> {dt.cpu}</div>
                                        <div><MemoryOutlined /> {dt.memory}</div>
                                    </Space>
                                    <Space direction={"vertical"}>
                                        <div><DockerOutlined /> {dt.dockerVersion}</div>
                                        <div><ApiOutlined /> {dt.daemonVersion}</div>
                                    </Space>
                                    <div>
                                        <Badge status={statusMap[dt.nodeStatus]?.status || "default"}
                                            text={statusMap[dt.nodeStatus]?.text || "未知"} />
                                    </div>
                                </Space>
                            );
                        },
                    },
                    actions: {
                        render: () => [
                            <Button
                                type={"link"}
                                icon={<CodeOutlined />}
                            >
                                终端
                            </Button>,
                            <Button
                                type={"link"}
                                icon={<ReloadOutlined />}
                            >
                                重新连接
                            </Button>,
                            <Button
                                type={"link"}
                                icon={<DeleteOutlined />}
                                danger
                            >
                                删除节点
                            </Button>,
                        ]
                    }
                }}
            >

            </ProList>
        </>
    );
};

export default nodeList;
