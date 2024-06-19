import React from "react";
import { ProCard } from "@ant-design/pro-components";
import { Button, Card, Col, Flex, Row, Space } from "antd";
import { Delete, DocumentFolder, Edit, PlayOne, Square, UpdateRotation } from "@icon-park/react";
import XTerminal from "../component/XTerminal.tsx";
import Editor from "../component/Editor.tsx";
import { Stack } from "../types/Stacks.ts";
import Avatar from "antd/es/avatar/avatar";
import StatusBadge from "../component/StatusBadge.tsx";
import { StackStatusMap } from "../utils/stack-utils.ts";

const ComposeDetail: React.FC = () => {
    const conf: Stack = {
        name: "nginx",
        icon: "https://www.svgrepo.com/show/373924/nginx.svg",
        tags: [ "website" ],
        endpoint: "10.0.0.28",
        state: "running",
        envFile: "PORT=880\nSSL_PORT=8443",
        composeFile: "version: \"3.3\"\n" +
            "services:\n" +
            "  flaresolverr:\n" +
            "    container_name: flaresolverr1\n" +
            "    ports:\n" +
            "      - 8191:8191\n" +
            "    environment:\n" +
            "      - LOG_LEVEL=info\n" +
            "    restart: unless-stopped\n" +
            "    image: ghcr.io/flaresolverr/flaresolverr:latest\n" +
            "    networks:\n" +
            "      - 1panel-network\n" +
            "networks:\n" +
            "  1panel-network:\n" +
            "    external: true\n" +
            "x-dockge:\n" +
            "  tags:\n" +
            "    - media\n"
    };

    return (
        <Space direction={"vertical"} style={{width: "100%"}}>
            <ProCard title={<>
                <Flex gap={5} align={"center"}>
                    <Avatar size={"large"} src={conf.icon} style={{ marginRight: 8 }} />
                    <Flex vertical>
                        <span style={{ marginRight: 8 }}>{conf.name}</span>
                        <StatusBadge map={StackStatusMap} value={conf.state}/>
                    </Flex>
                </Flex>
            </>} extra={<>
                <Flex gap={10}>
                    {conf.state !== "running" && <Button type={"primary"} icon={<PlayOne />}>启动</Button>}
                    {conf.state === "running" && <Button type={"primary"} danger icon={<Square />}>停止</Button>}
                    <Button icon={<Edit />}>编辑</Button>
                    <Button icon={<UpdateRotation />}>更新</Button>
                    <Button icon={<DocumentFolder />}>数据管理</Button>
                    <Button danger icon={<Delete />}>删除</Button>
                </Flex>
            </>}>
                <XTerminal />
            </ProCard>
            <ProCard title={"Stack"}>
                <Row gutter={[ 16, 16 ]}>
                    {Array.from({length: 12}, (_) => (<Col span={6}>
                        <Card>123</Card>
                    </Col>))}
                </Row>
            </ProCard>
            <ProCard title={"Compose配置"} >
                <Editor value={conf.composeFile} />
            </ProCard>
        </Space>
    );
}

export default ComposeDetail;