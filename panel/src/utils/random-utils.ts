/**
 * 生成随机密钥
 * @param length 密钥长度
 */
export const generateSecrets = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let secret = '';
  for (let i = 0; i < length; i++) {
    secret += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return secret;
};
