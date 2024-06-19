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