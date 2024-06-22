export type StackStatus = "running" | "unknown" | "deploying" | "warning" | "stopped"

export type Stack = {
    name: string;
    icon: string;
    tags: string[];
    endpoint: string;
    state: StackStatus;
    envFile: string;
    composeFile?: string;
};

export type Compose = {
    version: string;
    services: Record<string, Service>;
}

export type Service = {
    image: string;
    containerName: string;
    devices: string[];
    restart: string;
    environment: string[];
    volumes: string[];
    ports: string[];
}

export type ComposeEnv = Record<string, string>;