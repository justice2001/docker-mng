import React from "react";
import { GetProps } from "antd";
import Icon from "@ant-design/icons";

type CustomIconComponentProps = GetProps<typeof Icon>;

const DiskSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44 29H4V42H44V29Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/>
        <path
            d="M35.5 38C36.8807 38 38 36.8807 38 35.5C38 34.1193 36.8807 33 35.5 33C34.1193 33 33 34.1193 33 35.5C33 36.8807 34.1193 38 35.5 38Z"
            fill="#333"/>
        <path d="M4 28.9998L9.03837 4.99902H39.0205L44 28.9998" stroke="#333" stroke-width="4" stroke-linejoin="round"/>
        <path d="M10 35.5H27" stroke="#333" stroke-width="4" stroke-linecap="round"/>
    </svg>
);

const DiskOutlined = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={DiskSvg} {...props} />
);

export default DiskOutlined;
