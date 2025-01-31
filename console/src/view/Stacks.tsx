import { StacksCard } from '@/components/components/stacks/StackCard';
import { NodeData, Stacks as Stack } from '@/constants/stack-constants';
import apiRequest from '@/utils/api-request';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Stacks = () => {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    // 获取所有的服务器
    loadService();
  }, []);

  const loadService = () => {
    apiRequest.get('/overview/servers').then((res) => {
      const servers = res.data.servers;
      Promise.all(
          servers.map(async (server: NodeData) => {
            if (server.nodeInfo.nodeStatus === 'connected') {
              const res = await apiRequest.get(`/stacks/${server.nodeName}`);
              return res.data as Stack[];
            } else {
              return Promise.resolve([]);
            }
          }),
      ).then((res) => {
        const stacks = res.flatMap((stack) => stack);
        setStacks(stacks);
      });
    });
  }

  return (
    <div>
      <div className="text-xl">{t('menu.stacks')}</div>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {stacks.map((item) => (
          <StacksCard stack={item} key={`${item.endpoint}/${item.name}`} onRefresh={loadService} />
        ))}
      </div>
    </div>
  );
};
