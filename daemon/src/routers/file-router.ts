import { response, routerApp } from '../service/router';
import stackManager from '../service/stack-manager';

routerApp.on('data/list', async (ctx, data) => {
  try {
    const stack = await stackManager.getStack(data.name);
    if (!stack) {
      response(ctx, 'Stack not found!', false);
      return;
    }
    const dirList = await stack.listDataDir(data.path);
    response(ctx, dirList);
  } catch (e: any) {
    response(ctx, e.message, false);
  }
});

routerApp.on('data/file', async (ctx, data) => {
  try {
    const stack = await stackManager.getStack(data.name);
    if (!stack) {
      response(ctx, 'Stack not found!', false);
      return;
    }
    response(ctx, await stack.getDataFile(data.path));
  } catch (e: any) {
    response(ctx, e.message, false);
  }
});

routerApp.on('data/create', async (ctx, data) => {
  try {
    const stack = await stackManager.getStack(data.name);
    if (!stack) {
      response(ctx, 'Stack not found!', false);
      return;
    }
    await stack.createDataFile(data.path, data.isDir);
    response(ctx, 'Success');
  } catch (e: any) {
    response(ctx, e.message, false);
  }
});

routerApp.on('data/delete', async (ctx, data) => {
  try {
    const stack = await stackManager.getStack(data.name);
    if (!stack) {
      response(ctx, 'Stack not found!', false);
      return;
    }
    await stack.deleteDataFile(data.path);
    response(ctx, 'Success');
  } catch (e: any) {
    response(ctx, e.message, false);
  }
});

routerApp.on('data/update', async (ctx, data) => {
  try {
    const stack = await stackManager.getStack(data.name);
    if (!stack) {
      response(ctx, 'Stack not found!', false);
      return;
    }
    await stack.updateDataFile(data.path, data.data);
    response(ctx, 'Success');
  } catch (e: any) {
    response(ctx, e.message, false);
  }
});
