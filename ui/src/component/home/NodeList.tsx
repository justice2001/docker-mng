import React from "react";
import { ProList } from "@ant-design/pro-components";
import {
    ApiOutlined,
    CodeOutlined,
    DeleteOutlined,
    DockerOutlined, ReloadOutlined
} from "@ant-design/icons";
import { Badge, Button, Popconfirm, Space } from "antd";
import ChipsetOutlined from "../../icon/ChipsetOutlined";
import MemoryOutlined from "../../icon/MemoryOutlined";
import ServerOutlined from "../../icon/ServerOutlined";
import { NodeData, NodeInfo } from "../../../../common/types/daemon.ts";
import ApiRequest from "../../api/api-request.ts";

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
    lists: NodeData[];
    onRefresh: () => void;
}

const nodeList: React.FC<NodeListProps> = (props: NodeListProps) => {
    const reconnect = (endpoint: string) => {
        ApiRequest.put(`/nodes/reconnect/${endpoint}`).then(res => {
            if (res.data.ok) {
                props.onRefresh();
            }
        })
    }

    const deleteNode = (endpoint: string) => {
        ApiRequest.delete(`/nodes/${endpoint}`).then(res => {
            if (res.data.ok) {
                props.onRefresh();
            }
        })
    }

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
                        render: (_dom, row) => {
                            let list = []

                            if (row.nodeInfo.nodeStatus === "connected") {
                                list.push(
                                    <Button
                                        type={"link"}
                                        icon={<CodeOutlined />}
                                    >
                                        终端
                                    </Button>
                                );
                            }

                            list = list.concat([
                                <Button
                                    type={"link"}
                                    icon={<ReloadOutlined />}
                                    onClick={() => reconnect(row.nodeName)}
                                >
                                    重新连接
                                </Button>,
                                <Popconfirm title={"确定删除节点？"} onConfirm={() => deleteNode(row.nodeName)}>
                                    <Button
                                        type={"link"}
                                        icon={<DeleteOutlined />}
                                        danger
                                    >
                                        删除节点
                                    </Button>
                                </Popconfirm>,
                            ])

                            return list;
                        }
                    }
                }}
            >

            </ProList>
        </>
    );
};

export default nodeList;
