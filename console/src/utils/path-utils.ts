export function normalizePath(path: string) {
    const segments = path.split('/');
    const stack = [];
    for (const segment of segments) {
      if (segment === '' || segment === '.') continue;
      if (segment === '..') {
        if (stack.length > 0) stack.pop();
      } else {
        stack.push(segment);
      }
    }
    return '/' + stack.join('/');
  }

export function formatFileSize(kb: number) {
    const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
    let size = kb;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size = size / 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}