import React from "react";
import { Badge } from "antd";
import { BadgeMap } from "../types/antd";

type StatusBadgeProps = {
    map: Record<string, BadgeMap>;
    value: string;
};

const StatusBadge: React.FC<StatusBadgeProps> = (props: StatusBadgeProps) => (
    <Badge status={props.map[props.value].status} text={props.map[props.value].text} />
);

export default StatusBadge;
