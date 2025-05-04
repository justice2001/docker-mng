export interface FileItem {
    group: string;
    lastModified: string;
    name: string;
    owner: string;
    permission: string;
    size: number;
    type: 'dot' | 'dir' | 'file'
}