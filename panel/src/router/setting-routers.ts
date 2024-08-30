import Router from 'koa-router';
import configuration from '../core/configuration';
import bcrypt from 'bcrypt';

const settingRouters = new Router({
  prefix: '/settings',
});

settingRouters.post('/updatePassword', async (ctx) => {
  const { oldPassword, newPassword } = ctx.request.body;
  if (!oldPassword || !newPassword) {
    ctx.status = 400;
    ctx.body = {
      message: 'oldPassword or newPassword is empty',
    };
    return;
  }
  if (!bcrypt.compareSync(oldPassword, configuration.getConfig('password') as string)) {
    ctx.status = 500;
    ctx.body = {
      message: '旧密码错误！',
    };
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  configuration.updateConfig('password', bcrypt.hashSync(newPassword, salt));
  ctx.body = {
    message: '修改成功！',
  };
});

export default settingRouters;
