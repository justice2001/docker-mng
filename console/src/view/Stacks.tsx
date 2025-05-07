import { StacksCard } from '@/components/components/stacks/StackCard';
import { NodeData, Stacks as Stack } from '@/constants/stack-constants';
import apiRequest from '@/utils/api-request';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form.tsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { DButton } from '@/components/common/DButton';
import { MonitorDot, ScreenShareOff, SearchIcon } from 'lucide-react';

export const Stacks = () => {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [filteredStacks, setFilteredStacks] = useState<Stack[]>([]);
  const [serverList, setServerList] = useState<NodeData[]>([]);
  const { t } = useTranslation();

  // Force rerender select form
  const [ key, setKey ] = useState<string>();

  const formSchema = z.object({
    filter: z.string(),
    node: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filter: '',
      node: '',
    },
  });

  const onSearch = (f: { filter: string; node: string }) => {
    setFilteredStacks(
      stacks.filter((item) => {
        if (f.filter && !item.name.includes(f.filter)) return false;
        if (f.node && !(f.node === item.endpoint)) return false;
        return true;
      }),
    );
  };

  useEffect(() => {
    // 获取所有的服务器
    loadService();
  }, []);

  const loadService = () => {
    apiRequest.get('/overview/servers').then((res) => {
      const servers = res.data.servers;
      setServerList(servers);
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
        setFilteredStacks(stacks);
      });
    });
  };

  return (
    <div>
      <div className="text-xl">{t('menu.stacks')}</div>
      <div className="flex items-center mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSearch)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="filter"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t('stack.name')} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="node"
              render={({ field }) => (
                <FormItem className="w-40">
                  <Select key={key} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger value={field.value} onReset={() => {
                        console.log("run");
                        form.resetField("node")
                        // force rerender select form
                        setKey(""+new Date());
                      }}>
                        <SelectValue placeholder={t('stack.node')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serverList.map((item) => (
                        <SelectItem value={item.nodeName} key={item.nodeIp} textValue={item.nodeName}>
                          <div className='flex items-center gap-1'>
                            {item.nodeInfo.nodeStatus === 'connected' ? (
                              <MonitorDot color="green" size={14} />
                            ) : (
                              <ScreenShareOff color="red" size={14} />
                            )}
                            {item.nodeName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <DButton icon={<SearchIcon />} type="submit">
              {t('stack.filter.submit')}
            </DButton>
            <DButton onClick={() => {
              form.resetField("node")
            }}>Reset</DButton>
          </form>
        </Form>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-6">
        {filteredStacks.length < 1 && <div>{t('stack.empty')}</div>}
        {filteredStacks.map((item) => (
          <StacksCard stack={item} key={`${item.endpoint}/${item.name}`} onRefresh={loadService} />
        ))}
      </div>
    </div>
  );
};
