import logger from 'common/dist/core/logger';

/**
 * 通过label列表获取链接
 * @param labels label列表
 */
export function getLabelHost(labels: any) {
  const links = [];
  if (Array.isArray(labels)) {
    for (const label of labels) {
      try {
        if (label.startsWith('traefik.http.routers.') && label.split(/[.=]/)[4] === 'rule') {
          links.push(...getHost(label.split('=')[1]));
        }
      } catch (e) {}
    }
  }
  if (typeof labels === 'object') {
    for (const label in labels) {
      try {
        if (label.startsWith('traefik.http.routers.') && label.split(/[.]/)[4] === 'rule') {
          links.push(...getHost(labels[label]));
        }
      } catch (e) {}
    }
  }
  return links;
}

/**
 * 通过rule获取Host链接
 * @param rule 规则，如Host("a.example.com") || Host('b.example.com')
 */
export function getHost(rule: string) {
  const links = [];
  const reg = /Host\(["'](.+?)["']\)/g;
  let match: RegExpExecArray | null = null;
  while ((match = reg.exec(rule)) !== null) {
    links.push(match[1]);
  }
  return links;
}
