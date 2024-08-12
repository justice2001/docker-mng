import { Container } from 'common/dist/types/compose';
import { Button, Card, Flex, Tag } from 'antd';
import { Terminal } from '@icon-park/react';
import './container-info.css';
import { StackStatus } from 'common/dist/types/stacks';
import StatusTag from '../../status-tag/StatusTag.tsx';

interface ContainerInfoProps {
  compose: Container;
  name: string;
  endpoint: string;
  status: StackStatus;
  onBash: (service: string) => void;
}

const ContainerInfo = ({ compose, name, endpoint, status, onBash }: ContainerInfoProps) => {
  return (
    <>
      <Card size="small">
        <Flex justify="space-between" align="center">
          <Flex vertical align={'start'} gap={5} className={'container-info'}>
            <div className={'container-name'}>{name}</div>
            <div className={'container-image'}>{compose.image}</div>
            <Flex>
              <StatusTag status={status} />
              {compose.ports?.map((port: string) => {
                const info = port.split(':');
                return (
                  <Tag color={'geekblue'}>
                    <a className="port-tag" href={`http://${endpoint}:${info[0]}`} target={'_blank'}>
                      {info[0]}-&gt;{info[1]}
                    </a>
                  </Tag>
                );
              })}
            </Flex>
          </Flex>
          <Button disabled={status !== 'running'} onClick={() => onBash(name)} type={'primary'} icon={<Terminal />}>
            Bash
          </Button>
        </Flex>
      </Card>
    </>
  );
};

export default ContainerInfo;
