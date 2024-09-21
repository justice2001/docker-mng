import { StackStatus } from 'common/dist/types/stacks';
import { Tag } from 'antd';

interface StatusTagProps {
  status: StackStatus;
}

const StatusTag = ({ status }: StatusTagProps) => {
  switch (status) {
    case 'running':
      return <Tag color={'green'}>运行中</Tag>;
    case 'stopped':
      return <Tag color={'red'}>已停止</Tag>;
    case 'deploying':
      return <Tag color={'geekblue'}>部署中</Tag>;
    case 'warning':
      return <Tag color={'orange'}>警告</Tag>;
    case 'unknown':
      return <Tag color={'default'}>未部署</Tag>;
    default:
      return <Tag color={'default'}>未知</Tag>;
  }
};

export default StatusTag;
