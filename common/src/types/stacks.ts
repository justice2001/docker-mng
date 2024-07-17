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

export type Compose = {
  version: string;
  services: Record<string, Service>;
};

export type Service = {
  image: string;
  containerName: string;
  devices: string[];
  restart: string;
  environment: string[];
  volumes: string[];
  ports: string[];
};

export type ComposeEnv = Record<string, string>;

export type StackOperation = 'up' | 'stop' | 'down' | 'restart' | 'update';

/**
 * Docker Compose堆栈拓展属性
 */
export type StackExtend = {
  name?: string;
  // endpoint仅用于编辑
  endpoint?: string;
  icon?: string;
  tags?: string[];
  protected?: boolean;
};
