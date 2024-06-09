import { StackStatus } from "../types/Stacks";
import { ProList, ProListProps } from "@ant-design/pro-components";
import { Badge, Button, Flex, Space, Tag } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import Avatar from "antd/es/avatar/avatar";
import StatusBadge from "../component/StatusBadge";
import { StackStatusMap, stringToColor, textColor } from "../utils/stack-utils";

type Stack = {
    name: string;
    icon: string;
    tags: string[];
    endpoint: string;
    state: StackStatus;
    envFile: string;
    composeFile: string;
};

const demoData: Stack[] = [
    {
        name: "nginx",
        icon: "https://www.svgrepo.com/show/373924/nginx.svg",
        tags: [ "website" ],
        endpoint: "10.0.0.28",
        state: "running",
        envFile: "PORT=880\nSSL_PORT=8443",
        composeFile: "version: 3.0\nservices...."
    },
    {
        name: "redis",
        icon: "https://cdn4.iconfinder.com/data/icons/redis-2/1451/Untitled-2-1024.png",
        tags: [ "tools", "dev" ],
        endpoint: "10.0.0.28",
        state: "stopped",
        envFile: "PORT=880\nSSL_PORT=8443",
        composeFile: "version: 3.0\nservices...."
    }
];

const ComposeView: React.FC = () => {
    const gridView:ProListProps<Stack> = {
        grid: {
            gutter: 16,
            column: 3
        },
        metas: {
            title: {
                dataIndex: "name"
            },
            avatar: {
                dataIndex: "icon",
                render: (dom, row) => (
                    <Avatar src={row.icon} style={{ marginRight: 8 }} />
                )
            },
            subTitle: {
                render: (dom, row) => (
                    <StatusBadge map={StackStatusMap} value={row.state} />
                )
            },
            content: {
                render: (dom, row) => {
                    return (<Space direction={"vertical"}>
                        <Space>
                            <LinkOutlined />
                            <a href={"//localhost:8080"}>8080</a>
                        </Space>
                        <Flex gap={"4px 0"} wrap>
                            <Tag color={"processing"}>{row.endpoint}</Tag>
                            {row.tags.map(tag => {
                                const color = stringToColor(tag);
                                return (<Tag color={color}
                                    style={{ color: textColor(color) }}>{tag}</Tag>);
                            })}
                        </Flex>
                    </Space>);
                }
            },
            actions: {
                render: () => [
                    <a>编辑</a>,
                    <a>删除</a>
                ]
            }
        }
    };

    return (
        <>
            <ProList<Stack>
                headerTitle={"堆栈列表"}
                dataSource={demoData}
                {...gridView}
            />
        </>
    );
};

export default ComposeView;
