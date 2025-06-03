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
