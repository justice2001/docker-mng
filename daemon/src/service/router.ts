import { EventEmitter } from "events";
import { RouterCtx } from "../entities/ctx";
import { Socket } from "socket.io";
import { IPacket } from "../../../common/types/Community";

/**
 * 路由触发器
 */
class RouterApp extends EventEmitter {
    emitRouter(event: string, ctx: RouterCtx, data: any) {
        try {
            // service logic routing trigger point
            super.emit(event, ctx, data);
        } catch (error: any) {
            ctx.socket.emit(ctx.event, {
                err: "have some problem!"
            });
        }
        return this;
    }

    on(event: string, fn: (ctx: RouterCtx, data: any) => void) {
        return super.on(event, fn);
    }
}

export const routerApp = new RouterApp();

/**
 * 注册socket.io路由
 * @param socket socket
 */
export function navigation (socket: Socket) {
    for (const event of routerApp.eventNames()) {
        socket.on(event as string, (packet: IPacket<any>) => {
            const ctx: RouterCtx = {
                socket: socket,
                event: event as string,
                uuid: packet.uuid
            }
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
        data: data
    }
    ctx.socket.emit(ctx.event, respPacket);
}

import "../routers/overview"
import "../routers/auth-router"
import "../routers/stack-router"