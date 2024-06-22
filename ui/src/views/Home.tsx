import React, { useEffect } from "react";
import { ProCard, StatisticCard } from "@ant-design/pro-components";
import { Space } from "antd";
import NodeList from "../component/home/NodeList";
import axios from "axios";
import RingChart from "../component/RingChart.tsx";
import { io } from "socket.io-client";

type ResourceStat = {
    cpu: number;
    memory: number;
    disk?: number;
}

const HomeView: React.FC = () => {

    const [resStat, setResStat] = React.useState<ResourceStat>({
        cpu: 0,
        memory: 0,
        disk: 0,
    });

    useEffect(() => {
        setInterval(() => {
            axios.get("/api/overview").then(r => {
                console.log(r)
                setResStat({
                    cpu: r.data.cpuUsage,
                    memory: r.data.memUsage
                })
            });
        }, 2000)

        const socket = io("http://localhost:3001");
        socket.on("connect", () => {
            console.log("connected")
        });

    }, [])

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }}>
                <ProCard headerBordered title={"容器概览"} bordered>
                    <StatisticCard.Group>
                        <StatisticCard
                            statistic={{
                                title: "总计",
                                value: 20
                            }}
                        />
                        <StatisticCard.Divider/>
                        <StatisticCard
                            statistic={{
                                title: "未操作",
                                value: 1,
                                status: "default"
                            }}
                        />
                        <StatisticCard
                            statistic={{
                                title: "正在运行",
                                value: 17,
                                status: "success"
                            }}
                        />
                        <StatisticCard
                            statistic={{
                                title: "部署中",
                                value: 0,
                                status: "processing"
                            }}
                        />
                        <StatisticCard
                            statistic={{
                                title: "状态异常",
                                value: 1,
                                status: "warning"
                            }}
                        />
                        <StatisticCard
                            statistic={{
                                title: "已停止",
                                value: 1,
                                status: "error"
                            }}
                        />
                    </StatisticCard.Group>
                </ProCard>

                <ProCard title={"资源池"} bordered headerBordered>
                    <StatisticCard.Group>
                        <StatisticCard statistic={{
                            title: "已注册节点",
                            value: 2,
                            status: "default"
                        }} />
                        <StatisticCard statistic={{
                            title: "已联机节点",
                            value: 1,
                            status: "success"
                        }} />
                        <StatisticCard.Divider />
                        <StatisticCard statistic={{
                            title: "CPU 占用率",
                            value: (resStat.cpu * 100).toFixed(2) + "%"
                        }} chart={<RingChart data={resStat.cpu} width={50} /> } chartPlacement={"left"}/>
                        <StatisticCard statistic={{
                            title: "内存占用率",
                            value: (resStat.memory * 100).toFixed(2) + "%"
                        }} chart={<RingChart data={resStat.memory} color={[ "#ffc245", "#E8EFF5" ]} width={50} />}
                        chartPlacement={"left"}/>
                    </StatisticCard.Group>
                </ProCard>
                <ProCard title={"节点列表"} bordered headerBordered>
                    <NodeList />
                </ProCard>
            </Space>
        </>
    );
};

export default HomeView;
