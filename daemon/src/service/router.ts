import { EventEmitter } from 'events';
import { RouterCtx } from '../entities/ctx';
import { Socket } from 'socket.io';
import { IPacket } from 'common/dist/types/community';
import logger from 'common/dist/core/logger';
import authService from './auth-service';

/**
 * 路由触发器
 */
class RouterApp extends EventEmitter {
  authType: { [key: string]: number } = {};

  emitRouter(event: string, ctx: RouterCtx, data: any) {
    try {
      if (!this.authType[event] && this.authType[event] !== 0) {
        response(ctx, '未知的路由名称!', false);
        return this;
      }
      if (this.authType[event] == 1 && !authService.check(ctx.socket.id)) {
        response(ctx, '非法操作，请认证后再试!', false);
        return this;
      }
      // service logic routing trigger point
      super.emit(event, ctx, data);
    } catch (error: any) {
      ctx.socket.emit(ctx.event, {
        err: 'have some problem!',
      });
    }
    return this;
  }

  /**
   * 注册路由
   * @param event 路由标识
   * @param fn 回调方法
   * @param authType 认证标识：0-不需要认证，1-需要认证，2-单次密钥
   */
  on(event: string, fn: (ctx: RouterCtx, data: any) => void, authType: number = 1) {
    this.authType[event] = authType;
    return super.on(event, fn);
  }
}

export const routerApp = new RouterApp();

/**
 * 注册socket.io路由
 * @param socket socket
 */
export function navigation(socket: Socket) {
  for (const event of routerApp.eventNames()) {
    socket.on(event as string, (packet: IPacket<any>) => {
      logger.info(`request event: ${event as string}(${packet.uuid}) -> ${JSON.stringify(packet.data)}`, 'Router');
      const ctx: RouterCtx = {
        socket: socket,
        event: event as string,
        uuid: packet.uuid,
      };
      routerApp.emitRouter(event as string, ctx, packet.data);
    });
  }
}

/**
 * 返回响应
 * @param ctx 路由上下文
 * @param data 数据
 * @param ok 是否成功
 */
export function response(ctx: RouterCtx, data: any, ok: boolean = true) {
  const respPacket: IPacket<any> = {
    uuid: ctx.uuid,
    ok: ok,
    event: ctx.event,
    data: data,
  };
  logger.debug(`Response event: ${ctx.event}(${respPacket.uuid}) -> ${JSON.stringify(respPacket.data)}`, 'router');
  ctx.socket.emit(ctx.event, respPacket);
}

import '../routers/overview';
import '../routers/auth-router';
import '../routers/stack-router';
import '../routers/file-router';
