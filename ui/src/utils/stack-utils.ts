import { BadgeMap } from "../types/antd";

export const StackStatusMap: Record<string, BadgeMap> = {
    "running": {
        status: "success",
        text: "运行中"
    },
    "stopped": {
        status: "error",
        text: "已停止"
    }
};

export const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let j = 0; j < 3; j++) {
        let value = (hash >> (j * 8)) & 0xFF;
        color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
};

export const textColor = (bgColor: string) => {
    // 将背景颜色转换为RGB
    const rgb = parseInt(bgColor.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    // 根据亮度选择文本颜色
    return brightness > 125 ? "black" : "white"; // 根据亮度选择合适的文本颜色
};
