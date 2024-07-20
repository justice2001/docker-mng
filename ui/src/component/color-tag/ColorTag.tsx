import React from 'react';
import { Tag } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { borderColor, stringToColor, textColor } from '../../utils/stack-utils.ts';

interface ColorTagProps {
  tag: string;
  children?: React.ReactNode;
}

const ColorTag: React.FC<ColorTagProps> = (props: ColorTagProps) => {
  const color = stringToColor(props.tag);
  return (
    <Tag
      icon={<TagOutlined />}
      color={color}
      style={{ color: textColor(props.tag), border: `1px solid ${borderColor(props.tag)}` }}
    >
      {props.children || props.tag}
    </Tag>
  );
};

export default ColorTag;
