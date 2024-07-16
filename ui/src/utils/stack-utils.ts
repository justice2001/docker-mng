import { BadgeMap } from '../types/antd';
import { StackStatus } from 'common/dist/types/stacks.ts';

export const StackStatusMap: Record<StackStatus, BadgeMap> = {
  running: {
    status: 'success',
    text: '运行中',
  },
  stopped: {
    status: 'error',
    text: '已停止',
  },
  unknown: {
    status: 'default',
    text: '未部署',
  },
  deploying: {
    status: 'processing',
    text: '处理中',
  },
  warning: {
    status: 'warning',
    text: '警告',
  },
};

const textHashColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let j = 0; j < 3; j++) {
    let value = (hash >> (j * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export const stringToColor = (str: string) => {
  const baseColor = textHashColor(str);
  let r = parseInt(baseColor.substring(1, 3), 16);
  let g = parseInt(baseColor.substring(3, 5), 16);
  let b = parseInt(baseColor.substring(5, 7), 16);

  // 将颜色调整为更浅的颜色
  r = Math.min(255, Math.floor((r + 255) / 2));
  g = Math.min(255, Math.floor((g + 255) / 2));
  b = Math.min(255, Math.floor((b + 255) / 2));

  const lightColor = `#${('00' + r.toString(16)).substr(-2)}${('00' + g.toString(16)).substr(-2)}${('00' + b.toString(16)).substr(-2)}33`; // 添加50%的透明度

  return lightColor;
};

export const textColor = (str: string) => {
  const baseColor = textHashColor(str);
  let r = parseInt(baseColor.substring(1, 3), 16);
  let g = parseInt(baseColor.substring(3, 5), 16);
  let b = parseInt(baseColor.substring(5, 7), 16);

  // 将颜色调整为更深的颜色
  r = Math.max(0, Math.floor(r / 2));
  g = Math.max(0, Math.floor(g / 2));
  b = Math.max(0, Math.floor(b / 2));

  const darkColor = `#${('00' + r.toString(16)).substr(-2)}${('00' + g.toString(16)).substr(-2)}${('00' + b.toString(16)).substr(-2)}ff`; // 不透明

  return darkColor;
};

export const borderColor = (str: string) => {
  const baseColor = textHashColor(str);
  let r = parseInt(baseColor.substring(1, 3), 16);
  let g = parseInt(baseColor.substring(3, 5), 16);
  let b = parseInt(baseColor.substring(5, 7), 16);

  // 将颜色调整为更深的颜色
  r = Math.max(0, Math.floor(r * 0.8));
  g = Math.max(0, Math.floor(g * 0.8));
  b = Math.max(0, Math.floor(b * 0.8));

  const darkBorderColor = `#${('00' + r.toString(16)).substr(-2)}${('00' + g.toString(16)).substr(-2)}${('00' + b.toString(16)).substr(-2)}ff`; // 不透明

  return darkBorderColor;
};
