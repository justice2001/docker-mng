export type StackStatus = 'running' | 'unknown' | 'deploying' | 'warning' | 'stopped';

export type Stacks = {
  name: string;
  icon: string;
  tags: string[];
  protected: boolean;
  links: string[];
  endpoint: string;
  address?: string;
  state: StackStatus;
  envFile?: string;
  composeFile?: string;
};

export type NodeInfo = {
  cpu: string;
  memory: string;
  disk: string;
  dockerVersion: string;
  daemonVersion: string;
  nodeStatus: string;
};

export type NodeData = {
  nodeName: string;
  nodeIp: string;
  nodeMngPort: number;
  nodeInfo: NodeInfo;
};