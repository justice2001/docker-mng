import si from "systeminformation"

export type SystemInfo = {
    cpu: string;
    mem: string;
    disk: string;
}

export async function getSystemInfo(): Promise<SystemInfo> {
    const cpu = await si.cpu()
    const mem = await si.mem()
    const disk = await si.fsSize()
    return {
        cpu: `${cpu.cores} Cores`,
        mem: `${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB`,
        disk: `${(disk[0].size / 1024 / 1024 / 1024).toFixed(2)} GB`
    }
}